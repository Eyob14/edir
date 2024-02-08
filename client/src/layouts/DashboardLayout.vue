<script setup lang="ts">
import { FwbNavbarLink } from 'flowbite-vue'
import StackedLayout from './StackedLayout.vue'
import { logout } from '@/stores/user'
import { useRouter } from 'vue-router'

const router = useRouter()

const links = [
  { label: 'Dashboard', name: 'Dashboard', isActive: false },
  { label: 'Material', name: 'Material', isActive: false },
  { label: 'Material Loans', name: 'MaterialLoan', isActive: false },
  { label: 'Users', name: 'User', isActive: false },
  { label: 'Monetary', name: 'Monetary', isActive: false },
]

function logoutUser() {
  logout()
  router.push({ name: 'Login' })
}
</script>

<template>
  <StackedLayout :links="links">
    <template #menu>
      <FwbNavbarLink @click.prevent="logoutUser" link="#">Logout</FwbNavbarLink>
    </template>
  </StackedLayout>
</template>
