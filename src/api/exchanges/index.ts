import type { TransactionAPI } from '../transactions'
import { fetchAPIAuth } from '@/composables/useAPIAuth'

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
  return await fetchAPIAuth<[TransactionAPI]>(url, options)
}
