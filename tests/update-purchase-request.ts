import { updateCyclePurchaseRequest } from '../app/update-cycle-purchase-request'

export const testUpdatePurchaseRequest = async () => {
  const res = await updateCyclePurchaseRequest({
    cyclePurchaseRequestId: "ca128da7-131e-4795-82b0-8d04e40acc24"
  })

  console.log(res)
}

testUpdatePurchaseRequest()