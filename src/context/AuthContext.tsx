import { useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { AUTH_LOGOUT_EVENT } from "../lib/apiClient"
import { tokenStorage } from "../lib/tokenStorage"
import { authService } from "../services/authService"
import { AuthContext } from "./auth-context"
import type { LoginPayload, RegisterPayload, User } from "../types/auth"

const BOOTSTRAP_TIMEOUT_MS = 15000

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!tokenStorage.getAccessToken()) {
        if (!cancelled) setIsLoading(false)
        return
      }

      try {
        const me = await Promise.race([
          authService.me(),
          new Promise<never>((_, reject) => {
            window.setTimeout(
              () => reject(new Error("Session check timed out")),
              BOOTSTRAP_TIMEOUT_MS,
            )
          }),
        ])
        if (!cancelled) setUser(me)
      } catch {
        tokenStorage.clear()
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const handleForcedLogout = () => {
      tokenStorage.clear()
      setUser(null)
      setIsLoading(false)
    }
    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout)
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout)
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const tokens = await authService.login(payload)
    tokenStorage.setTokens(tokens.access_token, tokens.refresh_token)
    const me = await authService.me()
    // Prefer login payload flag if /me is missing/lagging the field.
    if (tokens.is_admin === true && me.is_admin !== true) {
      me.is_admin = true
    }
    setUser(me)
    setIsLoading(false)
    return me
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    await authService.register(payload)
    const tokens = await authService.login({ email: payload.email, password: payload.password })
    tokenStorage.setTokens(tokens.access_token, tokens.refresh_token)
    const me = await authService.me()
    setUser(me)
    setIsLoading(false)
    return me
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken()
    tokenStorage.clear()
    setUser(null)
    setIsLoading(false)
    if (refreshToken) {
      try {
        await authService.logout(refreshToken)
      } catch {
        // Tokens are already cleared locally; a failed logout call is not user-facing.
      }
    }
  }, [])

  const updateUser = useCallback((next: User) => setUser(next), [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
      updateUser,
    }),
    [user, isLoading, login, register, logout, updateUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
