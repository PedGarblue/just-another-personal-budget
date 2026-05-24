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
  usd_amount: number | null
}

/** GET list/detail response row */
export interface ReceivableAPIItem {
  id: number
  description: string
  contact_id: number
  contact_name: string
  due_date: string
  principal_usd: number
  paid_usd: number
  outstanding_usd: number
  status: 'PAID' | 'UNPAID'
  transactions?: ReceivableLinkedTransaction[]
  created_at?: string
  updated_at?: string
}
