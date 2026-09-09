import { apiClient } from "../lib/apiClient"
import type { BadgeList, ChallengeList, StreakStatus, XpStatus } from "../types/gamification"

export const gamificationService = {
  async streaks(): Promise<StreakStatus> {
    const { data } = await apiClient.get<StreakStatus>("/gamification/streaks")
    return data
  },

  async xp(): Promise<XpStatus> {
    const { data } = await apiClient.get<XpStatus>("/gamification/xp")
    return data
  },

  async badges(): Promise<BadgeList> {
    const { data } = await apiClient.get<BadgeList>("/gamification/badges")
    return data
  },

  async challenges(): Promise<ChallengeList> {
    const { data } = await apiClient.get<ChallengeList>("/gamification/challenges")
    return data
  },
}
