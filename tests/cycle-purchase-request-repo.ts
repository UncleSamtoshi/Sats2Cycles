import { createCyclePurchaseRequestRepo } from '../services/cycle-purchase-request-repo';
import { createCyclePurchaseRequest } from '../domain'
const testCyclePurchaseRequestRepo = async () => {
  const purchaseRequest = createCyclePurchaseRequest({
    invoiceId: 'invoice-id',
    amount: 100,
    replUrl:'repl-url',
    replId:'repl-id',  
    id: 'id',
  })

  const cyclePurchaseRequestRepo = createCyclePurchaseRequestRepo()

  await cyclePurchaseRequestRepo.persistCyclePurchaseRequest(purchaseRequest)

  const cyclePurchaseRequestById = await cyclePurchaseRequestRepo.getCyclePurchaseRequestById('id')
  console.log(cyclePurchaseRequestById)
}
testCyclePurchaseRequestRepo()