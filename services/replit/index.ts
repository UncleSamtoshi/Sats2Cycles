import { GET_CYCLES, REPL_INFO } from './queries'
import { ReplitApiUrl, ReplitSessionCookie } from '../../config'
import { TIP_REPL } from './mutations'
import axios from 'axios'

export type ReplitClient = {
  makeGqlRequest: MakeReplitGqlRequest
  getCycles: () => Promise<number | Error>
  getReplIdFromUrl: (replUrl: string) => Promise<string | Error>
  tipRepl: (replId: string, amount: number) => Promise<'success' | Error>
}

export const createReplitClient = (
  sessionCookie = ReplitSessionCookie
): ReplitClient => {
  const makeGqlRequest = createMakeReplitGqlRequest(sessionCookie)

  const getCycles = async (): Promise<number | Error> => {
    const res = await makeGqlRequest({
      query: GET_CYCLES
    })

    try {
      return res.currentUser.cycles.balance.cycles
    } catch (err) {
      console.log(err)
    }

    return new Error(`Could not fetch cycles balance`)
  }

  const getReplIdFromUrl = async (replUrl: string): Promise<string | Error> => {
    const res = await makeGqlRequest({
      query: REPL_INFO,
      variables: {
        url: replUrl
      }
    })

    try {
      return res.repl.id
    } catch (err) {
      console.log(err)
    }

    return new Error(`Could not fetch repl id from url ${replUrl}`)
  }

  const tipRepl = async (
    replId: string,
    tipAmount: number
  ): Promise<'success' | Error> => {
    const res = await makeGqlRequest({
      query: TIP_REPL,
      variables: {
        input: {
          replId: replId,
          amount: tipAmount
        }
      }
    })

    try {
      // assuming that if currentUserTotalTips is populated than the req was successful
      if (res.sendTip.repl.currentUserTotalTips) {
        return 'success'
      }
    } catch (err) {
      console.log(err)
    }

    return new Error(`Could not tip repl ${replId}`)
  }

  return {
    makeGqlRequest,
    getCycles,
    getReplIdFromUrl,
    tipRepl
  }
}

type MakeReplitGqlRequest = (params: { query: string; variables?: any }) => any

const createMakeReplitGqlRequest = (
  sessionCookie: string
): MakeReplitGqlRequest => {
  return (data: { query: string; variables?: any }) =>
    axios({
      method: 'post',
      url: ReplitApiUrl,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101 Firefox/91.0',
        'X-Requested-With': 'XMLHttpRequest',
        Origin: 'https://replit.com',
        'Content-Type': 'application/json',
        Cookie: sessionCookie
      },
      data: JSON.stringify(data)
    })
      .then(response => response.data.data)
      .catch(err => console.log('Error: ', err))
}
