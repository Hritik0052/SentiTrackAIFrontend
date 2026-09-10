import { apiClient } from "../lib/apiClient"
import type { UsageSnapshot } from "../types/billing"

export const billingService = {
  async getMyUsage(): Promise<UsageSnapshot> {
    const { data } = await apiClient.get<UsageSnapshot>("/users/me/usage")
    return data
  },
}
