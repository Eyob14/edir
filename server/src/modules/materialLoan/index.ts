import { router } from '@server/trpc'
import create from './create'
import find from './find'
import update from './update'
import deleteMaterialLoan from './delete'
import findByUserId from './findByUserId'
import approveMaterialLoan from './approveMaterialLoan'
import returnMaterialLoan from './returnMaterialLoan'

export default router({
  create,
  find,
  update,
  deleteMaterialLoan,
  findByUserId,
  approveMaterialLoan,
  returnMaterialLoan,
})
