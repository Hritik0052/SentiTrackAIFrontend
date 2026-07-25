import { useEffect, useState } from "react"
import { env } from "../config/env"
import { pingHealth } from "../lib/apiClient"

export type HealthStatus = "checking" | "online" | "offline"

export function useHealthCheck() {
  const [status, setStatus] = useState<HealthStatus>("checking")
  const [environment, setEnvironment] = useState<string | null>(null)

  useEffect(() => {
    if (!env.enableHealthCheck) return

    let cancelled = false

    async function check() {
      try {
        const data = await pingHealth()
        if (cancelled) return
        setStatus(data.status === "ok" ? "online" : "offline")
        setEnvironment(data.environment)
      } catch {
        if (!cancelled) setStatus("offline")
      }
    }

    check()
    const interval = setInterval(check, env.healthCheckIntervalMs)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return { status, environment }
}
