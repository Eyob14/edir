import { router } from '@server/trpc'
import create from './create'
import find from './find'
import update from './update'
import deletePenalty from './delete'
import findByUserId from './findByUserId'

export default router({
  create,
  find,
  update,
  deletePenalty,
  findByUserId,
})
