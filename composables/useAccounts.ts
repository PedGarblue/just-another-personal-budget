import { useAccounts as useAccountsState } from '~~/stores/accounts'

export const useAccounts = () => {
  const accountsState = useAccountsState()
  onMounted(() => {
    accountsState.fetchAccounts()
  })
}
