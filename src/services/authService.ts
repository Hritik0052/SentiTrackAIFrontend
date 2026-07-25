import { apiClient } from "../lib/apiClient"
import type { LoginPayload, RegisterPayload, TokenPair, User } from "../types/auth"

export const authService = {
  async register(payload: RegisterPayload): Promise<User> {
    const { data } = await apiClient.post<User>("/users/register", payload)
    return data
  },

  async login(payload: LoginPayload): Promise<TokenPair> {
    const { data } = await apiClient.post<TokenPair>("/auth/login", payload)
    return data
  },

  async logout(refreshToken: string): Promise<void> {
    await apiClient.post("/auth/logout", { refresh_token: refreshToken })
  },

  async me(): Promise<User> {
    const { data } = await apiClient.get<User>("/users/me")
    return data
  },
}
