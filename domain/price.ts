export type PriceService = {
  convertCyclesToSats: (cycles: number) => Promise<number | Error>
}
