import type { Sentiment, SentimentLabel, SortOrder } from "./journal"

export interface SearchResultItem {
  id: number
  title: string | null
  content: string
  created_at: string
  updated_at: string
  sentiment: Sentiment | null
}

export interface SearchParams {
  q?: string
  date_from?: string
  date_to?: string
  mood?: string
  emotion?: string
  sentiment?: SentimentLabel
  sort_by?: "created_at" | "updated_at" | "title"
  order?: SortOrder
  page?: number
  page_size?: number
}
