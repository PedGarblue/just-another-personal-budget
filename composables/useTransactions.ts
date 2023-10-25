import transactions, { TransactionAPI } from '~~/api/transactions'

export const useTransactions = () => {
  const transactionsAPIData = ref<TransactionAPI[]>([])
  const getTransactions = async () => {
    const response = await transactions()
    if (response) {
      transactionsAPIData.value = response
    }
  }

  // lifecycle
  onMounted(() => {
    getTransactions()
  })

  return {
    transactionsAPIData,
    getTransactions,
  }
}
