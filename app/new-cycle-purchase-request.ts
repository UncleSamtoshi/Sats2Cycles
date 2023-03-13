import { Invoice, createCallbackUrl, createCyclePurchaseRequest, CyclePurchaseRequest } from '../domain'
import { createReplitClient } from '../services/replit'
import { createCycleBalanceService } from '../services/cycle-balance'
import { createCyclePurchaseRequestRepo } from '../services/cycle-purchase-request-repo'
import { createLightningService } from '../services/lightning'
import { Host, CallbackPath } from '../config'
import { createPriceService } from '../services/price'
import { v4 as uuidv4 } from 'uuid'


type CyclePurchaseParams = {
  amount: number
  replUrl: string
}

type NewCyclePurchaseRequestResult = {
  invoice: Invoice
  cyclePurchaseRequest: CyclePurchaseRequest
}

export const newCyclePurchaseRequest = async ({
  amount,
  replUrl
}: CyclePurchaseParams): Promise<NewCyclePurchaseRequestResult | Error> => {

  const validatedAmount = validateAmount(amount)
  if (validatedAmount instanceof Error) {
    return validatedAmount
  }

  const validatedReplUrl = validateReplUrl(replUrl)
  if (validatedReplUrl instanceof Error) {
    return validatedReplUrl
  }

  const replitClient = createReplitClient()
  const replId = await replitClient.getReplIdFromUrl(validatedReplUrl)

  if (replId instanceof Error) {
    return replId
  }

  const cycleBalanceService = createCycleBalanceService()
  const lockedCycles = await cycleBalanceService.tryLockCycles(validatedAmount)

  if (lockedCycles instanceof Error) {
    return lockedCycles
  }

  try {
    const priceService = createPriceService()
    const satAmountOfCycles = await priceService.convertCyclesToSats(lockedCycles)

    if (satAmountOfCycles instanceof Error) {
      throw satAmountOfCycles
    }

    const purchaseRequestId = uuidv4()
    const lightningService = createLightningService()
    const invoice = await lightningService.createInvoice({
      amountInSats: satAmountOfCycles,
      expiresInSeconds: 60 * 5,
      replUrl,
      callbackUrl: createCallbackUrl({
        host: Host,
        callbackPath: CallbackPath,
        purchaseRequestId
      })
    })

    if (invoice instanceof Error) {
      throw invoice
    }

    const cyclePurchaseRequest = createCyclePurchaseRequest({
      amount: lockedCycles,
      replUrl: validatedReplUrl,
      invoiceId: invoice.id,
      replId,
      id: purchaseRequestId
    })

    const cyclePurchaseRequestRepo = createCyclePurchaseRequestRepo()

    const cyclePurchaseRequestPersisted = await cyclePurchaseRequestRepo.persistCyclePurchaseRequest(cyclePurchaseRequest)

    if (cyclePurchaseRequestPersisted instanceof Error) {
      throw cyclePurchaseRequestPersisted
    }

    return {
      invoice,
      cyclePurchaseRequest
    }
  } catch (err) {
    cycleBalanceService.freeCycles(lockedCycles)
    if (err instanceof Error) {
      return err
    }
    return new Error('Failed to create invoice')
  }
}


const validateAmount = (amount: number): number | Error => {
  if (amount !== 100) {
    return new Error('Amount must be 100')
  }
  return amount
}


const validateReplUrl = (replUrl: string): string | Error => {
  if (!replUrl) {
    return new Error('Repl url must be provided')
  }
  return replUrl
}