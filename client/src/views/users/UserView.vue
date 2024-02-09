<script setup lang="ts">
import type { User } from '@mono/server/src/shared/entities'
import { watchEffect, ref } from 'vue'
import { trpc } from '@/trpc'
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
  FwbHeading,
  FwbButtonGroup,
  FwbButton,
} from 'flowbite-vue'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import { Toast } from '@/utils/snackBarUtil'

const users = ref<User[]>([])
const errorMessage = ref('')
const deleteButtonLoading = ref(false)
const verifyButtonLoading = ref(false)

watchEffect(async () => {
  users.value = await trpc.user.find.query()
})

async function verifyUser(userId: number) {
  try {
    verifyButtonLoading.value = true
    await trpc.user.approve.mutate({ id: userId })
    Toast.fire({
      icon: 'success',
      title: 'User Verified Successfully',
    })
    users.value = await trpc.user.find.query()
  } catch (error) {
    verifyButtonLoading.value = false
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
    Toast.fire({
      icon: 'error',
      title: 'Could Not Verify User!',
      text: errorMessage.value,
    })
  }
}

async function deleteUser(userId: number) {
  try {
    deleteButtonLoading.value = true
    await trpc.user.deleteUser.mutate({ id: userId })
    deleteButtonLoading.value = false
    Toast.fire({
      icon: 'success',
      title: 'User Deleted Successfully',
    })
    const updatedUsers = users.value.filter((user) => user.id !== userId)
    users.value = updatedUsers
  } catch (error) {
    deleteButtonLoading.value = false
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
    Toast.fire({
      icon: 'error',
      title: 'Could Not Delete User!',
      text: errorMessage.value,
    })
  }
}
</script>

<template>
  <div class="flex flex-col space-y-8">
    <FwbHeading tag="h2" class="text-[#383e49d4]">Users</FwbHeading>

    <fwb-table>
      <fwb-table-head>
        <fwb-table-head-cell>Full Name</fwb-table-head-cell>
        <fwb-table-head-cell>Email</fwb-table-head-cell>
        <fwb-table-head-cell>Age</fwb-table-head-cell>
        <fwb-table-head-cell>Verification</fwb-table-head-cell>
        <fwb-table-head-cell>Action</fwb-table-head-cell>
        <fwb-table-head-cell> Detail </fwb-table-head-cell>
      </fwb-table-head>
      <fwb-table-body v-if="users.length">
        <fwb-table-row v-for="user in users" :key="user.id">
          <fwb-table-cell>{{ user.firstName + ' ' + user.lastName }}</fwb-table-cell>
          <fwb-table-cell>{{ user.email }}</fwb-table-cell>
          <fwb-table-cell>{{ user.age }}</fwb-table-cell>
          <fwb-table-cell>
            <span :class="{ 'text-green-500': user.isVerified, 'text-red-500': !user.isVerified }">
              {{ user.isVerified ? 'Verified' : 'Unverified' }}
            </span>
          </fwb-table-cell>
          <fwb-table-cell>
            <fwb-button v-if="!user.isVerified" color="yellow" @click="verifyUser(user.id)"
              >Verify</fwb-button
            >
            <fwb-button v-else color="green" disabled>Verified</fwb-button>
          </fwb-table-cell>
          <fwb-table-cell class="text-left">
            <fwb-button-group class="space-x-3">
              <FwbButton
                component="RouterLink"
                tag="router-link"
                :href="{ name: 'UserDetails', params: { id: user.id } } as any"
                class="pr-3"
              >
                View
              </FwbButton>

              <FwbButton
                @click="deleteUser(user.id)"
                class="pr-3"
                color="red"
                :loading="deleteButtonLoading"
              >
                Delete
              </FwbButton>
            </fwb-button-group>
          </fwb-table-cell>
        </fwb-table-row>
      </fwb-table-body>
      <fwb-table-body v-else>
        <fwb-table-row>
          <fwb-table-cell colspan="6">
            <div class="flex h-40 w-full items-center justify-center border">No Users yet!</div>
          </fwb-table-cell>
        </fwb-table-row>
      </fwb-table-body>
    </fwb-table>
  </div>
</template>
