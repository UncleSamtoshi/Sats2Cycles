export const InvoiceStatus = {
  CREATED: 'CREATED',
  PAID: 'PAID',
  EXPIRED: 'EXPIRED'
} as const

export type InvoiceStatus = typeof InvoiceStatus[keyof typeof InvoiceStatus]

export type Invoice = {
  id: string,
  expiresAt: Date,
  satoshiAmount: number,
  bolt11: string,
  status: InvoiceStatus,
}