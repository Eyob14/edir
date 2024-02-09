import { router } from '@server/trpc'
import create from './create'
import find from './find'
import update from './update'
import deleteIncome from './delete'
import findByUserId from './findByUserId'
import findDetails from './details'

export default router({
  create,
  find,
  update,
  deleteIncome,
  findByUserId,
  findDetails
})
