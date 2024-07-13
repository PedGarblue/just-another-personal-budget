import type { TransactionAPI } from '../transactions'
import { useAPI } from '~~/composables/useAPI'

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
  const { data: created } = await useAPI<[TransactionAPI]>(
    url,
    options as object
  )
  return created.value
}
