export interface WeeklySummary {
  id: number
  week_start: string
  week_end: string
  summary: string
  suggestions: string[]
  entry_count: number
  created_at: string
  updated_at: string
}

export interface GenerateWeeklySummaryPayload {
  week_of?: string
}
