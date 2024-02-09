import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import HomeLayout from '@/layouts/HomeLayout.vue'
import { authenticate } from './guards'
import UserDashboardLayoutVue from '@/layouts/UserDashboardLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/dashboard',
      component: DashboardLayout,
      beforeEnter: [authenticate],
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../views/DashboardView.vue'),
        },
        {
          path: 'monetary',
          name: 'Monetary',
          component: () => import('../views/monetary/MonetaryView.vue'),
        },
        {
          path: 'createIncome',
          name: 'CreateIncome',
          component: () => import('../views/monetary/create/CreateIncomeView.vue'),
        },
        {
          path: 'updateIncome/:id',
          name: 'UpdateIncome',
          component: () => import('../views/monetary/update/UpdateIncomeView.vue'),
        },
        {
          path: 'createExpense',
          name: 'CreateExpense',
          component: () => import('../views/monetary/create/CreateExpenseView.vue'),
        },
        {
          path: 'updateExpense/:id',
          name: 'UpdateExpense',
          component: () => import('../views/monetary/update/UpdateExpenseView.vue'),
        },
        {
          path: 'createPenalty',
          name: 'CreatePenalty',
          component: () => import('../views/monetary/create/CreatePenaltyView.vue'),
        },
        {
          path: 'updatePenalty/:id',
          name: 'UpdatePenalty',
          component: () => import('../views/monetary/update/UpdatePenaltyView.vue'),
        },
      ],
    },
    {
      path: '',
      component: UserDashboardLayoutVue,
      beforeEnter: [authenticate],
      children: [
        {
          path: 'userMonetary',
          name: 'UserMonetary',
          component: () => import('../views/monetary/UserMonetaryView.vue'),
        },
        {
          path: 'relatives',
          name: 'Relatives',
          component: () => import('../views/relatives/RelativesView.vue'),
        },
        {
          path: 'RelativeCreate',
          name: 'RelativeCreate',
          component: () => import('../views/relatives/CreateRelative.vue'),
        },
        {
          path: 'profile',
          name: 'Profile',
          component: () => import('../views/users/ProfileView.vue'),
        },
        {
          path: 'userMaterial',
          name: 'UserMaterial',
          component: () => import('../views/materials/UserMaterialView.vue'),
        },
        {
          path: 'userMaterialDetails/:id',
          name: 'UserMaterialDetails',
          component: () => import('../views/materials/UserMaterialDetails.vue'),
        },
        {
          path: 'userMaterialLoan',
          name: 'UserMaterialLoan',
          component: () => import('../views/materials/UserMaterialLoanView.vue'),
        },
      ],
    },
    {
      path: '/material',
      component: DashboardLayout,
      beforeEnter: [authenticate],
      children: [
        {
          path: '',
          name: 'Material',
          component: () => import('../views/materials/MaterialView.vue'),
        },
        {
          path: 'details/:id',
          name: 'MaterialDetails',
          component: () => import('../views/materials/MaterialDetails.vue'),
        },
        {
          path: 'create',
          name: 'MaterialCreate',
          component: () => import('../views/materials/MaterialCreateView.vue'),
        },
        {
          path: 'materialLoan',
          name: 'MaterialLoan',
          component: () => import('../views/materials/MaterialLoanView.vue'),
        },
      ],
    },
    {
      path: '/user',
      component: DashboardLayout,
      beforeEnter: [authenticate],
      children: [
        {
          path: '',
          name: 'User',
          component: () => import('../views/users/UserView.vue'),
        },
        {
          path: 'userDetails/:id',
          name: 'UserDetails',
          component: () => import('../views/users/UserDetailView.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/authentication/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/authentication/SignupView.vue'),
    },
    {
      path: '',
      component: HomeLayout,
      children: [
        {
          path: '',
          name: 'Home',
          component: HomeView,
        },
      ],
    },
  ],
})

export default router
