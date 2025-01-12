import { defineStore } from 'pinia'
import type { Currency } from '~/api/currencies'
import type { Account } from '~/api/accounts'

import accountsFetch from '~/api/accounts'
import currenciesFetch from '~~/api/currencies'

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
  symbol: 'N/A',
  balance: '0',
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
        this.currencies = currenciesData.results
        return this.currencies
      }
    },
    async fetchAccounts() {
      const accountsData = await accountsFetch()
      if (accountsData) {
        this.accounts = accountsData.results
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
    getCurrenciesWithAccounts(state): Currency[] {
      return state.currencies.map((currency) => {
        const accounts = this.getAccounts.filter(
          (account) => account.currency === currency.id
        )
        return {
          ...currency,
          accounts,
        }
      })
    },
    getCurrency(state) {
      return (pk: number): Currency =>
        state.currencies.find((item) => item.id === pk) || defaultCurrency
    },
    getCurrenciesNames(state): string[] {
      return state.currencies.map((currency) => currency.name)
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
    getAccountsNames(state): string[] {
      return state.accounts.map((account) => account.name)
    },
    getAccount(state): (pk: number) => AccountComplete {
      return (pk: number): AccountComplete =>
        this.getAccounts.find((item) => item.id === pk) || defaultAccount
    },
    hasAccounts(state): boolean {
      return state.accounts.length > 0
    },
  },
})
