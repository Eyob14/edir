<script lang="ts" setup>
import { ref, onBeforeMount, watchEffect } from 'vue'
import ChartComponent from '@/components/chartComponent.vue'
import { trpc } from '@/trpc'
import type { Income, Expense, Penalty, MaterialBare } from '@mono/server/src/shared/entities'
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
  FwbButton,
  FwbTab,
  FwbTabs,
  FwbHeading,
} from 'flowbite-vue'
import { dateConvertor } from '@/utils/dateConvertor'
import IncomeDetails from '@/components/modals/IncomeDetails.vue'
import ExpenseDetails from '@/components/modals/ExpenseDetails.vue'
import PenaltyDetails from '@/components/modals/penaltyDetails.vue'

const activeTab = ref('first')

const incomes = ref<Income[]>([])
const expenses = ref<Expense[]>([])
const penalties = ref<Penalty[]>([])
const materials = ref<MaterialBare[]>([])
const totalIncome = ref(0)
const totalExpense = ref(0)
const totalMaterial = ref(0)
const totalRevenue = ref(0)

watchEffect(async () => {
  const [incomeResult, expenseResult, penaltyResult, materialResult] = await Promise.all([
    trpc.income.find.query(),
    trpc.expense.find.query(),
    trpc.penalty.find.query(),
    trpc.material.find.query(),
  ])

  incomes.value = incomeResult
  expenses.value = expenseResult
  penalties.value = penaltyResult
  materials.value = materialResult

  totalIncome.value = incomeResult.reduce((acc, income) => acc + income.amount, 0)
  totalExpense.value = expenseResult.reduce((acc, expense) => acc + expense.amount, 0)
  totalMaterial.value = materialResult.length
  totalRevenue.value = totalIncome.value - totalExpense.value
})

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

// penalty modal
const isPenaltyModalOpened = ref(false)
const selectedPenalty = ref<Penalty>()

const openPenaltyModal = (penalty: Penalty) => {
  isPenaltyModalOpened.value = true
  selectedPenalty.value = penalty
}

const closePenaltyModal = () => {
  isPenaltyModalOpened.value = false
}
</script>
<template>
  <div class="DashboardView flex flex-col space-y-8">
    <!-- Title section -->
    <FwbHeading tag="h2" class="text-[#383e49d4]">HI Admin</FwbHeading>

    <!-- Main section -->
    <div class="">
      <div class="flex justify-between space-x-8">
        <!-- The cross section -->
        <div class="flex w-1/2 border">
          <div class="w-full">
            <div class="flex flex-col space-y-4 p-2">
              <img src="../assets/uparrow.svg" alt="up arrow icon" class="w-24" />
              <div class="flex flex-col space-y-2 p-4">
                <h3 class="text-xl font-semibold">{{ Number(totalIncome) }}</h3>
                <p class="text-l">Total Income</p>
              </div>
            </div>
            <div class="flex flex-col space-y-4 p-2">
              <img src="../assets/downarrow.svg" alt="up arrow icon" class="w-24" />
              <div class="flex flex-col space-y-2 p-4">
                <h3 class="text-xl font-semibold">{{ Number(totalExpense) }}</h3>
                <p class="text-l">Total Expense</p>
              </div>
            </div>
          </div>
          <div class="w-full">
            <div class="flex flex-col space-y-4 p-2">
              <img src="../assets/materialicon.svg" alt="up arrow icon" class="w-24" />
              <div class="flex flex-col space-y-2 p-4">
                <h3 class="text-xl font-semibold">{{ Number(totalMaterial) }}</h3>
                <p class="text-l">Total Material</p>
              </div>
            </div>
            <div class="flex flex-col space-y-4 p-2">
              <img src="../assets/plusicon.svg" alt="up arrow icon" class="w-24" />
              <div class="flex flex-col space-y-2 p-4">
                <h3 class="text-xl font-semibold">{{ Number(totalRevenue) }}</h3>
                <p class="text-l">Total Revenue</p>
              </div>
            </div>
          </div>
        </div>
        <!-- The graph section -->
        <div class="w-1/2 border-2">
          <ChartComponent :incomes="incomes" :expenses="expenses" :penalties="penalties" />
        </div>
      </div>
    </div>
    <!-- Table data -->
    <div>
      <fwb-tabs v-model="activeTab" variant="underline" class="p-5">
        <fwb-tab name="first" title="Income">
          <fwb-table>
            <fwb-table-head>
              <fwb-table-head-cell>Income Date</fwb-table-head-cell>
              <fwb-table-head-cell>Income Type</fwb-table-head-cell>
              <fwb-table-head-cell>Amount</fwb-table-head-cell>
              <fwb-table-head-cell>Payed By</fwb-table-head-cell>
              <fwb-table-head-cell>Details</fwb-table-head-cell>
            </fwb-table-head>
            <fwb-table-body v-if="incomes.length">
              <fwb-table-row v-for="income in incomes" :key="income.id">
                <fwb-table-cell>{{ dateConvertor(income.createdAt) }}</fwb-table-cell>
                <fwb-table-cell>{{ income.type }}</fwb-table-cell>
                <fwb-table-cell>{{ income.amount }}</fwb-table-cell>
                <fwb-table-cell>{{
                  income.user.firstName + ' ' + income.user.lastName
                }}</fwb-table-cell>
                <fwb-table-cell>
                  <FwbButton @click="openIncomeModal(income)" class="pr-3"> View </FwbButton>
                </fwb-table-cell>
              </fwb-table-row>
            </fwb-table-body>
            <fwb-table-body v-else>
              <fwb-table-row>
                <fwb-table-cell colspan="6">
                  <div class="flex h-40 w-full items-center justify-center border">
                    No Incomes yet!
                  </div>
                </fwb-table-cell>
              </fwb-table-row>
            </fwb-table-body>
          </fwb-table>
        </fwb-tab>
        <fwb-tab name="second" title="Expense">
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
                  expense.user !== null
                    ? expense.user.firstName + ' ' + expense.user.lastName
                    : '---'
                }}</fwb-table-cell>
                <fwb-table-cell class="capitalize">{{
                  expense.material !== null ? expense.material.name : '---'
                }}</fwb-table-cell>
                <fwb-table-cell>
                  <FwbButton @click="openExpenseModal(expense)" class="pr-3"> View </FwbButton>
                </fwb-table-cell>
              </fwb-table-row>
            </fwb-table-body>
            <fwb-table-body v-else>
              <fwb-table-row>
                <fwb-table-cell colspan="6">
                  <div class="flex h-40 w-full items-center justify-center border">
                    No Expenses yet!
                  </div>
                </fwb-table-cell>
              </fwb-table-row>
            </fwb-table-body>
          </fwb-table>
        </fwb-tab>
        <fwb-tab name="third" title="Penalty">
          <fwb-table>
            <fwb-table-head>
              <fwb-table-head-cell>Penalty Date</fwb-table-head-cell>
              <fwb-table-head-cell>Amount</fwb-table-head-cell>
              <fwb-table-head-cell>Payed By</fwb-table-head-cell>
              <fwb-table-head-cell>Details</fwb-table-head-cell>
            </fwb-table-head>
            <fwb-table-body v-if="penalties.length">
              <fwb-table-row v-for="penalty in penalties" :key="penalty.id">
                <fwb-table-cell>{{ dateConvertor(penalty.createdAt) }}</fwb-table-cell>
                <fwb-table-cell>{{ penalty.amount }}</fwb-table-cell>
                <fwb-table-cell class="capitalize">{{
                  penalty.user.firstName + ' ' + penalty.user.lastName
                }}</fwb-table-cell>
                <fwb-table-cell>
                  <FwbButton @click="openPenaltyModal(penalty)" class="pr-3"> View </FwbButton>
                </fwb-table-cell>
              </fwb-table-row>
            </fwb-table-body>
            <fwb-table-body v-else>
              <fwb-table-row>
                <fwb-table-cell colspan="6">
                  <div class="flex h-40 w-full items-center justify-center border">
                    No Penalties yet!
                  </div>
                </fwb-table-cell>
              </fwb-table-row>
            </fwb-table-body>
          </fwb-table>
        </fwb-tab>
      </fwb-tabs>
    </div>
  </div>
  <IncomeDetails
    :visible="isIncomeModalOpened"
    @close="closeIncomeModal"
    :income="selectedIncome"
  />
  <ExpenseDetails
    :visible="isExpenseModalOpened"
    @close="closeExpenseModal"
    :expense="selectedExpense"
  />
  <PenaltyDetails
    :visible="isPenaltyModalOpened"
    @close="closePenaltyModal"
    :penalty="selectedPenalty"
  />
</template>
