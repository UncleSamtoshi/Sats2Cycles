import { InvoiceStatus } from './invoice'

export type CreateCyclePurchaseRequestParams = {
  id: string,
  invoiceId: string,
  amount: number,
  replUrl: string
  replId: string
}

export const createCyclePurchaseRequest = (params: CreateCyclePurchaseRequestParams) => {
  const dateCreated = new Date()
  const status = CyclePurchaseRequestStatus.AWAITING_PAYMENT

  return {
    dateCreated,
    status,
    ...params
  }
}


export const StateChangeType = {
  NONE: 'NONE',
  COMPLETE_PURCHASE_REQUEST: 'COMPLETE_PURCHASE_REQUEST',
  EXPIRE_PURCHASE_REQUEST: 'EXPIRE_PURCHASE_REQUEST',
} as const

export type StateChangeType = typeof StateChangeType[keyof typeof StateChangeType]

export const createCallbackUrl = ({
  purchaseRequestId,
  host,
  callbackPath
}: {
  purchaseRequestId: string,
  host: string,
  callbackPath: string
}
) => {
  return `${host}${callbackPath}/${purchaseRequestId}`
}

export type CheckForRequiredStateChangeParams = {
  cyclePurchaseRequest: CyclePurchaseRequest,
  invoiceStatus: InvoiceStatus,
}

export const checkForRequiredStateChange = ({
  cyclePurchaseRequest,
  invoiceStatus,
}: CheckForRequiredStateChangeParams) => {
  switch (cyclePurchaseRequest.status) {
    case CyclePurchaseRequestStatus.AWAITING_PAYMENT:
      if (invoiceStatus === InvoiceStatus.PAID) {
        return StateChangeType.COMPLETE_PURCHASE_REQUEST
      }
      if (invoiceStatus === InvoiceStatus.EXPIRED) {
        return  StateChangeType.EXPIRE_PURCHASE_REQUEST
      }
    default:
      return  StateChangeType.NONE
  }
}

export type CyclePurchaseRequest = {
  id: string,
  dateCreated: Date,
  invoiceId: string
  amount: number
  replUrl: string
  replId: string
  status: CyclePurchaseRequestStatus
}

export const CyclePurchaseRequestStatus = {
  AWAITING_PAYMENT: 'AWAITING_PAYMENT',
  COMPLETED: 'COMPLETED',
  EXPIRED: 'EXPIRED',
} as const

export type CyclePurchaseRequestStatus = typeof CyclePurchaseRequestStatus[keyof typeof CyclePurchaseRequestStatus]

export type CyclePurchaseRequestRepo = {
  getCyclePurchaseRequestById: (id: string) => Promise<CyclePurchaseRequest | Error>,
  persistCyclePurchaseRequest: (cyclePurchaseRequest: CyclePurchaseRequest) => Promise<CyclePurchaseRequest | Error>,
}