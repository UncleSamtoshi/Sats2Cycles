import { CyclePurchaseRequestRepo, CyclePurchaseRequest } from '../../domain/cycle-purchase-request';
const Database = require('@replit/database')

export const createCyclePurchaseRequestRepo = (): CyclePurchaseRequestRepo => {

  const db = new Database()

  const getCyclePurchaseRequestById = async (id: string): Promise<CyclePurchaseRequest | Error> => {
    try {
      const {
        dateCreated,
        invoiceId,
        amount,
        replUrl,
        replId,
        status
      } = await db.get(`purchaserequest:${id}`)
      
      return {
        id,
        dateCreated,
        invoiceId,
        amount,
        replUrl,
        replId,
        status
      } as CyclePurchaseRequest
      
    } catch (err) {
      return new Error("Could not get cycle purchase request by id: " + id)
    }
  }

  const persistCyclePurchaseRequest = async (cyclePurchaseRequest: CyclePurchaseRequest): Promise<CyclePurchaseRequest | Error> => {
    try {
      await db.set(`purchaserequest:${cyclePurchaseRequest.id}`, cyclePurchaseRequest)
      return cyclePurchaseRequest
    } catch (err) {
      return new Error("Could not persist cycle purchase request: " + err)
    }
  }

  return {
    getCyclePurchaseRequestById,
    persistCyclePurchaseRequest
  }
}