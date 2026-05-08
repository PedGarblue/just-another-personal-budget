/** Fields accepted by POST/PATCH /receivables/ */
export interface ReceivableWrite {
  description?: string
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
export interface ReceivableAPIItem extends ReceivableWrite {
  id: number
  created_at?: string
  updated_at?: string
  principal_usd: number
  paid_usd: number
  outstanding_usd: number
  status: string
  transactions?: ReceivableLinkedTransaction[]
}
