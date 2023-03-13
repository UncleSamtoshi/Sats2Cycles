import { createLightningService } from '../services/lightning'

const testLightning = async () => {
  const lightningService = createLightningService()

  const invoice = await lightningService.createInvoice({
    expiresInSeconds: 300,
    amountInSats: 10,
    callbackUrl: 'https://example.com/callback',
    replUrl: 'https://example.com/repl'
  })

  console.log("invoice: ", invoice)
  if (invoice instanceof Error) {
    return console.log("Error creating invoice: ", invoice)
  }
}


testLightning()