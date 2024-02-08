import { router } from '@server/trpc'
import login from './login'
import signup from './signup'
import approve from './approveUser'
import find from './find'
import getDetails from './details'

export default router({
  login,
  signup,
  approve,
  find,
  getDetails,
})
