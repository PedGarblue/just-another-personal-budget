import type { MalformedTransaction } from './expenses'

export type CategoryTrendGranularity = 'monthly' | 'weekly'

export interface CategoryTrendChild {
  category_id: number
  category_name: string
  total_amount_usd: string
}

export interface CategoryTrendPeriod {
  period_start: string
  period_end: string
  label: string
  total_amount_usd: string
  children: CategoryTrendChild[]
}

export interface CategoryTrendParams {
  category: number
  start_date: string
  end_date: string
  granularity?: CategoryTrendGranularity
  exclude_categories?: string
  include_categories?: string
}

export interface CategoryTrendResponse {
  category_id: number
  category_name: string
  start_date: string
  end_date: string
  granularity: CategoryTrendGranularity
  periods: CategoryTrendPeriod[]
  grand_total_usd: string
  malformed_transactions: MalformedTransaction[]
}
