<script setup lang="ts">
import type { User } from '@mono/server/src/shared/entities'
import { onBeforeMount, ref } from 'vue'
import { FwbButton } from 'flowbite-vue'
import { trpc } from '@/trpc'
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
  FwbHeading,
} from 'flowbite-vue'
import { DEFAULT_SERVER_ERROR } from '@/consts'

const users = ref<User[]>([])
const errorMessage = ref('')

onBeforeMount(async () => {
  users.value = await trpc.user.find.query()
})

async function verifyUser(userId: number) {
  try {
    await trpc.user.approve.mutate({ id: userId })
    users.value = await trpc.user.find.query()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
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
            <FwbButton
              component="RouterLink"
              tag="router-link"
              :href="{ name: 'UserDetails', params: { id: user.id } } as any"
              class="pr-3"
            >
              View
            </FwbButton>
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
