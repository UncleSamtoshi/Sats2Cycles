import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { CyclePurchaseRequest, Invoice, CyclePurchaseRequestStatus } from '../domain'
import QRCode from "react-qr-code";
import styles from '../styles/CyclePurchase.module.css';
import { Oval } from 'react-loader-spinner';


type CyclePurchaseState = {
  state: 'pending' | 'loading-invoice'
  replUrl: string
} | {
  state: 'loaded-invoice' | 'invoice-paid'
  replUrl: string
  invoice: Invoice
  cyclePurchaseRequest: CyclePurchaseRequest
} | {
  state: 'error'
  replUrl: string
  message: string
}

export const CyclePurchase = () => {
  const [cyclePurchaseState, setCyclePurchaseState] = useState<CyclePurchaseState>({
    state: 'pending',
    replUrl: ''
  })

  const requestCyclePurchase = async () => {
    try {
      setCyclePurchaseState({
        state: 'loading-invoice',
        replUrl: cyclePurchaseState.replUrl
      })

      const cyclePurchaseRes = await axios.post('/api/cyclerequest', {
        amount: 100,
        replUrl: cyclePurchaseState.replUrl,
      }, {
        validateStatus: (status) => true
      })

      if (cyclePurchaseRes.status !== 201) {
        return setCyclePurchaseState({
          state: 'error',
          replUrl: cyclePurchaseState.replUrl,
          message: cyclePurchaseRes.data.message || "Sorry something went wrong"
        })
      }

      setCyclePurchaseState({
        state: 'loaded-invoice',
        replUrl: cyclePurchaseState.replUrl,
        invoice: cyclePurchaseRes.data.invoice,
        cyclePurchaseRequest: cyclePurchaseRes.data.cyclePurchaseRequest
      })
    } catch (error) {
      console.log(error)
      return setCyclePurchaseState({
        state: 'error',
        replUrl: cyclePurchaseState.replUrl,
        message: "Sorry something went wrong"
      })
    }
  }

  const setReplUrl = (replUrl: string) => {
    setCyclePurchaseState({
      state: 'pending',
      replUrl: replUrl
    })
  }

  const resetState = () => {
    setCyclePurchaseState({
      state: 'pending',
      replUrl: ''
    })
  }

  const {
    state,
    replUrl
  } = cyclePurchaseState

  let stateComponent = null
  switch (state) {
    case 'pending':
      stateComponent = <CyclePurchasePending
        replUrl={replUrl}
        setReplUrl={setReplUrl}
        requestInvoice={requestCyclePurchase}
      />
      break
    case 'loading-invoice':
      stateComponent = <CyclePurchaseLoadingInvoice />
      break
    case 'loaded-invoice':
      stateComponent = <CyclePurchaseLoadedInvoice
        invoice={cyclePurchaseState.invoice}
        resetState={resetState}
        setState={setCyclePurchaseState}
        replUrl={replUrl}
        cyclePurchaseRequest={cyclePurchaseState.cyclePurchaseRequest}
      />
      break
    case 'invoice-paid':
      stateComponent = <CyclePurchaseInvoicePaid
        resetState={resetState}
        replUrl={replUrl}
      />
      break
    case 'error':
      stateComponent = <CyclePurchaseError
        message={cyclePurchaseState.message}
        resetState={resetState}
      />
      break
  }

  return <div className={styles.cyclePurchase}>
    {stateComponent}
  </div>
}


type CyclePurchasePendingProps = {
  replUrl: string,
  setReplUrl: (replUrl: string) => void,
  requestInvoice: () => void
}

const CyclePurchasePending = ({ replUrl, setReplUrl, requestInvoice }: CyclePurchasePendingProps) => {
  return (
    <>
      <h3>Tip 100 Cycles</h3>
      <input type="text" value={replUrl} placeholder={"Enter a repl url to tip"} onChange={event => setReplUrl(event.target.value)} />
      <button onClick={requestInvoice}>Generate Invoice</button>
    </>
  )
}

const CyclePurchaseLoadingInvoice = () => {
  return (
    <>
      <Oval color={'white'} secondaryColor={'#ff5b19'} />
    </>
  )
}

type CyclePurchaseLoadedInvoiceProps = {
  invoice: Invoice,
  replUrl: string,
  resetState: () => void,
  setState: (state: CyclePurchaseState) => void
  cyclePurchaseRequest: CyclePurchaseRequest
}

const CyclePurchaseLoadedInvoice = ({ replUrl, invoice, resetState, setState, cyclePurchaseRequest }: CyclePurchaseLoadedInvoiceProps) => {

  const {
    bolt11,
  } = invoice

  const checkForUpdate = useCallback(async () => {
    const res = await axios.post(`/api/cyclerequest/${cyclePurchaseRequest.id}`, {}, {
      validateStatus: (status) => true
    })

    if (res.data.cyclePurchaseRequest && res.data.cyclePurchaseRequest.status === CyclePurchaseRequestStatus.COMPLETED)
      return setState({
        invoice,
        cyclePurchaseRequest: res.data.cyclePurchaseRequest,
        state: 'invoice-paid',
        replUrl
      })
  }, [cyclePurchaseRequest, invoice, replUrl])

  useEffect(() => {
    const intervalId = setInterval(() => {
      checkForUpdate();
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [checkForUpdate]);

  const lightningLink = `lightning:${bolt11}`
  return (
    <>
      <h3>Lightning Invoice</h3>
      <QRCode value={lightningLink} />
      <a href={lightningLink}><u>Pay with a Lightning wallet!</u></a>
      <button onClick={resetState}>Start Over</button>
    </>
  )
}

type CyclePurchaseInvoicePaidProps = {
  resetState: () => void
  replUrl: string
}

const CyclePurchaseInvoicePaid = ({ resetState, replUrl }: CyclePurchaseInvoicePaidProps) => {
  return (
    <>
      <a href={replUrl}><h3><u>Repl Tipped!</u></h3></a>
      <button onClick={resetState}>Start Over</button>
    </>
  )
}

type CyclePurchaseErrorProps = {
  message: string,
  resetState: () => void
}

const CyclePurchaseError = ({ message, resetState }: CyclePurchaseErrorProps) => {
  return (
    <>
      <h3>Error</h3>
      <p>{message}</p>
      <button onClick={resetState}>Try again</button>
    </>
  )
}