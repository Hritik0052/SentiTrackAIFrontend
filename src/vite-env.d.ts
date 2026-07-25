/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_ENV: string
  readonly VITE_API_ROOT_URL: string
  readonly VITE_API_V1_PREFIX: string
  readonly VITE_API_TIMEOUT_MS: string
  readonly VITE_ENABLE_HEALTH_CHECK: string
  readonly VITE_HEALTH_CHECK_INTERVAL_MS: string
  readonly VITE_CONTACT_EMAIL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
