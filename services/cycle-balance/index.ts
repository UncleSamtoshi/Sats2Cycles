import { CycleBalanceService } from '../../domain/cycle-balance'
import { createReplitClient } from '../../services/replit'

export const createCycleBalanceService = (): CycleBalanceService => {
  // TODO this is a naive implementation that does not keep track of the cycles that are tied up in ongoing requests
  const tryLockCycles = async (amount: number) => {
    const client = createReplitClient()
    const cyclesRemaining = await client.getCycles()

    if (cyclesRemaining instanceof Error) {
      return cyclesRemaining
    }

    if (cyclesRemaining < 1000) {
      return new Error('Not enough cycles available')
    }

    return amount
  }

  const freeCycles = (amount: number) => {
    return Promise.resolve(amount)
  }

  return {
    tryLockCycles,
    freeCycles
  }
}
