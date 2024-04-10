<script setup lang="ts">
import { useRoute } from 'vue-router'
import { ref, watchEffect } from 'vue'
import { trpc } from '@/trpc'
import { FwbTab, FwbTabs } from 'flowbite-vue'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import RelativeDetailsModal from '@/components/modals/RelativeDetails.vue'
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
  FwbButton,
  FwbHeading,
} from 'flowbite-vue'
import { dateConvertor } from '@/utils/dateConvertor'
import type { Relative, Income, MaterialLoan, User } from '@mono/server/src/shared/entities'
import MaterialLoanModal from '@/components/modals/MaterialLoan.vue'
import IncomeTableComponent from '@/components/tables/IncomeTableComponent.vue'

const route = useRoute()
const userId = Number(route.params.id)

const user = ref<User>()
const errorMessage = ref('')
const showSnackBar = ref(false)
const snackBarMessage = ref('')
const snackBarType = ref('success')

const materialLoans = ref<MaterialLoan[]>([])
const incomes = ref<Income[]>([])

const activeTab = ref('first')

watchEffect(async () => {
  user.value = await trpc.user.getDetails.query({ id: userId })
  materialLoans.value = await trpc.materialLoan.findByUserId.query({ id: userId })
  incomes.value = await trpc.income.findByUserId.query({ id: userId })
})

async function verifyRelative(relativeId: number) {
  try {
    await trpc.relative.verifyRelative.mutate({ id: relativeId })
    user.value = await trpc.user.getDetails.query({ id: userId })
    showSnackBar.value = true
    snackBarMessage.value = 'Relative Verified Successfully'
    snackBarType.value = 'success'
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
    showSnackBar.value = true
    snackBarMessage.value = errorMessage.value
    snackBarType.value = 'error'
  }
}

const isRelativeModalOpened = ref(false)
const selectedRelative = ref<Relative>()

const openRelativeModal = (relative: Relative) => {
  isRelativeModalOpened.value = true
  selectedRelative.value = relative
}
const closeRelativeModal = () => {
  isRelativeModalOpened.value = false
}


const isMaterialLoanModalOpened = ref(false)
const selectedMaterialLoan = ref<MaterialLoan>()

const openMaterialLoanModal = (materialLoan: MaterialLoan) => {
  isMaterialLoanModalOpened.value = true
  selectedMaterialLoan.value = materialLoan
}
const closeMaterialLoanModal = () => {
  isMaterialLoanModalOpened.value = false
}
</script>

<template>
  <SnackBar :visible="showSnackBar" :message="snackBarMessage" :type="snackBarType" />
  <div class="flex flex-col space-y-6">
    <FwbHeading tag="h2" class="text-[#383e49d4]">User Details</FwbHeading>

    <div class="flex flex-col space-y-8">
      <div v-if="user" class="flex justify-between">
        <div class="w-1/2">
          <div class="w-3/5">
            <img v-if="user.profileImage" :src="user.profileImage" alt="Profile Image" />
          </div>
        </div>
        <div class="flex w-1/2 flex-col space-y-4">
          <p>Name: {{ user.firstName }} {{ user.lastName }}</p>
          <p>Email: {{ user.email }}</p>
          <p>Age: {{ user.age }}</p>
          <p>Verification: {{ user.isVerified ? 'Verified' : 'Unverified' }}</p>
          <p>Created At: {{ dateConvertor(user.createdAt) }}</p>
        </div>
      </div>

      <div class="div">
        <fwb-tabs v-model="activeTab" variant="underline" class="p-5">
          <fwb-tab name="first" title="Relatives">
            <fwb-table>
              <fwb-table-head>
                <fwb-table-head-cell>Full Name</fwb-table-head-cell>
                <fwb-table-head-cell>Email</fwb-table-head-cell>
                <fwb-table-head-cell>Age</fwb-table-head-cell>
                <fwb-table-head-cell>Verification</fwb-table-head-cell>
                <fwb-table-head-cell>Action</fwb-table-head-cell>
                <fwb-table-head-cell> Detail </fwb-table-head-cell>
              </fwb-table-head>
              <fwb-table-body v-if="user?.relatives.length">
                <fwb-table-row v-for="relative in user?.relatives" :key="relative.id">
                  <fwb-table-cell>{{
                    relative.firstName + ' ' + relative.lastName
                  }}</fwb-table-cell>
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
                  <fwb-table-cell>
                    <fwb-button
                      v-if="!relative.isVerified"
                      color="yellow"
                      @click="verifyRelative(relative.id)"
                      >Verify</fwb-button
                    >
                    <fwb-button v-else color="green" disabled>Verified</fwb-button>
                  </fwb-table-cell>
                  <fwb-table-cell class="text-left">
                    <FwbButton @click="openRelativeModal(relative)" class="pr-3"> View </FwbButton>
                  </fwb-table-cell>
                </fwb-table-row>
              </fwb-table-body>
              <fwb-table-body v-else>
                <fwb-table-row>
                  <fwb-table-cell colspan="6">
                    <div class="flex h-40 w-full items-center justify-center border">
                      No Relatives yet!
                    </div>
                  </fwb-table-cell>
                </fwb-table-row>
              </fwb-table-body>
            </fwb-table>
          </fwb-tab>
          <fwb-tab name="second" title="Payment">
            <IncomeTableComponent :incomes="incomes" :visible="false" />
          </fwb-tab>
          <fwb-tab name="third" title="Material Loan">
            <fwb-table>
              <fwb-table-head>
                <fwb-table-head-cell>Material Name</fwb-table-head-cell>
                <fwb-table-head-cell>Requested Count</fwb-table-head-cell>
                <fwb-table-head-cell>Request Status</fwb-table-head-cell>
                <fwb-table-head-cell>Requested Date</fwb-table-head-cell>
                <fwb-table-head-cell>Return Status</fwb-table-head-cell>
                <fwb-table-head-cell>Details</fwb-table-head-cell>
              </fwb-table-head>
              <fwb-table-body v-if="materialLoans.length">
                <fwb-table-row v-for="materialLoan in materialLoans" :key="materialLoan.id">
                  <fwb-table-cell class="capitalize">{{
                    materialLoan.material.name
                  }}</fwb-table-cell>
                  <fwb-table-cell>{{ materialLoan.countTaken }}</fwb-table-cell>
                  <fwb-table-cell>
                    <span
                      :class="{
                        'text-green-500': materialLoan.isApproved,
                        'text-red-500': !materialLoan.isApproved,
                      }"
                    >
                      {{ materialLoan.isApproved ? 'Approved' : 'Not Approved' }}
                    </span>
                  </fwb-table-cell>
                  <fwb-table-cell>
                    {{ dateConvertor(materialLoan.requestedDate) }}
                  </fwb-table-cell>
                  <fwb-table-cell>
                    <span
                      :class="{
                        'text-green-500': materialLoan.isReturned,
                        'text-red-500': !materialLoan.isReturned,
                      }"
                    >
                      {{ materialLoan.isReturned ? 'Returned' : 'Pending' }}
                    </span>
                  </fwb-table-cell>

                  <fwb-table-cell>
                    <FwbButton class="pr-3" @click="openMaterialLoanModal(materialLoan)"
                      >View</FwbButton
                    >
                  </fwb-table-cell>
                </fwb-table-row>
              </fwb-table-body>
              <fwb-table-body v-else>
                <fwb-table-row>
                  <fwb-table-cell colspan="6">
                    <div class="flex h-40 w-full items-center justify-center border">
                      No Material Loans yet!
                    </div>
                  </fwb-table-cell>
                </fwb-table-row>
              </fwb-table-body>
            </fwb-table>
          </fwb-tab>
        </fwb-tabs>
      </div>
    </div>
  </div>
  <RelativeDetailsModal
    :visible="isRelativeModalOpened"
    @close="closeRelativeModal"
    :relative="selectedRelative"
  />
  <MaterialLoanModal
    :visible="isMaterialLoanModalOpened"
    @close="closeMaterialLoanModal"
    :materialLoan="selectedMaterialLoan"
  />
</template>
