const raw = import.meta.env

function toBool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback
  return value === "true" || value === "1"
}

function toNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

export const env = {
  appName: raw.VITE_APP_NAME || "SentiTrack AI",
  appEnv: raw.VITE_APP_ENV || "development",
  apiRootUrl: (raw.VITE_API_ROOT_URL || "http://127.0.0.1:8000").replace(/\/+$/, ""),
  apiV1Prefix: raw.VITE_API_V1_PREFIX || "/api/v1",
  apiTimeoutMs: toNumber(raw.VITE_API_TIMEOUT_MS, 45000),
  enableHealthCheck: toBool(raw.VITE_ENABLE_HEALTH_CHECK, true),
  healthCheckIntervalMs: toNumber(raw.VITE_HEALTH_CHECK_INTERVAL_MS, 60000),
  contactEmail: raw.VITE_CONTACT_EMAIL || "hello@sentitrack.ai",
}

export const apiBaseUrl = `${env.apiRootUrl}${env.apiV1Prefix}`
