import { newCyclePurchaseRequest } from "../app/request-cycle-purchase-request-invoice"
export const testRequestInvoice = async () => {
  const invoice = await newCyclePurchaseRequest({
    amount: 100,
    replUrl: 'https://replit.com/@SamPeters4/TipMePlz?v=1'
  })

  console.log(invoice)
}

testRequestInvoice()