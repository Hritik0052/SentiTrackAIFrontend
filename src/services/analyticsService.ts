import { apiClient } from "../lib/apiClient"
import type {
  DashboardAnalytics,
  MonthlyAnalytics,
  MoodDistribution,
  YearlyAnalytics,
} from "../types/analytics"

export const analyticsService = {
  async dashboard(): Promise<DashboardAnalytics> {
    const { data } = await apiClient.get<DashboardAnalytics>("/analytics/dashboard")
    return data
  },

  async moodDistribution(): Promise<MoodDistribution> {
    const { data } = await apiClient.get<MoodDistribution>("/analytics/mood-distribution")
    return data
  },

  async monthly(year: number): Promise<MonthlyAnalytics> {
    const { data } = await apiClient.get<MonthlyAnalytics>("/analytics/monthly", { params: { year } })
    return data
  },

  async yearly(): Promise<YearlyAnalytics> {
    const { data } = await apiClient.get<YearlyAnalytics>("/analytics/yearly")
    return data
  },
}
