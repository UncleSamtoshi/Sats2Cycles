import {
  CyclePurchaseRequest,
  checkForRequiredStateChange,
  StateChangeType,
  CyclePurchaseRequestRepo,
  CycleBalanceService,
  CyclePurchaseRequestStatus
} from '../domain'
import { createCyclePurchaseRequestRepo } from '../services/cycle-purchase-request-repo'
import { createLightningService } from '../services/lightning'
import { createCycleBalanceService } from '../services/cycle-balance'
import { createReplitClient, ReplitClient } from '../services/replit'

type UpdateCyclePurchaseRequestParams = {
  cyclePurchaseRequestId: string
}

type UpdateCyclePurchaseRequestResult = {
  cyclePurchaseRequest: CyclePurchaseRequest
  stateChangeType: StateChangeType
}

export const updateCyclePurchaseRequest = async (
  params: UpdateCyclePurchaseRequestParams
): Promise<UpdateCyclePurchaseRequestResult | Error> => {
  const validatedCyclePurchaseRequestId = validateCyclePurchaseRequestId(
    params.cyclePurchaseRequestId
  )
  if (validatedCyclePurchaseRequestId instanceof Error) {
    return validatedCyclePurchaseRequestId
  }

  const cyclePurchaseRequestRepo = createCyclePurchaseRequestRepo()

  // vulenerability if this is fired off multiple times, cycle purchase request should be locked
  const cyclePurchaseRequest =
    await cyclePurchaseRequestRepo.getCyclePurchaseRequestById(
      validatedCyclePurchaseRequestId
    )

  if (cyclePurchaseRequest instanceof Error) {
    return cyclePurchaseRequest
  }

  const lightningService = createLightningService()
  const invoice = await lightningService.getInvoiceById(
    cyclePurchaseRequest.invoiceId
  )
  if (invoice instanceof Error) {
    return invoice
  }

  const requiredStateChange = checkForRequiredStateChange({
    cyclePurchaseRequest,
    invoiceStatus: invoice.status
  })
  const replitClient = createReplitClient()
  const cycleBalanceService = createCycleBalanceService()
  
  switch (requiredStateChange) {
    case StateChangeType.COMPLETE_PURCHASE_REQUEST:
      return completePurchaseRequest({
        cyclePurchaseRequest,
        replitClient,
        cyclePurchaseRequestRepo,
        cycleBalanceService
      })
    case StateChangeType.EXPIRE_PURCHASE_REQUEST:
      return expirePurchaseRequest({
        cyclePurchaseRequest,
        cyclePurchaseRequestRepo,
        cycleBalanceService
      })
    case StateChangeType.NONE:
    default:
      return {
        cyclePurchaseRequest: cyclePurchaseRequest,
        stateChangeType: StateChangeType.NONE
      }
  }
}

// todo move to domain

type CompletePurchaseRequestParams = {
  replitClient: ReplitClient
  cyclePurchaseRequestRepo: CyclePurchaseRequestRepo
  cyclePurchaseRequest: CyclePurchaseRequest
  cycleBalanceService: CycleBalanceService
}
const completePurchaseRequest = async ({
  replitClient,
  cyclePurchaseRequestRepo,
  cyclePurchaseRequest,
  cycleBalanceService
}: CompletePurchaseRequestParams) => {
  const updateCyclePurchaseRequest = {
    ...cyclePurchaseRequest,
    status: CyclePurchaseRequestStatus.COMPLETED
  }
  const res = await cyclePurchaseRequestRepo.persistCyclePurchaseRequest(
    updateCyclePurchaseRequest
  )
  if (res instanceof Error) {
    return res
  }
  const tipAction = await replitClient.tipRepl(
    updateCyclePurchaseRequest.replId,
    updateCyclePurchaseRequest.amount
  )

  if (tipAction instanceof Error) {
    // undo the cycle update
    const res = await cyclePurchaseRequestRepo.persistCyclePurchaseRequest(
      cyclePurchaseRequest
    )
    if (res instanceof Error) {
      console.log('Error persisting cycle purchase request: ', res)
    }
    return tipAction
  }

  const freeCycles = await cycleBalanceService.freeCycles(
    updateCyclePurchaseRequest.amount
  )
  if (freeCycles instanceof Error) {
    console.log('Error freeing cycles: ', freeCycles)
  }

  return {
    cyclePurchaseRequest: updateCyclePurchaseRequest,
    stateChangeType: StateChangeType.COMPLETE_PURCHASE_REQUEST
  }
}

type ExpirePurchaseRequestParams = {
  cyclePurchaseRequestRepo: CyclePurchaseRequestRepo
  cyclePurchaseRequest: CyclePurchaseRequest
  cycleBalanceService: CycleBalanceService
}

const expirePurchaseRequest = async ({
  cyclePurchaseRequestRepo,
  cyclePurchaseRequest,
  cycleBalanceService
}: ExpirePurchaseRequestParams) => {
  const updateCyclePurchaseRequest = {
    ...cyclePurchaseRequest,
    status: CyclePurchaseRequestStatus.EXPIRED
  }
  const res = await cyclePurchaseRequestRepo.persistCyclePurchaseRequest(
    updateCyclePurchaseRequest
  )
  if (res instanceof Error) {
    return res
  }

  const freeCyclesRes = await cycleBalanceService.freeCycles(
    updateCyclePurchaseRequest.amount
  )

  if (freeCyclesRes instanceof Error) {
    console.log('Error freeing cycles: ', freeCyclesRes)
  }
  
  return {
    cyclePurchaseRequest: updateCyclePurchaseRequest,
    stateChangeType: StateChangeType.EXPIRE_PURCHASE_REQUEST
  }
}

const validateCyclePurchaseRequestId = (
  cyclePurchaseRequestId: string
): string | Error => {
  if (!cyclePurchaseRequestId) {
    return new Error('Cycle purchase request id must be provided')
  }
  return cyclePurchaseRequestId
}
