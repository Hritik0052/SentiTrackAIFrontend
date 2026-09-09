export interface StreakStatus {
  current_streak: number
  longest_streak: number
  freeze_tokens: number
  freezes_used_total: number
  last_entry_date: string | null
  is_paused: boolean
  milestones_reached: number[]
  next_milestone: number | null
  days_to_next_milestone: number | null
  near_milestone_hint: string | null
}

export interface XpEvent {
  id: number
  action: string
  amount: number
  created_at: string
}

export interface XpStatus {
  total_xp: number
  level: number
  level_name: string
  xp_into_level: number
  xp_for_next_level: number | null
  progress_percent: number
  recent_events: XpEvent[]
}

export interface UserBadge {
  key: string
  title: string
  description: string
  rarity: string
  image_key: string
  unlocked: boolean
  unlocked_at: string | null
}

export interface BadgeList {
  badges: UserBadge[]
  unlocked_count: number
  total_count: number
}

export interface Challenge {
  key: string
  title: string
  description: string
  period: string
  target: number
  progress: number
  completed: boolean
  xp_reward: number
  starts_on: string
  ends_on: string
}

export interface ChallengeList {
  challenges: Challenge[]
}
