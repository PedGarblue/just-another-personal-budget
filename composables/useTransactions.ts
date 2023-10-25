import transactions, { TransactionAPI } from '~~/api/transactions'

interface ITransactionQueryParams {
  from?: string
  to?: string
  account?: number
}

interface IUseTransactionsParams {
  getTransactionsParams?: ITransactionQueryParams
}

export const useTransactions = ({
  getTransactionsParams,
}: IUseTransactionsParams = {}) => {
  const transactionsAPIData = ref<TransactionAPI[]>([])
  const getTransactions = async ({
    from = getTransactionsParams?.from,
    to = getTransactionsParams?.to,
    account = getTransactionsParams?.account,
  }: ITransactionQueryParams) => {
    const response = await transactions(from, to, account)
    if (response) {
      transactionsAPIData.value = response
    }
  }

  // lifecycle
  onMounted(() => {
    getTransactions({})
  })

  return {
    transactionsAPIData,
    getTransactions,
  }
}
