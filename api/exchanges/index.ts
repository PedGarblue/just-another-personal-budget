import { TransactionAPI } from '../transactions'

interface ExchangeFields {
  date: string
  description: string
  from_amount: string
  to_amount: string
  from_account: number
  to_account: number
}

export async function createExchange(data: ExchangeFields) {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/exchanges`
  const { data: created } = await useFetch<[TransactionAPI]>(url, {
    method: 'POST',
    body: data,
  })
  return created.value
}
