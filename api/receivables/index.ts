import type {
  ReceivableAPIItem,
  ReceivableWrite,
} from '~~/types/receivablesTypes'
import type { APIResourceResponse } from '~~/types/api'
import { useAPIAuth as useAPI } from '~~/composables/useAPIAuth'

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
  const { data: created } = await useAPI<ReceivableAPIItem>(url, {
    method: 'POST',
    body: data,
  } as object)
  return created.value
}

export async function updateReceivable(
  pk: number,
  data: ReceivableWrite
): Promise<ReceivableAPIItem | null> {
  const url = `/receivables/${pk}/`
  const { data: updated } = await useAPI<ReceivableAPIItem>(url, {
    method: 'PUT',
    body: data,
  } as object)
  return updated.value
}

export async function patchReceivable(
  pk: number,
  data: ReceivableWrite
): Promise<ReceivableAPIItem | null> {
  const url = `/receivables/${pk}/`
  const { data: updated } = await useAPI<ReceivableAPIItem>(url, {
    method: 'PATCH',
    body: data,
  } as object)
  return updated.value
}

export async function deleteReceivable(pk: number) {
  const url = `/receivables/${pk}/`
  await useAPI(url, {
    method: 'DELETE',
  })
}
