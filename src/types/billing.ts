export interface PlanSummary {
  id: number
  code: string
  name: string
  description: string | null
  daily_journal_limit: number | null
  weekly_summary_limit: number | null
  daily_analyze_limit: number | null
  weekly_insights_limit: number | null
  is_default: boolean
  is_active: boolean
  sort_order: number
  price_inr: number | null
  billing_period: string | null
}

export interface QuotaBucket {
  used: number
  limit: number | null
  remaining: number | null
}

export interface UsageSnapshot {
  plan: PlanSummary | null
  journals_today: QuotaBucket
  analyze_today: QuotaBucket
  weekly_summaries_this_week: QuotaBucket
  insights_this_week: QuotaBucket
}

export interface PlanCreatePayload {
  code: string
  name: string
  description?: string | null
  daily_journal_limit?: number | null
  weekly_summary_limit?: number | null
  daily_analyze_limit?: number | null
  weekly_insights_limit?: number | null
  is_active?: boolean
  sort_order?: number
  price_inr?: number | null
  billing_period?: string | null
}

export type PlanUpdatePayload = Partial<Omit<PlanCreatePayload, "code">>

export interface AdminStats {
  total_users: number
  admin_users: number
  journals_today: number
  analyze_today: number
  weekly_summaries_today: number
  insights_today: number
  plan_counts: Record<string, number>
}

export interface AdminUserListItem {
  id: number
  name: string
  email: string
  is_admin: boolean
  created_at: string
  plan: PlanSummary | null
  subscription_status: string | null
}

export interface AdminUserDetail extends AdminUserListItem {
  notes: string | null
  usage: UsageSnapshot | null
}

export interface AdminUserUpdatePayload {
  plan_id?: number | null
  is_admin?: boolean | null
  notes?: string | null
  status?: "active" | "canceled"
}

export interface AdminUserListResponse {
  items: AdminUserListItem[]
  total: number
  page: number
  page_size: number
}

export interface CreateCashfreeOrderPayload {
  plan_code?: string
  customer_phone?: string
}

export interface CreateCashfreeOrderResponse {
  order_id: string
  payment_session_id: string
  order_amount: number
  order_currency: string
  env: string
  plan: PlanSummary
}

export interface BillingMe {
  plan: PlanSummary | null
  status: string | null
  payment_provider: string | null
  cashfree_order_id: string | null
  cashfree_configured: boolean
  cashfree_env: string
}
