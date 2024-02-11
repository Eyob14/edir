<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { User, Relative } from '@mono/server/src/shared/entities'
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
  FwbButtonGroup,
} from 'flowbite-vue'
import RelativeDetailsModal from '@/components/modals/RelativeDetails.vue'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import { Toast } from '@/utils/snackBarUtil'

const userId = authUserId.value

const user = ref<User>()
const isRelativeModalOpened = ref(false)
const selectedRelative = ref<Relative>()

const openRelativeModal = (relative: Relative) => {
  isRelativeModalOpened.value = true
  selectedRelative.value = relative
}
const closeRelativeModal = () => {
  isRelativeModalOpened.value = false
}

watchEffect(async () => {
  if (userId) {
    user.value = await trpc.user.getDetails.query({ id: userId })
  }
})

const deleteButtonLoading = ref(false)
const errorMessage = ref('')

async function deleteRelative(relativeId: number) {
  try {
    deleteButtonLoading.value = true
    await trpc.relative.deleteRelative.mutate({ id: relativeId })
    user.value = await trpc.user.getDetails.query({ id: userId! })
    deleteButtonLoading.value = false
    Toast.fire({
      icon: 'success',
      title: 'Income Deleted Successfully',
    })
    // const updatedIncomes = incomes.filter((income: Income) => income.id !== relativeId)
    // updateIncomeData(updatedIncomes)
    // calculateTotalIncome()
  } catch (error) {
    deleteButtonLoading.value = false
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
    Toast.fire({
      icon: 'error',
      title: 'Could Not Delete Income!',
      text: errorMessage.value,
    })
  }
}
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
      <fwb-table-body v-if="user?.relatives.length">
        <fwb-table-row v-for="relative in user?.relatives" :key="relative.id">
          <fwb-table-cell>{{ relative.firstName + ' ' + relative.lastName }}</fwb-table-cell>
          <fwb-table-cell>{{ relative.email }}</fwb-table-cell>
          <fwb-table-cell>{{ relative.age }}</fwb-table-cell>
          <fwb-table-cell>
            <span
              class="p-4 text-white"
              :class="{
                'bg-green-500': relative.isVerified,
                'bg-red-500': !relative.isVerified,
              }"
            >
              {{ relative.isVerified ? 'Verified' : 'Unverified' }}
            </span>
          </fwb-table-cell>
          <fwb-table-cell class="text-left">
            <fwb-button-group class="space-x-3">
              <FwbButton @click="openRelativeModal(relative)" class="pr-3"> View </FwbButton>
              <FwbButton
                component="RouterLink"
                tag="router-link"
                :href="
                  {
                    name: 'RelativeUpdate',
                    params: { id: relative.id },
                  } as any
                "
                class="pr-3"
                color="yellow"
              >
                Edit
              </FwbButton>
              <FwbButton
                @click="deleteRelative(relative.id)"
                :loading="deleteButtonLoading"
                class="pr-3"
                color="red"
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
            <div class="flex h-40 w-full items-center justify-center border">No Relatives yet!</div>
          </fwb-table-cell>
        </fwb-table-row>
      </fwb-table-body>
    </fwb-table>
  </div>
  <RelativeDetailsModal
    :visible="isRelativeModalOpened"
    @close="closeRelativeModal"
    :relative="selectedRelative"
  />
</template>
