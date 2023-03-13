// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { newCyclePurchaseRequest } from '../../app/new-cycle-purchase-request'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const {
      amount,
      replUrl
    } = req.body

    if (!amount || !replUrl) {
      return res.status(400).json({
        message: 'Amount and URL are required.'
      })
    }

    if (amount !== 100) {
      return res.status(400).json({
        message: 'Amount must be 100. This is set to the lowest amount because it is experimental software.'
      })
    }

    const result = await newCyclePurchaseRequest({
      amount,
      replUrl
    })

    if (result instanceof Error) {
      return res.status(500).json({
        message: result.message
      })
    }

    return res.status(201).json({
      message: 'Success',
      invoice: result.invoice,
      cyclePurchaseRequest: result.cyclePurchaseRequest
    })
    
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

