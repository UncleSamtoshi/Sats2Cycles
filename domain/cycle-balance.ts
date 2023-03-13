export type CycleBalanceService = {
  tryLockCycles: (amount: number) => Promise<number | Error>
  freeCycles: (amount: number) => Promise<number | Error>
}
