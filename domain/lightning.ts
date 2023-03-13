import { Invoice } from './invoice'

export type CreateInvoiceParams = {
    amountInSats: number,
    expiresInSeconds: number,
    callbackUrl: string,
    replUrl: string
  }

export type LightningService = {
  createInvoice: (params: CreateInvoiceParams) => Promise<Invoice | Error>
  getInvoiceById: (id: string) => Promise<Invoice | Error>
}