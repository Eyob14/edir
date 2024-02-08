import { router } from '@server/trpc'
import create from './create'
import find from './find'
import update from './update'
import deleteMaterial from './delete'
import details from './details'

export default router({
  create,
  find,
  update,
  deleteMaterial,
  details
})
