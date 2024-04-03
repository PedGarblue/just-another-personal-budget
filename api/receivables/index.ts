import type { ReceivableBase } from '~~/types/receivablesTypes'

export interface ReceivableAPIItem extends ReceivableBase {
  id: number
}

export async function getReceivableList(): Promise<[ReceivableAPIItem] | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/receivables/`
  const { data } = await useFetch<[ReceivableAPIItem]>(url)
  return data.value
}

export async function createReceivable(
  data: ReceivableBase
): Promise<ReceivableAPIItem | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/receivables/`
  const { data: created } = await useFetch<ReceivableAPIItem>(url, {
    method: 'POST',
    body: data,
  } as object)
  return created.value
}

export async function updateReceivable(
  pk: number,
  data: ReceivableBase
): Promise<ReceivableAPIItem | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/receivables/${pk}/`
  const { data: updated } = await useFetch<ReceivableAPIItem>(url, {
    method: 'PUT',
    body: data,
  } as object)
  return updated.value
}

export async function patchReceivable(
  pk: number,
  data: ReceivableBase
): Promise<ReceivableAPIItem | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/receivables/${pk}/`
  const { data: updated } = await useFetch<ReceivableAPIItem>(url, {
    method: 'PATCH',
    body: data,
  } as object)
  return updated.value
}

export async function deleteReceivable(pk: number) {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/receivables/${pk}/`
  await useFetch(url, {
    method: 'DELETE',
  })
}
