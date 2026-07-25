import axios, { AxiosError } from "axios"
import type { InternalAxiosRequestConfig } from "axios"
import { apiBaseUrl, env } from "../config/env"
import { tokenStorage } from "./tokenStorage"
import type { TokenPair } from "../types/auth"

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

function toApiError(error: AxiosError<BackendErrorEnvelope>): ApiError {
  if (error.response) {
    const envelope = error.response.data
    const type = envelope?.error?.type ?? "UnknownError"
    const message = envelope?.error
      ? extractMessage(envelope.error.detail)
      : "The server returned an unexpected response."
    return new ApiError(message, error.response.status, type)
  }
  if (error.request) {
    return new ApiError(
      "Could not reach SentiTrack AI. Check your connection and try again.",
      0,
      "NetworkError",
    )
  }
  return new ApiError(error.message, 0, "RequestSetupError")
}

/** Dispatched when refresh-token rotation fails, so AuthContext can clear session state. */
export const AUTH_LOGOUT_EVENT = "sentitrack:auth-logout"

type RetryableRequestConfig = InternalAxiosRequestConfig & { _retry?: boolean }

let isRefreshing = false
let refreshWaiters: Array<(token: string | null) => void> = []

function resolveWaiters(token: string | null) {
  refreshWaiters.forEach((resolve) => resolve(token))
  refreshWaiters = []
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<BackendErrorEnvelope>) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined
    const isAuthEndpoint =
      originalRequest?.url?.includes("/auth/login") || originalRequest?.url?.includes("/auth/refresh")

    if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isAuthEndpoint) {
      return Promise.reject(toApiError(error))
    }

    const refreshToken = tokenStorage.getRefreshToken()
    if (!refreshToken) {
      return Promise.reject(toApiError(error))
    }

    originalRequest._retry = true

    if (!isRefreshing) {
      isRefreshing = true
      try {
        const { data } = await axios.post<TokenPair>(`${apiBaseUrl}/auth/refresh`, {
          refresh_token: refreshToken,
        })
        tokenStorage.setTokens(data.access_token, data.refresh_token)
        resolveWaiters(data.access_token)
      } catch {
        tokenStorage.clear()
        resolveWaiters(null)
        window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT))
      } finally {
        isRefreshing = false
      }
    }

    return new Promise((resolve, reject) => {
      refreshWaiters.push((token) => {
        if (!token) {
          reject(toApiError(error))
          return
        }
        originalRequest.headers.set("Authorization", `Bearer ${token}`)
        resolve(apiClient(originalRequest))
      })
    })
  },
)

export async function pingHealth(): Promise<{ status: string; environment: string }> {
  const response = await axios.get(`${env.apiRootUrl}/health`, { timeout: env.apiTimeoutMs })
  return response.data
}
