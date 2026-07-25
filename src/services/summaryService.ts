import { apiClient } from "../lib/apiClient"
import type { GenerateWeeklySummaryPayload, WeeklySummary } from "../types/summary"

export const summaryService = {
  async generate(payload: GenerateWeeklySummaryPayload = {}): Promise<WeeklySummary> {
    const { data } = await apiClient.post<WeeklySummary>("/summary/weekly", payload)
    return data
  },

  async list(): Promise<WeeklySummary[]> {
    const { data } = await apiClient.get<WeeklySummary[]>("/summary/weekly")
    return data
  },

  async get(id: number): Promise<WeeklySummary> {
    const { data } = await apiClient.get<WeeklySummary>(`/summary/weekly/${id}`)
    return data
  },
}
