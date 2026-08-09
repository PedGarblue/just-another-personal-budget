import type {
  ExpenseSharePartner,
  ExpenseSharePartnerWrite,
} from '~~/types/expenseShareTypes'
import type { APIResourceResponse } from '~~/types/api'
import { fetchAPIAuth, useAPIAuth as useAPI } from '~~/composables/useAPIAuth'

export type {
  ExpenseSharePartner,
  ExpenseSharePartnerWrite,
} from '~~/types/expenseShareTypes'

export interface APIExpenseSharePartnerListResponse
  extends APIResourceResponse {
  results: ExpenseSharePartner[]
}

function isPaginated(
  data: ExpenseSharePartner[] | APIExpenseSharePartnerListResponse | null
): data is APIExpenseSharePartnerListResponse {
  return !!data && !Array.isArray(data) && Array.isArray(data.results)
}

export async function getExpenseSharePartnerList(params?: {
  is_active?: boolean
}): Promise<ExpenseSharePartner[]> {
  const search = new URLSearchParams()
  if (params?.is_active !== undefined) {
    search.append('is_active', String(params.is_active))
  }
  const qs = search.toString()
  const url = qs ? `/expense-share-partners/?${qs}` : `/expense-share-partners/`
  const { data } = await useAPI<
    ExpenseSharePartner[] | APIExpenseSharePartnerListResponse
  >(url)
  const value = data.value
  if (isPaginated(value)) return value.results
  return value ?? []
}

export async function getExpenseSharePartner(
  pk: number
): Promise<ExpenseSharePartner | null> {
  const url = `/expense-share-partners/${pk}/`
  const { data } = await useAPI<ExpenseSharePartner>(url)
  return data.value
}

export async function createExpenseSharePartner(
  body: ExpenseSharePartnerWrite
): Promise<ExpenseSharePartner | null> {
  const url = `/expense-share-partners/`
  return await fetchAPIAuth<ExpenseSharePartner>(url, {
    method: 'POST',
    body,
  })
}

export async function patchExpenseSharePartner(
  pk: number,
  body: ExpenseSharePartnerWrite
): Promise<ExpenseSharePartner | null> {
  const url = `/expense-share-partners/${pk}/`
  return await fetchAPIAuth<ExpenseSharePartner>(url, {
    method: 'PATCH',
    body,
  })
}

export async function deleteExpenseSharePartner(pk: number) {
  const url = `/expense-share-partners/${pk}/`
  await fetchAPIAuth(url, {
    method: 'DELETE',
  })
}
