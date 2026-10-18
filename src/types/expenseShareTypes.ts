/** Write payload for POST/PATCH /expense-share-partners/ */
export interface ExpenseSharePartnerWrite {
  contact: string
  is_active?: boolean
  default_partner_percent?: string | null
  includes?: number[]
  excludes?: number[]
}

/** GET list/detail response for expense-share partners */
export interface ExpenseSharePartner {
  id: number
  contact_id: number
  contact_name: string
  is_active: boolean
  default_partner_percent: string | null
  include_ids: number[]
  exclude_ids: number[]
  created_at: string
  updated_at: string
}

export interface ExpenseSharePeriodLine {
  id?: number
  category_id: number
  category_name: string
  expense_total_usd: string
  partner_share_usd: string
  transaction_count: number
}

/** GET preview response (not persisted) */
export interface ExpenseSharePreview {
  partner_id: number
  year: number
  month: number
  partner_percent: string
  total_expenses_usd: string
  partner_share_usd: string
  my_share_usd: string
  lines: ExpenseSharePeriodLine[]
}

/** POST finalize body */
export interface ExpenseShareFinalizeWrite {
  partner: number
  year: number
  month: number
  partner_percent: string
  due_date?: string
  notes?: string
}

export type ExpenseSharePeriodStatus = 'draft' | 'finalized'

/** GET list/detail / finalize response */
export interface ExpenseSharePeriod {
  id: number
  partner_id: number
  partner_contact_name: string
  year: number
  month: number
  status: ExpenseSharePeriodStatus
  partner_percent: string
  total_expenses_usd: string
  partner_share_usd: string
  my_share_usd: string
  receivable_id: number | null
  notes: string | null
  finalized_at: string | null
  lines: ExpenseSharePeriodLine[]
  created_at: string
  updated_at: string
}
