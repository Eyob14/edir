import { router } from '@server/trpc'
import create from './create'
import find from './find'
import verifyRelative from './verifyRelative'
import update from './update'
import deleteRelative from './delete'

export default router({
  create,
  find,
  verifyRelative,
  update,
  deleteRelative
})
