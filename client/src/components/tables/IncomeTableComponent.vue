<script setup lang="ts">
import type { Income } from '@mono/server/src/shared/entities'
import { dateConvertor } from '@/utils/dateConvertor'
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
import { Toast } from '@/utils/snackBarUtil'
import { trpc } from '@/trpc'
import { ref } from 'vue'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import IncomeDetails from '@/components/modals/IncomeDetails.vue'

const { incomes, visible } = defineProps(['incomes', 'visible'])

const emit = defineEmits(['openModal', 'recalculate', 'update'])

const calculateTotalIncome = () => {
  emit('recalculate')
}

const updateIncomeData = (incomes: Income[]) => {
  emit('update', incomes)
}
const deleteButtonLoading = ref(false)
const errorMessage = ref('')

async function deleteIncome(incomeId: number) {
  try {
    deleteButtonLoading.value = true
    await trpc.income.deleteIncome.mutate({ id: incomeId })
    deleteButtonLoading.value = false
    Toast.fire({
      icon: 'success',
      title: 'Income Deleted Successfully',
    })
    const updatedIncomes = incomes.filter((income: Income) => income.id !== incomeId)
    updateIncomeData(updatedIncomes)
    calculateTotalIncome()
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
// income modal
const isIncomeModalOpened = ref(false)
const selectedIncome = ref<Income>()

const openIncomeModal = (income: Income) => {
  isIncomeModalOpened.value = true
  selectedIncome.value = income
}

const closeIncomeModal = () => {
  isIncomeModalOpened.value = false
}
</script>
<template>
  <div class="flex flex-col space-y-10">
    <fwb-button
      component="RouterLink"
      tag="router-link"
      :href="{ name: 'CreateIncome' } as any"
      size="xs"
      class="flex h-10 w-32 items-center justify-center self-end"
      v-if="visible"
    >
      New Income
    </fwb-button>
    <fwb-table>
      <fwb-table-head>
        <fwb-table-head-cell>Income Date</fwb-table-head-cell>
        <fwb-table-head-cell>Income Type</fwb-table-head-cell>
        <fwb-table-head-cell>Amount</fwb-table-head-cell>
        <fwb-table-head-cell>Payed By</fwb-table-head-cell>
        <fwb-table-head-cell>Actions</fwb-table-head-cell>
      </fwb-table-head>
      <fwb-table-body v-if="incomes.length">
        <fwb-table-row v-for="income in incomes" :key="income.id">
          <fwb-table-cell>{{ dateConvertor(income.createdAt) }}</fwb-table-cell>
          <fwb-table-cell class="capitalize">{{ income.type }}</fwb-table-cell>
          <fwb-table-cell>{{ income.amount }}</fwb-table-cell>
          <fwb-table-cell class="capitalize">{{
            income.user.firstName + ' ' + income.user.lastName
          }}</fwb-table-cell>
          <fwb-table-cell>
            <fwb-button-group class="space-x-3">
              <FwbButton @click="openIncomeModal(income)" class="pr-3"> View </FwbButton>
              <FwbButton
                component="RouterLink"
                tag="router-link"
                :href="
                  {
                    name: 'UpdateIncome',
                    params: { id: income.id },
                  } as any
                "
                class="pr-3"
                color="yellow"
                v-if="visible"
              >
                Edit
              </FwbButton>
              <FwbButton
                @click="deleteIncome(income.id)"
                :loading="deleteButtonLoading"
                class="pr-3"
                color="red"
                v-if="visible"
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
            <div class="flex h-40 w-full items-center justify-center border">No Incomes yet!</div>
          </fwb-table-cell>
        </fwb-table-row>
      </fwb-table-body>
    </fwb-table>
  </div>
  <IncomeDetails
    :visible="isIncomeModalOpened"
    @close="closeIncomeModal"
    :income="selectedIncome"
  />
</template>
