import { apiClient } from "../lib/apiClient"
import type {
  AdminStats,
  AdminUserDetail,
  AdminUserListResponse,
  AdminUserUpdatePayload,
  PlanCreatePayload,
  PlanSummary,
  PlanUpdatePayload,
} from "../types/billing"

export const adminService = {
  async getStats(): Promise<AdminStats> {
    const { data } = await apiClient.get<AdminStats>("/admin/stats")
    return data
  },

  async listPlans(): Promise<PlanSummary[]> {
    const { data } = await apiClient.get<PlanSummary[]>("/admin/plans")
    return data
  },

  async createPlan(payload: PlanCreatePayload): Promise<PlanSummary> {
    const { data } = await apiClient.post<PlanSummary>("/admin/plans", payload)
    return data
  },

  async updatePlan(planId: number, payload: PlanUpdatePayload): Promise<PlanSummary> {
    const { data } = await apiClient.patch<PlanSummary>(`/admin/plans/${planId}`, payload)
    return data
  },

  async setDefaultPlan(planId: number): Promise<PlanSummary> {
    const { data } = await apiClient.post<PlanSummary>(`/admin/plans/${planId}/set-default`)
    return data
  },

  async listUsers(params?: {
    q?: string
    page?: number
    page_size?: number
  }): Promise<AdminUserListResponse> {
    const { data } = await apiClient.get<AdminUserListResponse>("/admin/users", { params })
    return data
  },

  async getUser(userId: number): Promise<AdminUserDetail> {
    const { data } = await apiClient.get<AdminUserDetail>(`/admin/users/${userId}`)
    return data
  },

  async updateUser(userId: number, payload: AdminUserUpdatePayload): Promise<AdminUserDetail> {
    const { data } = await apiClient.patch<AdminUserDetail>(`/admin/users/${userId}`, payload)
    return data
  },
}
