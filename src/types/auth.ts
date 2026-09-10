import type { PlanSummary } from "./billing"

export type { PlanSummary }

export interface User {
  id: number
  name: string
  email: string
  is_admin?: boolean
  plan?: PlanSummary | null
  created_at: string
  updated_at: string
}

export interface TokenPair {
  access_token: string
  refresh_token: string
  token_type: string
  is_admin?: boolean
}

export interface RegisterPayload {
  name: string
  email: string
  password: string
}

export interface LoginPayload {
  email: string
  password: string
}
