export interface Currency {
  id: number
  name: string
  symbol: string
  balance: number
}

export default async function (): Promise<[Currency] | null> {
  const runtimeConfig = useRuntimeConfig()
  const urlAccounts = `${runtimeConfig.public.apiUrl}/currencies/`
  const { data: currencies } = await useFetch<[Currency]>(urlAccounts)
  return currencies.value
}
