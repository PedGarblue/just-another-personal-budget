import type {
  ExpenseShareFinalizeWrite,
  ExpenseSharePeriod,
  ExpenseSharePeriodStatus,
  ExpenseSharePreview,
} from '~~/types/expenseShareTypes'
import type { APIResourceResponse } from '~~/types/api'
import { fetchAPIAuth, useAPIAuth as useAPI } from '~~/composables/useAPIAuth'

export type {
  ExpenseShareFinalizeWrite,
  ExpenseSharePeriod,
  ExpenseSharePeriodStatus,
  ExpenseSharePreview,
} from '~~/types/expenseShareTypes'

export interface APIExpenseSharePeriodListResponse extends APIResourceResponse {
  results: ExpenseSharePeriod[]
}

function isPaginated(
  data: ExpenseSharePeriod[] | APIExpenseSharePeriodListResponse | null
): data is APIExpenseSharePeriodListResponse {
  return !!data && !Array.isArray(data) && Array.isArray(data.results)
}

export async function getExpenseSharePeriodList(params?: {
  year?: number
  month?: number
  partner?: number
  status?: ExpenseSharePeriodStatus
}): Promise<ExpenseSharePeriod[]> {
  const search = new URLSearchParams()
  if (params?.year !== undefined) search.append('year', String(params.year))
  if (params?.month !== undefined) search.append('month', String(params.month))
  if (params?.partner !== undefined)
    search.append('partner', String(params.partner))
  if (params?.status) search.append('status', params.status)
  const qs = search.toString()
  const url = qs ? `/expense-share-periods/?${qs}` : `/expense-share-periods/`
  const { data } = await useAPI<
    ExpenseSharePeriod[] | APIExpenseSharePeriodListResponse
  >(url)
  const value = data.value
  if (isPaginated(value)) return value.results
  return value ?? []
}

export async function getExpenseSharePeriod(
  pk: number
): Promise<ExpenseSharePeriod | null> {
  const url = `/expense-share-periods/${pk}/`
  const { data } = await useAPI<ExpenseSharePeriod>(url)
  return data.value
}

export async function previewExpenseSharePeriod(params: {
  partner: number
  year: number
  month: number
  partner_percent?: string
}): Promise<ExpenseSharePreview> {
  const search = new URLSearchParams()
  search.append('partner', String(params.partner))
  search.append('year', String(params.year))
  search.append('month', String(params.month))
  if (params.partner_percent !== undefined && params.partner_percent !== '') {
    search.append('partner_percent', params.partner_percent)
  }
  const url = `/expense-share-periods/preview/?${search.toString()}`
  return await fetchAPIAuth<ExpenseSharePreview>(url)
}

export async function finalizeExpenseSharePeriod(
  body: ExpenseShareFinalizeWrite
): Promise<ExpenseSharePeriod | null> {
  const url = `/expense-share-periods/finalize/`
  return await fetchAPIAuth<ExpenseSharePeriod>(url, {
    method: 'POST',
    body,
  })
}
