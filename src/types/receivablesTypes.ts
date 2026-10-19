/** Fields accepted by POST/PATCH /receivables/ */
export interface ReceivableWrite {
  description?: string
  /** Write-only contact name */
  contact?: string
  due_date?: string
}

export interface ReceivableLinkedTransaction {
  id: number
  account: number
  amount_display: string
  date: string
  description: string
  usd_amount: string | null
}

/** GET list/detail response row */
export interface ReceivableAPIItem {
  id: number
  description: string
  contact_id: number
  contact_name: string
  due_date: string
  principal_usd: string
  paid_usd: string
  outstanding_usd: string
  /** Set by expense-share finalize; display-only in UI */
  explicit_principal_usd?: string | null
  status: 'PAID' | 'UNPAID'
  transactions?: ReceivableLinkedTransaction[]
  created_at?: string
  updated_at?: string
}
