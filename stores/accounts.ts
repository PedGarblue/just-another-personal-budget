import { defineStore } from 'pinia'
import accountsFetch, { Account } from '~/api/accounts'
import currenciesFetch, { Currency } from '~~/api/currencies'

export interface IAccountsState {
  accounts: Account[]
  currencies: Currency[]
}

export interface AccountComplete extends Account {
  currencyData: Currency
}

const defaultCurrency: Currency = {
  id: 0,
  name: 'N/A',
}

const defaultAccount: AccountComplete = {
  id: 0,
  name: 'N/A',
  currency: defaultCurrency.id,
  currencyData: defaultCurrency,
  balance: 0,
}

export const useAccounts = defineStore('accounts', {
  state: (): IAccountsState => ({
    accounts: [],
    currencies: [],
  }),
  actions: {
    async fetchCurrencies() {
      const currenciesData = await currenciesFetch()
      if (currenciesData) {
        this.currencies = currenciesData
        return this.currencies
      }
    },
    async fetchAccounts() {
      const accountsData = await accountsFetch()
      if (accountsData) {
        this.accounts = accountsData
      }
    },
    async fetchData() {
      await this.fetchCurrencies()
      await this.fetchAccounts()
    },
  },
  getters: {
    getCurrencies(): Currency[] {
      return this.currencies
    },
    getCurrency(state) {
      return (pk: number): Currency =>
        state.currencies.find((item) => item.id === pk) || defaultCurrency
    },
    getAccounts(state): AccountComplete[] {
      return state.accounts.map((account) => {
        const currencyData = this.getCurrency(account.currency)
        return {
          ...account,
          currencyData,
        }
      })
    },
    getAccount(state): (pk: number) => AccountComplete {
      return (pk: number): AccountComplete =>
        this.getAccounts.find((item) => item.id === pk) || defaultAccount
    },
  },
})
