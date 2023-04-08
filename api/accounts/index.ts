export interface Account {
  id: number
  name: string
  currency: number
  balance: number
}

export default async function (): Promise<[Account] | null> {
  const runtimeConfig = useRuntimeConfig()
  const urlAccounts = `${runtimeConfig.public.apiUrl}/accounts`
  const { data: accounts } = await useFetch<[Account]>(urlAccounts)
  return accounts.value
}
