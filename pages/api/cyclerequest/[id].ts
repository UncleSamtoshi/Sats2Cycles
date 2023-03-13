// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { updateCyclePurchaseRequest } from '../../../app/update-cycle-purchase-request'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const cyclePurchaseRequestId = req.query.id

    if ( typeof cyclePurchaseRequestId !== 'string') {
      return res.status(400).send({
        message: 'Cycle purchase request id must be a string'
      })
    }

    const result = await updateCyclePurchaseRequest({
      cyclePurchaseRequestId
    })

    if (result instanceof Error) {
      return res.status(500).send({
        message: result.message
      })
    }

    return res.status(200).json({
      message: 'Success',
      cyclePurchaseRequest: result.cyclePurchaseRequest,
      stateChangeType: result.stateChangeType
    })
    
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}

