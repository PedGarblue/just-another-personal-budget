import { format } from 'date-fns'
import type { Contact } from '@/api/contacts'
import { getContactList } from '@/api/contacts'
import type { ReceivableAPIItem } from '@/api/receivables'
import { getReceivableList } from '@/api/receivables'
import type { TransactionBase } from '@/api/transactions'
import { formatUsd } from '@/utils/money'

function transactionDateToIso(dateVal: unknown): string {
  if (dateVal instanceof Date) return dateVal.toISOString()
  if (typeof dateVal === 'string' && dateVal)
    return new Date(dateVal).toISOString()
  return new Date().toISOString()
}

export function useTransactionLoanReceivable() {
  const { t } = useLang()

  const isLoan = ref(false)
  const loanContact = ref('')
  const loanDueDate = ref<Date | null>(null)
  const collectionContactName = ref('')
  const collectionReceivableId = ref(0)
  const contactRows = ref<Contact[]>([])
  const receivableRows = ref<ReceivableAPIItem[]>([])
  const advancedLoanReceivableOpen = ref(false)

  watch(isLoan, (on) => {
    if (on) {
      collectionReceivableId.value = 0
      collectionContactName.value = ''
    }
  })

  watch(collectionContactName, (name) => {
    if (name) {
      isLoan.value = false
      collectionReceivableId.value = 0
    }
  })

  watch(collectionReceivableId, (id) => {
    if (id > 0) {
      isLoan.value = false
      collectionContactName.value = ''
    }
  })

  function receivableOptionLabel(r: ReceivableAPIItem) {
    const label = r.description?.trim() || r.contact_name?.trim() || `#${r.id}`
    return `${label} (#${r.id}) · ${formatUsd(r.outstanding_usd)} ${t(
      'transactions.loan.outstanding_suffix'
    )}`
  }

  function contactOptionLabel(c: Contact) {
    return `${c.name} · ${formatUsd(c.total_outstanding_usd)} ${t(
      'transactions.loan.outstanding_suffix'
    )}`
  }

  async function loadContactRows() {
    const data = await getContactList({ page_size: 500 })
    contactRows.value = data?.results ?? []
  }

  async function loadReceivableRows() {
    const data = await getReceivableList({ page_size: 500 })
    receivableRows.value = data?.results ?? []
  }

  async function loadLoanReceivableOptions() {
    await Promise.all([loadContactRows(), loadReceivableRows()])
  }

  function resetLoanCollectionUi() {
    advancedLoanReceivableOpen.value = false
    isLoan.value = false
    loanContact.value = ''
    loanDueDate.value = null
    collectionContactName.value = ''
    collectionReceivableId.value = 0
  }

  /** Before opening the update modal: clear loan fields, sync collection + advanced toggle from existing tx */
  function prepareUpdateModalState(
    amount: string | number,
    receivableId: number | null | undefined,
    contactName?: string | null
  ) {
    isLoan.value = false
    loanContact.value = ''
    loanDueDate.value = null
    const amt = Number(amount)
    const rid = receivableId
    if (amt > 0 && rid != null && rid > 0) {
      collectionReceivableId.value = rid
      collectionContactName.value = ''
    } else if (amt > 0 && contactName?.trim()) {
      collectionContactName.value = contactName.trim()
      collectionReceivableId.value = 0
    } else {
      collectionReceivableId.value = 0
      collectionContactName.value = ''
    }
    advancedLoanReceivableOpen.value =
      rid != null && rid > 0 ? true : !!contactName?.trim()
  }

  function validateLoanReceivableForm(
    data: Record<string, unknown>,
    amount: number
  ) {
    if (isLoan.value) {
      if (!(amount < 0)) {
        throw new Error(t('transactions.loan.errors.expense_negative'))
      }
      if (!loanContact.value.trim()) {
        throw new Error(t('transactions.loan.errors.contact_required'))
      }
      return
    }
    if (collectionContactName.value) {
      if (!(amount > 0)) {
        throw new Error(t('transactions.loan.errors.income_positive'))
      }
      return
    }
    if (collectionReceivableId.value > 0) {
      if (!(amount > 0)) {
        throw new Error(t('transactions.loan.errors.income_positive'))
      }
      return
    }
    const cat = data.category as { id?: number } | undefined
    if (cat == null || typeof cat.id !== 'number') {
      throw new Error(t('transactions.loan.errors.category_required'))
    }
  }

  function buildTransactionBodyWithLoan(
    data: Record<string, unknown>,
    amount: number
  ): TransactionBase {
    const body: TransactionBase = {
      description: typeof data.description === 'string' ? data.description : '',
      account: (data.account as { id: number }).id,
      date: transactionDateToIso(data.date),
      amount: String(amount),
    }

    const cat = data.category as { id?: number } | undefined
    if (isLoan.value) {
      body.is_loan = true
      body.contact = loanContact.value.trim()
      if (loanDueDate.value)
        body.loan_due_date = format(loanDueDate.value, 'yyyy-MM-dd')
      if (cat?.id != null) body.category = cat.id
      return body
    }

    if (collectionContactName.value) {
      body.contact = collectionContactName.value
      if (cat?.id != null) body.category = cat.id
      return body
    }

    if (collectionReceivableId.value > 0) {
      body.receivable = collectionReceivableId.value
      if (cat?.id != null) body.category = cat.id
      return body
    }

    body.category = cat!.id
    return body
  }

  return {
    isLoan,
    loanContact,
    loanDueDate,
    collectionContactName,
    collectionReceivableId,
    contactRows,
    receivableRows,
    advancedLoanReceivableOpen,
    loadContactRows,
    loadReceivableRows,
    loadLoanReceivableOptions,
    resetLoanCollectionUi,
    prepareUpdateModalState,
    receivableOptionLabel,
    contactOptionLabel,
    validateLoanReceivableForm,
    buildTransactionBodyWithLoan,
  }
}
