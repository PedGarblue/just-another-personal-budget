import type { ReceivableAPIItem } from '@/types/receivablesTypes'

export interface Contact {
  id: number
  name: string
  created_at?: string
  updated_at?: string
  total_principal_usd: string
  total_paid_usd: string
  total_outstanding_usd: string
  receivable_count: number
  receivables?: ReceivableAPIItem[]
}

export interface ReceivableGroup {
  contact_id: number
  contact: string
  total_principal_usd: string
  total_paid_usd: string
  total_outstanding_usd: string
  receivables: ReceivableAPIItem[]
}
