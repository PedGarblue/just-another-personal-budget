import type { TransactionAPI } from '~~/api/transactions'
import transactions from '~~/api/transactions'

interface ITransactionQueryParams {
  from?: string
  to?: string
  account?: number
  currency?: number
  excludeSameCurrencyTransactions?: boolean
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
    currency = getTransactionsParams?.currency,
    excludeSameCurrencyTransactions = getTransactionsParams?.excludeSameCurrencyTransactions,
  }: ITransactionQueryParams) => {
    const response = await transactions(
      from,
      to,
      account,
      currency,
      excludeSameCurrencyTransactions
    )
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
