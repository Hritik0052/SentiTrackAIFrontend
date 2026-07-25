import { apiClient, ApiError } from "../lib/apiClient"
import type {
  Journal,
  JournalListParams,
  JournalPayload,
  PaginatedResponse,
  Sentiment,
} from "../types/journal"

export const journalService = {
  async list(params: JournalListParams = {}): Promise<PaginatedResponse<Journal>> {
    const { data } = await apiClient.get<PaginatedResponse<Journal>>("/journals", { params })
    return data
  },

  async get(id: number): Promise<Journal> {
    const { data } = await apiClient.get<Journal>(`/journals/${id}`)
    return data
  },

  async create(payload: JournalPayload): Promise<Journal> {
    const { data } = await apiClient.post<Journal>("/journals", payload)
    return data
  },

  async update(id: number, payload: Partial<JournalPayload>): Promise<Journal> {
    const { data } = await apiClient.put<Journal>(`/journals/${id}`, payload)
    return data
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/journals/${id}`)
  },

  async analyze(id: number): Promise<Sentiment> {
    const { data } = await apiClient.post<Sentiment>(`/journals/${id}/analyze`)
    return data
  },

  async getSentiment(id: number): Promise<Sentiment | null> {
    try {
      const { data } = await apiClient.get<Sentiment>(`/journals/${id}/sentiment`)
      return data
    } catch (error) {
      if (error instanceof ApiError && error.status === 404) {
        return null
      }
      throw error
    }
  },
}
