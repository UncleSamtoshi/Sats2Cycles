import { LightningService, CreateInvoiceParams, Invoice, InvoiceStatus } from '../../domain';
import { ZbdApiKey, ZbdApiUrl } from '../../config';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'

type MakeZbdRequestParams = {
  data?: any
  path: string
  method: string
}

const createMakeZbdRequest = (apiKey = ZbdApiKey) => {
  return (params: MakeZbdRequestParams) => {
    return axios({
      method: params.method,
      maxBodyLength: Infinity,
      url: `${ZbdApiUrl}/${params.path}`,
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey
      },
      data: params.data && JSON.stringify(params.data)
    })
  }
}


export const createLightningService = (): LightningService => {
  const makeZbdRequest = createMakeZbdRequest()

  const createInvoice = async (params: CreateInvoiceParams): Promise<Invoice | Error> => {
    const path = 'charges'
    const method = 'post'
    const data = {
      expiresIn: params.expiresInSeconds,
      amount: params.amountInSats * 1000,
      internalId: uuidv4(),
      callbackUrl: params.callbackUrl,
      description: `Tipping ${params.replUrl}`,
    }

    try {
      const response = await makeZbdRequest({
        path,
        method,
        data
      })

      return invoiceFromZbdInvoice(response.data.data)

    } catch (err) {
      console.log("Error creating invoice: ", err)
      return new Error("Failed to create invoice")
    }

  }

  const getInvoiceById = async (id: string) => {
    const path = `charges/${id}`
    const method = 'get'

    try {
      const response = await makeZbdRequest({
        path,
        method
      })
      return invoiceFromZbdInvoice(response.data.data)
    } catch (err) {
      console.log("Error getting invoice: ", err)
      return new Error("Failed to get invoice")
    }
  }

  return {
    createInvoice,
    getInvoiceById
  }
}

const invoiceFromZbdInvoice = (zbdInvoice: any): Invoice => {
  const {
    id,
    expiresAt,
    amount: amountInMilliSats,
    status,
    callbackUrl,
    invoice: {
      request
    }
  } = zbdInvoice

  console.log('return callbackurl', callbackUrl)

  const statusMap: Record<string, InvoiceStatus> = {
    "expired": InvoiceStatus.EXPIRED,
    "pending": InvoiceStatus.CREATED,
    "completed": InvoiceStatus.PAID
  }

  const invoiceStatus = statusMap[status as string]

  if (!invoiceStatus) {
    throw new Error("Invalid invoice status: " + status)
  }

  return {
    id,
    satoshiAmount: amountInMilliSats / 1000,
    expiresAt: (new Date(expiresAt)),
    status: invoiceStatus,
    bolt11: request
  }
}