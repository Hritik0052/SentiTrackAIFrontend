import { useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { AUTH_LOGOUT_EVENT } from "../lib/apiClient"
import { tokenStorage } from "../lib/tokenStorage"
import { authService } from "../services/authService"
import { AuthContext } from "./auth-context"
import type { LoginPayload, RegisterPayload, User } from "../types/auth"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      if (!tokenStorage.getAccessToken()) {
        setIsLoading(false)
        return
      }
      try {
        const me = await authService.me()
        if (!cancelled) setUser(me)
      } catch {
        tokenStorage.clear()
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const handleForcedLogout = () => setUser(null)
    window.addEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout)
    return () => window.removeEventListener(AUTH_LOGOUT_EVENT, handleForcedLogout)
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const tokens = await authService.login(payload)
    tokenStorage.setTokens(tokens.access_token, tokens.refresh_token)
    const me = await authService.me()
    setUser(me)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    await authService.register(payload)
    const tokens = await authService.login({ email: payload.email, password: payload.password })
    tokenStorage.setTokens(tokens.access_token, tokens.refresh_token)
    const me = await authService.me()
    setUser(me)
  }, [])

  const logout = useCallback(async () => {
    const refreshToken = tokenStorage.getRefreshToken()
    tokenStorage.clear()
    setUser(null)
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
