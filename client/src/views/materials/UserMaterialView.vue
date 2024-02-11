<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { trpc } from '@/trpc'
import type { MaterialBare } from '@mono/server/src/shared/entities'
import ModalComponent from '../../components/Modal.vue'
import PageForm from '@/components/PageForm.vue'
import { useRouter } from 'vue-router'
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
  FwbInput,
  FwbButton,
  FwbTextarea,
  FwbAlert,
} from 'flowbite-vue'
import useErrorMessage from '@/composables/useErrorMessage'
import { Toast } from '@/utils/snackBarUtil'

const router = useRouter()

const materials = ref<MaterialBare[]>([])
const materialLoanForm = ref({
  countTaken: '',
  requestedDate: '',
  reason: '',
  materialId: 0,
})

onBeforeMount(async () => {
  materials.value = await trpc.material.find.query()
})

const isModalOpened = ref(false)

const openModal = (id: number) => {
  isModalOpened.value = true
  materialLoanForm.value.materialId = id
}

const closeModal = () => {
  isModalOpened.value = false
}

const [submitMaterialLoan, errorMessage] = useErrorMessage(async () => {
  const newMaterialLoan = {
    reason: materialLoanForm.value.reason,
    countTaken: parseInt(materialLoanForm.value.countTaken),
    requestedDate: new Date(materialLoanForm.value.requestedDate),
    materialId: materialLoanForm.value.materialId,
  }
  await trpc.materialLoan.create.mutate(newMaterialLoan)
  Toast.fire({
    icon: 'success',
    title: 'Material Loan Created Successfully',
  })
  router.push({ name: 'UserMaterialLoan' })
  closeModal()
})
</script>

<template>
  <fwb-table>
    <fwb-table-head>
      <fwb-table-head-cell>Material Name</fwb-table-head-cell>
      <fwb-table-head-cell>Remaining Count</fwb-table-head-cell>
      <fwb-table-head-cell>Availability</fwb-table-head-cell>
      <fwb-table-head-cell>Request Reserve</fwb-table-head-cell>
      <fwb-table-head-cell>Details</fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body v-if="materials.length">
      <fwb-table-row v-for="material in materials" :key="material.id">
        <fwb-table-cell>{{ material.name }}</fwb-table-cell>
        <fwb-table-cell>{{ material.remainingCount }}</fwb-table-cell>
        <fwb-table-cell>
          <span
            :class="{
              'text-green-500': material.remainingCount > 0,
              'text-red-500': material.remainingCount === 0,
            }"
          >
            {{ material.remainingCount > 0 ? 'Available' : 'Unavailable' }}
          </span>
        </fwb-table-cell>
        <fwb-table-cell>
          <FwbButton class="pr-3" @click="openModal(material.id)"> Request </FwbButton>
        </fwb-table-cell>
        <fwb-table-cell>
          <FwbButton
            component="RouterLink"
            tag="router-link"
            :href="{ name: 'UserMaterialDetails', params: { id: material.id } } as any"
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
          <div class="flex h-40 w-full items-center justify-center border">No Materials yet!</div>
        </fwb-table-cell>
      </fwb-table-row>
    </fwb-table-body>
  </fwb-table>
  <ModalComponent :visible="isModalOpened" @close="closeModal">
    <template #header>
      <h1 class="flex w-full items-center justify-center text-2xl font-extrabold">
        Material Loan Request
      </h1>
    </template>
    <template #body>
      <PageForm class="m-0 p-0" heading="" formLabel="Login" @submit="submitMaterialLoan">
        <template #default>
          <FwbInput
            aria-label="Requested Date"
            v-model="materialLoanForm.requestedDate"
            :type="'date'"
            label="Requested Date"
            required
          />
          <FwbInput
            aria-label="Count"
            v-model="materialLoanForm.countTaken"
            :type="'number'"
            label="Count"
            placeholder="Material count"
            required
          />
          <div class="mt-4">
            <fwb-textarea
              v-model="materialLoanForm.reason"
              :rows="4"
              :minlength="2"
              label="Loan Reason"
              placeholder="Write your reason..."
              required
            />
          </div>

          <FwbAlert v-if="errorMessage" type="danger">
            {{ errorMessage }}
          </FwbAlert>
          <div class="flex justify-end space-x-6">
            <fwb-button @click="closeModal" color="alternative"> Cancel </fwb-button>
            <fwb-button type="submit" color="green"> Create </fwb-button>
          </div>
        </template>
      </PageForm>
    </template>
  </ModalComponent>
</template>
