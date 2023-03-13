import { PriceService } from '../../domain/price'

export const createPriceService = (): PriceService => {
  const convertCyclesToSats = (cycles: number): Promise<number> => {
    const CYCLES_PER_DOLLAR = 100
    const BTC_PRICE_IN_USD = 20000
    const SATS_PER_BTC = 100000000

    const cyclesInDollars = cycles / CYCLES_PER_DOLLAR
    const cyclesInBitcoin = cyclesInDollars / BTC_PRICE_IN_USD
    const cyclesInSats = Math.round(cyclesInBitcoin * SATS_PER_BTC)

    return Promise.resolve(cyclesInSats)
  }
  return {
    convertCyclesToSats
  }
}
