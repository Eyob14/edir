<script setup lang="ts">
import { watchEffect, ref } from 'vue'
import { trpc } from '@/trpc'
import type { MaterialLoan } from '@mono/server/src/shared/entities'
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
  FwbButton,
  FwbInput,
  FwbTextarea,
  FwbAlert,
} from 'flowbite-vue'
import MaterialLoanModal from '@/components/modals/MaterialLoan.vue'
import useErrorMessage from '@/composables/useErrorMessage'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import ModalComponent from '@/components/Modal.vue'
import PageForm from '@/components/PageForm.vue'
import { dateConvertor } from '@/utils/dateConvertor'
import { Toast } from '@/utils/snackBarUtil'

const materialLoans = ref<MaterialLoan[]>([])
const selectedMaterialLoan = ref<MaterialLoan>()
const errorMessage = ref('')

watchEffect(async () => {
  materialLoans.value = await trpc.materialLoan.find.query()
})
const isViewModalOpened = ref(false)
const isEditModalOpened = ref(false)
const isReturnModalOpened = ref(false)

const openViewModal = (materialLoan: MaterialLoan) => {
  isViewModalOpened.value = true
  selectedMaterialLoan.value = materialLoan
}
const closeViewModal = () => {
  isViewModalOpened.value = false
}

const materialLoanForm = ref({
  countTaken: '',
  id: 0,
})

const openEditModal = (materialLoan: MaterialLoan) => {
  isEditModalOpened.value = true

  materialLoanForm.value.countTaken = materialLoan.countTaken.toString()
  materialLoanForm.value.id = materialLoan.id
  selectedMaterialLoan.value = materialLoan
}
const closeEditModal = () => {
  isEditModalOpened.value = false
}

const editButtonLoading = ref(false)

const [submitEditMaterialLoan, editErrorMessage] = useErrorMessage(async () => {
  try {
    editButtonLoading.value = true
    const updatedMaterialLoan = {
      countTaken: parseInt(materialLoanForm.value.countTaken),
      id: materialLoanForm.value.id,
      requestedDate: new Date(selectedMaterialLoan.value?.requestedDate!),
      reason: selectedMaterialLoan.value?.reason!,
    }
    await trpc.materialLoan.update.mutate(updatedMaterialLoan)
    editButtonLoading.value = false
    materialLoans.value = await trpc.materialLoan.find.query()
    closeEditModal()
    Toast.fire({
      icon: 'success',
      title: 'Material loan updated successfully',
    })
  } catch (error) {
    editButtonLoading.value = false
    Toast.fire({
      icon: 'error',
      title: 'Could not update material loan!',
    })
    throw error
  }
})

const materialLoanReturnForm = ref({
  countReturned: '',
  description: '',
  id: 0,
})

const openReturnModal = (materialLoan: MaterialLoan) => {
  isReturnModalOpened.value = true
  materialLoanReturnForm.value.id = materialLoan.id
}
const closeReturnModal = () => {
  isReturnModalOpened.value = false
}
const returnButtonLoading = ref(false)
const [submitReturnMaterialLoan, returnErrorMessage] = useErrorMessage(async () => {
  try {
    returnButtonLoading.value = true
    const returnMaterialLoan = {
      countReturned: parseInt(materialLoanReturnForm.value.countReturned),
      id: materialLoanReturnForm.value.id,
      description: materialLoanReturnForm.value?.description!,
    }
    await trpc.materialLoan.returnMaterialLoan.mutate(returnMaterialLoan)
    returnButtonLoading.value = false
    materialLoans.value = await trpc.materialLoan.find.query()
    closeReturnModal()
    Toast.fire({
      icon: 'success',
      title: 'Material loan returned successfully',
    })
  } catch (error) {
    returnButtonLoading.value = false
    Toast.fire({
      icon: 'error',
      title: 'Could not return material loan!',
    })
    throw error
  }
})

const approveButtonLoading = ref(false)
async function approveMaterialLoan(materialLoanId: number) {
  try {
    approveButtonLoading.value = true
    await trpc.materialLoan.approveMaterialLoan.mutate({ id: materialLoanId })
    approveButtonLoading.value = false
    materialLoans.value = await trpc.materialLoan.find.query()
    Toast.fire({
      icon: 'success',
      title: 'Material loan approved successfully',
    })
  } catch (error) {
    approveButtonLoading.value = false
    Toast.fire({
      icon: 'error',
      title: 'Could not approve material loan!',
    })
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
  }
}
</script>

<template>
  <fwb-table>
    <fwb-table-head>
      <fwb-table-head-cell>Material Name</fwb-table-head-cell>
      <fwb-table-head-cell>Requested Count</fwb-table-head-cell>
      <fwb-table-head-cell>Request Status</fwb-table-head-cell>
      <fwb-table-head-cell>Requested Date</fwb-table-head-cell>
      <fwb-table-head-cell>Return Status</fwb-table-head-cell>
      <fwb-table-head-cell>Approval</fwb-table-head-cell>
      <fwb-table-head-cell>Edit</fwb-table-head-cell>
      <fwb-table-head-cell>Return</fwb-table-head-cell>
      <fwb-table-head-cell>Details</fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body v-if="materialLoans.length">
      <fwb-table-row v-for="materialLoan in materialLoans" :key="materialLoan.id">
        <fwb-table-cell class="capitalize">{{ materialLoan.material.name }}</fwb-table-cell>
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
          <fwb-button
            v-if="!materialLoan.isApproved"
            color="yellow"
            @click="approveMaterialLoan(materialLoan.id)"
            :loading="approveButtonLoading"
            >Approve</fwb-button
          >
          <fwb-button v-else color="green" disabled>Approved</fwb-button>
        </fwb-table-cell>
        <fwb-table-cell>
          <FwbButton class="pr-3" @click="openEditModal(materialLoan)">Edit</FwbButton>
        </fwb-table-cell>
        <fwb-table-cell>
          <FwbButton
            v-if="!materialLoan.isReturned"
            color="yellow"
            class="pr-3"
            @click="openReturnModal(materialLoan)"
            >Return</FwbButton
          >
          <fwb-button v-else color="green" disabled>Returned</fwb-button>
        </fwb-table-cell>
        <fwb-table-cell>
          <FwbButton class="pr-3" @click="openViewModal(materialLoan)">View</FwbButton>
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
  <MaterialLoanModal
    :visible="isViewModalOpened"
    @close="closeViewModal"
    :materialLoan="selectedMaterialLoan"
  />
  <ModalComponent :visible="isEditModalOpened" @close="closeEditModal">
    <template #header>
      <h1 class="flex w-full items-center justify-center text-2xl font-extrabold">
        Material Loan Request
      </h1>
    </template>
    <template #body>
      <PageForm
        class="m-0 p-0"
        heading=""
        formLabel="Update material loan"
        @submit="submitEditMaterialLoan"
      >
        <template #default>
          <FwbInput
            aria-label="Count"
            v-model="materialLoanForm.countTaken"
            :type="'number'"
            label="Count"
            placeholder="Material count"
          />

          <FwbAlert v-if="editErrorMessage" type="danger">
            {{ editErrorMessage }}
          </FwbAlert>
          <div class="flex justify-end space-x-6">
            <fwb-button @click="closeEditModal" color="alternative"> Cancel </fwb-button>
            <fwb-button type="submit" color="green" :loading="editButtonLoading">
              Update
            </fwb-button>
          </div>
        </template>
      </PageForm>
    </template>
  </ModalComponent>
  <ModalComponent :visible="isReturnModalOpened" @close="closeReturnModal">
    <template #header>
      <h1 class="flex w-full items-center justify-center text-2xl font-extrabold">
        Return Material Loan
      </h1>
    </template>
    <template #body>
      <PageForm
        class="m-0 p-0"
        heading=""
        formLabel="Return material loan"
        @submit="submitReturnMaterialLoan"
      >
        <template #default>
          <FwbInput
            aria-label="Returned Material Count"
            v-model="materialLoanReturnForm.countReturned"
            :type="'number'"
            label="Returned Material Count"
            placeholder="Returned Material Count"
            required
          />
          <div class="mt-4">
            <fwb-textarea
              v-model="materialLoanReturnForm.description"
              :rows="4"
              :minlength="2"
              label="Loan Return Description"
              placeholder="Write your description..."
              required
            />
          </div>

          <FwbAlert v-if="returnErrorMessage" type="danger">
            {{ returnErrorMessage }}
          </FwbAlert>
          <div class="flex justify-end space-x-6">
            <fwb-button @click="closeReturnModal" color="alternative"> Cancel </fwb-button>
            <fwb-button type="submit" color="green" :loading="returnButtonLoading">
              Return
            </fwb-button>
          </div>
        </template>
      </PageForm>
    </template>
  </ModalComponent>
</template>
