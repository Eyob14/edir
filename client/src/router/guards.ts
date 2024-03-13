import { isLoggedIn, authUserRole } from '@/stores/user'

export const authenticateAdmin = () => {
  if (!isLoggedIn.value) return { name: 'Login' }
  else if (authUserRole.value === 'user') {
    return { name: 'userDashboard' }
  }
  return true
}

export const authenticateUser = () => {
  if (!isLoggedIn.value) return { name: 'Login' }
  else if (authUserRole.value === 'admin') {
    return { name: 'Dashboard' }
  }

  return true
}
