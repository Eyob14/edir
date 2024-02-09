import { router } from '@server/trpc'
import login from './login'
import signup from './signup'
import approve from './approveUser'
import find from './find'
import getDetails from './details'
import deleteUser from './delete'

export default router({
  login,
  signup,
  approve,
  find,
  getDetails,
  deleteUser,
})
