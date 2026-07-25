export interface Journal {
  id: number
  title: string | null
  content: string
  created_at: string
  updated_at: string
}

export type SentimentLabel = "positive" | "neutral" | "negative"

export interface Sentiment {
  id: number
  journal_id: number
  sentiment: SentimentLabel
  mood: string
  emotion: string
  confidence: number
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  total_pages: number
}

export type JournalSortBy = "created_at" | "updated_at" | "title"
export type SortOrder = "asc" | "desc"

export interface JournalListParams {
  page?: number
  page_size?: number
  sort_by?: JournalSortBy
  order?: SortOrder
  q?: string
}

export interface JournalPayload {
  title?: string
  content: string
}
