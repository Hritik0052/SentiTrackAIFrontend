import { apiClient } from "../lib/apiClient"
import type { User } from "../types/auth"

export interface UpdateProfilePayload {
  name?: string
  email?: string
  password?: string
}

export const userService = {
  async updateMe(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await apiClient.put<User>("/users/me", payload)
    return data
  },

  async deleteMe(): Promise<void> {
    await apiClient.delete("/users/me")
  },
}
