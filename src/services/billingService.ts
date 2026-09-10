import { apiClient } from "../lib/apiClient"
import type {
  BillingMe,
  CreateCashfreeOrderPayload,
  CreateCashfreeOrderResponse,
  PlanSummary,
  UsageSnapshot,
} from "../types/billing"

export const billingService = {
  async getMyUsage(): Promise<UsageSnapshot> {
    const { data } = await apiClient.get<UsageSnapshot>("/users/me/usage")
    return data
  },

  async listPlans(): Promise<PlanSummary[]> {
    const { data } = await apiClient.get<PlanSummary[]>("/billing/plans")
    return data
  },

  async getBillingMe(): Promise<BillingMe> {
    const { data } = await apiClient.get<BillingMe>("/billing/me")
    return data
  },

  async createCashfreeOrder(
    payload: CreateCashfreeOrderPayload = {},
  ): Promise<CreateCashfreeOrderResponse> {
    const { data } = await apiClient.post<CreateCashfreeOrderResponse>(
      "/billing/cashfree/create-order",
      payload,
    )
    return data
  },
}
