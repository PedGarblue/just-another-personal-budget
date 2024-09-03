import type { ReceivableBase } from '~~/types/receivablesTypes'
import type { APIResourceResponse } from '~~/types/api'
import { useAPIAuth as useAPI } from '~~/composables/useAPIAuth'

export interface ReceivableAPIItem extends ReceivableBase {
  id: number
}

export interface APIReceivableListResponse extends APIResourceResponse {
  results: ReceivableAPIItem[]
}

export async function getReceivableList(): Promise<APIReceivableListResponse | null> {
  const url = `/receivables/`
  const { data } = await useAPI<APIReceivableListResponse>(url)
  return data.value
}

export async function createReceivable(
  data: ReceivableBase
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
  data: ReceivableBase
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
  data: ReceivableBase
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
