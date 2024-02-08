<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { User } from '@mono/server/src/shared/entities'
import { trpc } from '@/trpc'
import { authUserId } from '../../stores/user'
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
  FwbButton,
} from 'flowbite-vue'

const userId = authUserId.value

const user = ref<User>()

watchEffect(async () => {
  if (userId) {
    user.value = await trpc.user.getDetails.query({ id: userId })
    console.log('User', user.value)
  }
})
</script>

<template>
  <div class="flex flex-col space-y-10">
    <fwb-button
      component="RouterLink"
      tag="router-link"
      :href="{ name: 'RelativeCreate' } as any"
      size="xs"
      class="flex h-10 w-32 items-center justify-center self-end"
    >
      New Relative
    </fwb-button>
    <fwb-table>
      <fwb-table-head>
        <fwb-table-head-cell>Full Name</fwb-table-head-cell>
        <fwb-table-head-cell>Email</fwb-table-head-cell>
        <fwb-table-head-cell>Age</fwb-table-head-cell>
        <fwb-table-head-cell>Verification</fwb-table-head-cell>
        <fwb-table-head-cell> Detail </fwb-table-head-cell>
      </fwb-table-head>
      <fwb-table-body>
        <fwb-table-row v-for="relative in user?.relatives" :key="relative.id">
          <fwb-table-cell>{{ relative.firstName + ' ' + relative.lastName }}</fwb-table-cell>
          <fwb-table-cell>{{ relative.email }}</fwb-table-cell>
          <fwb-table-cell>{{ relative.age }}</fwb-table-cell>
          <fwb-table-cell>
            <span
              :class="{
                'text-green-500': relative.isVerified,
                'text-red-500': !relative.isVerified,
              }"
            >
              {{ relative.isVerified ? 'Verified' : 'Unverified' }}
            </span>
          </fwb-table-cell>
          <fwb-table-cell class="text-left">
            <FwbButton class="pr-3"> View </FwbButton>
          </fwb-table-cell>
        </fwb-table-row>
      </fwb-table-body>
    </fwb-table>
  </div>
</template>
