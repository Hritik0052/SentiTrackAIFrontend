import axios, { AxiosError } from "axios"
import { apiBaseUrl, env } from "../config/env"
import { tokenStorage } from "./tokenStorage"

/**
 * SentiTrack AI backend wraps every handled error as:
 * { "error": { "type": "ErrorType", "detail": "Message or validation details" } }
 * `detail` is usually a string, but FastAPI validation errors can send an
 * array of { loc, msg, type } objects instead.
 */
interface BackendErrorEnvelope {
  error: {
    type: string
    detail: string | Array<{ msg?: string; loc?: unknown[] }> | Record<string, unknown>
  }
}

export class ApiError extends Error {
  readonly status: number
  readonly type: string

  constructor(message: string, status: number, type: string) {
    super(message)
    this.name = "ApiError"
    this.status = status
    this.type = type
  }
}

function extractMessage(detail: BackendErrorEnvelope["error"]["detail"]): string {
  if (typeof detail === "string") return detail
  if (Array.isArray(detail)) {
    const messages = detail.map((item) => item?.msg).filter(Boolean)
    if (messages.length) return messages.join(" ")
  }
  return "Something went wrong. Please try again."
}

export const apiClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: env.apiTimeoutMs,
  headers: {
    "Content-Type": "application/json",
  },
})

apiClient.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<BackendErrorEnvelope>) => {
    if (error.response) {
      const envelope = error.response.data
      const type = envelope?.error?.type ?? "UnknownError"
      const message = envelope?.error
        ? extractMessage(envelope.error.detail)
        : "The server returned an unexpected response."
      return Promise.reject(new ApiError(message, error.response.status, type))
    }
    if (error.request) {
      return Promise.reject(
        new ApiError(
          "Could not reach SentiTrack AI. Check your connection and try again.",
          0,
          "NetworkError",
        ),
      )
    }
    return Promise.reject(new ApiError(error.message, 0, "RequestSetupError"))
  },
)

export async function pingHealth(): Promise<{ status: string; environment: string }> {
  const response = await axios.get(`${env.apiRootUrl}/health`, { timeout: env.apiTimeoutMs })
  return response.data
}
