import { router } from '@server/trpc'
import create from './create'
import find from './find'
import update from './update'
import deleteExpense from './delete'
import findDetails from './details'

export default router({
  create,
  find,
  update,
  deleteExpense,
  findDetails,
})
