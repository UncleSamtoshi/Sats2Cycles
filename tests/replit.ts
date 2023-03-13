import { ReplitSessionCookie } from '../config'
import { createReplitClient } from '../services/replit'

const testReplit = async () => {
  if (!ReplitSessionCookie) {
    throw new Error('Please set REPLIT_SESSION_COOKIE environment variable')
  }
  const client = createReplitClient(ReplitSessionCookie)
  const cycles = await client.getCycles()
  console.log('Cycles: ', cycles)

  const replToTip = 'https://replit.com/@SamPeters4/TipMePlz?v=1'
  const replId = await client.getReplIdFromUrl(replToTip)
  console.log(`ReplId for ${replToTip}: `, replId)
  if (replId instanceof Error) throw replId

  // const tipAmount = 100;
  // const res = await client.tipRepl(replId, tipAmount);
  // console.log(`TipReplId for ${replToTip}: ${res}`);
}

testReplit()
