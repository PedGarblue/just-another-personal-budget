import type {
  ReceivableAPIItem,
  ReceivableWrite,
} from '~~/types/receivablesTypes'
import type { ReceivableGroup } from '~~/types/contactsTypes'
import type { APIResourceResponse } from '~~/types/api'
import { fetchAPIAuth, useAPIAuth as useAPI } from '~~/composables/useAPIAuth'

export type { ReceivableGroup } from '~~/types/contactsTypes'

export type {
  ReceivableAPIItem,
  ReceivableWrite,
  ReceivableLinkedTransaction,
} from '~~/types/receivablesTypes'

export interface APIReceivableListResponse extends APIResourceResponse {
  results: ReceivableAPIItem[]
}

export async function getReceivableList(params?: {
  page?: number
  page_size?: number
}): Promise<APIReceivableListResponse | null> {
  const search = new URLSearchParams()
  if (params?.page) search.append('page', String(params.page))
  if (params?.page_size) search.append('page_size', String(params.page_size))
  const qs = search.toString()
  const url = qs ? `/receivables/?${qs}` : `/receivables/`
  const { data } = await useAPI<APIReceivableListResponse>(url)
  return data.value
}

export async function getReceivablesGroupedByContact(): Promise<
  ReceivableGroup[] | null
> {
  const { data } = await useAPI<ReceivableGroup[]>(
    '/receivables/?group_by=contact'
  )
  return data.value
}

export async function getReceivable(
  pk: number
): Promise<ReceivableAPIItem | null> {
  const url = `/receivables/${pk}/`
  const { data } = await useAPI<ReceivableAPIItem>(url)
  return data.value
}

export async function createReceivable(
  data: ReceivableWrite
): Promise<ReceivableAPIItem | null> {
  const url = `/receivables/`
  return await fetchAPIAuth<ReceivableAPIItem>(url, {
    method: 'POST',
    body: data,
  })
}

export async function updateReceivable(
  pk: number,
  data: ReceivableWrite
): Promise<ReceivableAPIItem | null> {
  const url = `/receivables/${pk}/`
  return await fetchAPIAuth<ReceivableAPIItem>(url, {
    method: 'PUT',
    body: data,
  })
}

export async function patchReceivable(
  pk: number,
  data: ReceivableWrite
): Promise<ReceivableAPIItem | null> {
  const url = `/receivables/${pk}/`
  return await fetchAPIAuth<ReceivableAPIItem>(url, {
    method: 'PATCH',
    body: data,
  })
}

export async function deleteReceivable(pk: number) {
  const url = `/receivables/${pk}/`
  await fetchAPIAuth(url, {
    method: 'DELETE',
  })
}
