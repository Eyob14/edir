<script setup lang="ts">
import type { Expense } from '@mono/server/src/shared/entities'
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
import ExpenseDetails from '@/components/modals/ExpenseDetails.vue'

const { expenses, visible } = defineProps(['expenses', 'visible'])

const emit = defineEmits(['openModal', 'recalculate', 'update'])

const calculateTotalIncome = () => {
  emit('recalculate')
}

const updateExpensesData = (expenses: Expense[]) => {
  emit('update', expenses)
}

const deleteButtonLoading = ref(false)
const errorMessage = ref('')

async function deleteExpense(expenseId: number) {
  try {
    deleteButtonLoading.value = true
    await trpc.expense.deleteExpense.mutate({ id: expenseId })
    deleteButtonLoading.value = false
    Toast.fire({
      icon: 'success',
      title: 'Expense Deleted Successfully',
    })
    const updatedExpenses = expenses.filter((expense: Expense) => expense.id !== expenseId)
    updateExpensesData(updatedExpenses)
    calculateTotalIncome()
  } catch (error) {
    deleteButtonLoading.value = false
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
    Toast.fire({
      icon: 'error',
      title: 'Could Not Delete Expense!',
      text: errorMessage.value,
    })
  }
}

// expense modal
const isExpenseModalOpened = ref(false)
const selectedExpense = ref<Expense>()

const openExpenseModal = (expense: Expense) => {
  isExpenseModalOpened.value = true
  selectedExpense.value = expense
}

const closeExpenseModal = () => {
  isExpenseModalOpened.value = false
}
</script>
<template>
  <div class="flex flex-col space-y-10">
    <fwb-button
      component="RouterLink"
      tag="router-link"
      :href="{ name: 'CreateExpense' } as any"
      size="xs"
      class="flex h-10 w-32 items-center justify-center self-end"
      v-if="visible"
    >
      New Expense
    </fwb-button>
    <fwb-table>
      <fwb-table-head>
        <fwb-table-head-cell>Expense Date</fwb-table-head-cell>
        <fwb-table-head-cell>Expense Type</fwb-table-head-cell>
        <fwb-table-head-cell>Amount</fwb-table-head-cell>
        <fwb-table-head-cell>Payed By</fwb-table-head-cell>
        <fwb-table-head-cell>Payed For</fwb-table-head-cell>
        <fwb-table-head-cell>Details</fwb-table-head-cell>
      </fwb-table-head>
      <fwb-table-body v-if="expenses.length">
        <fwb-table-row v-for="expense in expenses" :key="expense.id">
          <fwb-table-cell>{{ dateConvertor(expense.createdAt) }}</fwb-table-cell>
          <fwb-table-cell class="capitalize">{{ expense.type }}</fwb-table-cell>
          <fwb-table-cell>{{ expense.amount }}</fwb-table-cell>
          <fwb-table-cell class="capitalize">{{
            expense.user !== null ? expense.user.firstName + ' ' + expense.user.lastName : '---'
          }}</fwb-table-cell>
          <fwb-table-cell class="capitalize">{{
            expense.material !== null ? expense.material.name : '---'
          }}</fwb-table-cell>
          <fwb-table-cell>
            <fwb-button-group class="space-x-3">
              <FwbButton @click="openExpenseModal(expense)" class="pr-3"> View </FwbButton>
              <FwbButton
                component="RouterLink"
                tag="router-link"
                :href="
                  {
                    name: 'UpdateExpense',
                    params: { id: expense.id },
                  } as any
                "
                class="pr-3"
                color="yellow"
                v-if="visible"
              >
                Edit
              </FwbButton>
              <FwbButton
                @click="deleteExpense(expense.id)"
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
            <div class="flex h-40 w-full items-center justify-center border">No Expenses yet!</div>
          </fwb-table-cell>
        </fwb-table-row>
      </fwb-table-body>
    </fwb-table>
  </div>
  <ExpenseDetails
    :visible="isExpenseModalOpened"
    @close="closeExpenseModal"
    :expense="selectedExpense"
  />
</template>
