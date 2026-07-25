import { apiClient } from "../lib/apiClient"
import type { Insight } from "../types/insights"
import type { PaginatedResponse } from "../types/journal"

export const insightsService = {
  async generate(): Promise<Insight[]> {
    const { data } = await apiClient.post<Insight[]>("/insights/generate")
    return data
  },

  async list(page = 1, pageSize = 20): Promise<PaginatedResponse<Insight>> {
    const { data } = await apiClient.get<PaginatedResponse<Insight>>("/insights", {
      params: { page, page_size: pageSize },
    })
    return data
  },
}
