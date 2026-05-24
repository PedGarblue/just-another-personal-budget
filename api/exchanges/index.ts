import type { TransactionAPI } from '../transactions'
import { useAPIAuth as useAPI } from '~~/composables/useAPIAuth'
import { unwrapAPIResponse } from '~~/utils/apiError'

interface ExchangeFields {
  date: string
  description?: string
  from_amount: string
  to_amount: string
  from_account: number
  to_account: number
}

export async function createExchange(data: ExchangeFields) {
  const url = `/exchanges/`
  const options = {
    method: 'POST',
    body: data,
  }
  const result = await useAPI<[TransactionAPI]>(url, options as object)
  return unwrapAPIResponse(result)
}
