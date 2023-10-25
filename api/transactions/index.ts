export interface TransactionBase {
  amount: string
  description: string
  account: number
  date: Date
}

// returns from the api
export interface TransactionAPI extends TransactionBase {
  id: number
}

export default async function (
  from?: string,
  to?: string,
  account?: number
): Promise<[TransactionAPI] | null> {
  const runtimeConfig = useRuntimeConfig()
  const params = new URLSearchParams()
  if (from) {
    params.append('start_date', from)
  }
  if (to) {
    params.append('end_date', to)
  }
  if (account) {
    params.append('account', account.toString())
  }
  const url = `${
    runtimeConfig.public.apiUrl
  }/transactions/?${params.toString()}`
  const { data: transactions } = await useFetch<[TransactionAPI]>(url)
  return transactions.value
}

export async function createTransaction(
  data: TransactionBase
): Promise<TransactionAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/transactions/`
  const { data: created } = await useFetch<TransactionAPI>(url, {
    method: 'POST',
    body: data,
  })
  return created.value
}

export async function updateTransaction(
  pk: number,
  data: TransactionBase
): Promise<TransactionAPI | null> {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/transactions/${pk}/`
  const { data: updated } = await useFetch<TransactionAPI>(url, {
    method: 'PUT',
    body: data,
  })
  return updated.value
}

export async function deleteTransaction(pk: number) {
  const runtimeConfig = useRuntimeConfig()
  const url = `${runtimeConfig.public.apiUrl}/transactions/${pk}/`
  await useFetch(url, {
    method: 'DELETE',
  })
}
