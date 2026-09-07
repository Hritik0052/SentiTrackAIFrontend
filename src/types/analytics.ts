export interface SentimentCounts {
  positive: number
  neutral: number
  negative: number
}

export interface DashboardAnalytics {
  total_entries: number
  analyzed_entries: number
  sentiment_counts: SentimentCounts
  average_confidence: number
  most_common_emotion: string | null
  most_common_mood: string | null
  current_streak: number
  longest_streak: number
  entries_this_week: number
  entries_this_month: number
  first_entry_at: string | null
  last_entry_at: string | null
}

export interface LabelCount {
  label: string
  count: number
}

export interface MoodDistribution {
  total_analyzed: number
  sentiment_counts: SentimentCounts
  emotions: LabelCount[]
  moods: LabelCount[]
}

export interface PeriodAnalytics {
  period: string
  entries: number
  analyzed: number
  sentiment_counts: SentimentCounts
  average_confidence: number
  most_common_emotion: string | null
}

export interface MonthlyAnalytics {
  year: number
  months: PeriodAnalytics[]
}

export interface YearlyAnalytics {
  years: PeriodAnalytics[]
}

export type MoodTrendPeriod = "week" | "month" | "custom"

export interface MoodTrendBucket {
  date: string
  sentiment: SentimentCounts
  emotions: Record<string, number>
}

export interface MoodTrends {
  period: MoodTrendPeriod
  start: string
  end: string
  granularity: "day"
  buckets: MoodTrendBucket[]
  series: {
    sentiment: Array<"positive" | "neutral" | "negative">
    emotions: string[]
  }
  totals: {
    entries: number
    analyzed: number
    sentiment_counts: SentimentCounts
    emotion_counts: Record<string, number>
  }
}
