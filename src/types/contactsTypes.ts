import type { ReceivableAPIItem } from '@/types/receivablesTypes'

export interface Contact {
  id: number
  name: string
  created_at?: string
  updated_at?: string
  total_principal_usd: number
  total_paid_usd: number
  total_outstanding_usd: number
  receivable_count: number
  receivables?: ReceivableAPIItem[]
}

export interface ReceivableGroup {
  contact_id: number
  contact: string
  total_principal_usd: number
  total_paid_usd: number
  total_outstanding_usd: number
  receivables: ReceivableAPIItem[]
}
