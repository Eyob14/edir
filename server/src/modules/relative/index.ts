import { router } from '@server/trpc'
import create from './create'
import find from './find'
import verifyRelative from './verifyRelative'
import update from './update'
import deleteRelative from './delete'
import findDetails from './details'

export default router({
  create,
  find,
  verifyRelative,
  update,
  deleteRelative,
  findDetails,
})
