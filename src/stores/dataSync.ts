import { defineStore } from 'pinia'

export const useDataSync = defineStore('dataSync', {
  state: () => ({
    transactionsRevision: 0,
    expenseShareRevision: 0,
  }),
  actions: {
    notifyTransactionsChanged() {
      this.transactionsRevision += 1
    },
    notifyExpenseShareChanged() {
      this.expenseShareRevision += 1
    },
  },
})
