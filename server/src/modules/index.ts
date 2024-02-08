import { router } from '../trpc'
import user from './user'
import income from './income'
import expense from './expense'
import material from './material'
import materialLoan from './materialLoan'
import relative from './relative'
import penalty from './penalty'

export const appRouter = router({
  user,
  income,
  expense,
  material,
  materialLoan,
  relative,
  penalty,
})

export type AppRouter = typeof appRouter
