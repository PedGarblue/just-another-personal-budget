export interface ExpenseCategoryChild {
  category_id: number
  category_name: string
  total_amount_usd: string
}

export interface ExpenseCategorySummary {
  category_id: number
  category_name: string
  total_amount_usd: string
  children: ExpenseCategoryChild[]
}

export interface MalformedTransaction {
  id: number
  description: string
  date: string
  amount: string
  currency: string
  reason: string
}

export type ExpensesPeriod = 'current_week' | 'current_month'

export interface ExpensesSummaryResponse {
  period: ExpensesPeriod
  from_date: string
  to_date: string
  total: string
  summary: ExpenseCategorySummary[]
  malformed_transactions: MalformedTransaction[]
}
