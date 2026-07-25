import { apiClient } from "../lib/apiClient"
import type { PaginatedResponse } from "../types/journal"
import type { SearchParams, SearchResultItem } from "../types/search"

export const searchService = {
  async search(params: SearchParams): Promise<PaginatedResponse<SearchResultItem>> {
    const { data } = await apiClient.get<PaginatedResponse<SearchResultItem>>("/search", { params })
    return data
  },
}
