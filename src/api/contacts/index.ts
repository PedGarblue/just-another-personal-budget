import type { Contact } from '@/types/contactsTypes'
import type { APIResourceResponse } from '@/types/api'
import { useAPIAuth as useAPI } from '@/composables/useAPIAuth'

export type { Contact } from '@/types/contactsTypes'

export interface APIContactListResponse extends APIResourceResponse {
  results: Contact[]
}

export async function getContactList(params?: {
  page?: number
  page_size?: number
}): Promise<APIContactListResponse | null> {
  const search = new URLSearchParams()
  if (params?.page) search.append('page', String(params.page))
  if (params?.page_size) search.append('page_size', String(params.page_size))
  const qs = search.toString()
  const url = qs ? `/contacts/?${qs}` : `/contacts/`
  const { data } = await useAPI<APIContactListResponse>(url)
  return data.value
}

export async function getContact(pk: number): Promise<Contact | null> {
  const url = `/contacts/${pk}/`
  const { data } = await useAPI<Contact>(url)
  return data.value
}
