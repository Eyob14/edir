<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
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
} from 'flowbite-vue'
import MaterialLoanModal from '@/components/modals/MaterialLoan.vue'

const materialLoans = ref<MaterialLoan[]>([])
const selectedMaterialLoan = ref<MaterialLoan>()

onBeforeMount(async () => {
  materialLoans.value = await trpc.materialLoan.find.query()
  console.log('Material Loans: ', materialLoans.value)
})
const isModalOpened = ref(false)

const openModal = (materialLoan: MaterialLoan) => {
  isModalOpened.value = true
  selectedMaterialLoan.value = materialLoan
}

const closeModal = () => {
  isModalOpened.value = false
}
</script>

<template>
  <fwb-table>
    <fwb-table-head>
      <fwb-table-head-cell>Material Name</fwb-table-head-cell>
      <fwb-table-head-cell>Requested Count</fwb-table-head-cell>
      <fwb-table-head-cell>Status</fwb-table-head-cell>
      <fwb-table-head-cell>Requested Date</fwb-table-head-cell>
      <fwb-table-head-cell>Details</fwb-table-head-cell>
    </fwb-table-head>
    <fwb-table-body v-if="materialLoans.length">
      <fwb-table-row v-for="materialLoan in materialLoans" :key="materialLoan.id">
        <fwb-table-cell>{{ materialLoan.material.name }}</fwb-table-cell>
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
          {{ materialLoan.requestedDate }}
        </fwb-table-cell>
        <fwb-table-cell>
          <FwbButton class="pr-3" @click="openModal(materialLoan)"> View </FwbButton>
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
  <MaterialLoanModal :visible="isModalOpened" @close="closeModal" :materialLoan="selectedMaterialLoan" />
</template>
