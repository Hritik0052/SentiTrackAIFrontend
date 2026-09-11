import { apiClient } from "../lib/apiClient"
import type { User } from "../types/auth"

export interface UpdateProfilePayload {
  name?: string
  email?: string
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}

export const userService = {
  async updateMe(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await apiClient.put<User>("/users/me", payload)
    return data
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await apiClient.post("/users/me/change-password", payload)
  },

  async deleteMe(): Promise<void> {
    await apiClient.delete("/users/me")
  },
}
