export interface ExpenseCategoryChild {
  category_id: number
  category_name: string
  total_amount_usd: number
}

export interface ExpenseCategorySummary {
  category_id: number
  category_name: string
  total_amount_usd: number
  children: ExpenseCategoryChild[]
}

export interface MalformedTransaction {
  id: number
  description: string
  date: string
  amount: number
  currency: string
  reason: string
}

export type ExpensesPeriod = 'current_week' | 'current_month'

export interface ExpensesSummaryResponse {
  period: ExpensesPeriod
  from_date: string
  to_date: string
  total: number
  summary: ExpenseCategorySummary[]
  malformed_transactions: MalformedTransaction[]
}
