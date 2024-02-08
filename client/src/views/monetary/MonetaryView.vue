<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { FwbTab, FwbTabs } from 'flowbite-vue'
import type { Income, Expense, Penalty } from '@mono/server/src/shared/entities'
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
  FwbButton,
} from 'flowbite-vue'
import { trpc } from '@/trpc'
import IncomeDetails from '@/components/modals/IncomeDetails.vue'
import ExpenseDetails from '@/components/modals/ExpenseDetails.vue'
import PenaltyDetails from '@/components/modals/penaltyDetails.vue'
import { dateConvertor } from '../../utils/dateConvertor'

const activeTab = ref('first')

const incomes = ref<Income[]>([])
const expenses = ref<Expense[]>([])
const penalties = ref<Penalty[]>([])

// calculate total income
const totalIncome = ref(0)
const totalDeposit = ref(0)
const totalSubscription = ref(0)

// calculate total expense
const totalExpense = ref(0)
const totalMaterialExpense = ref(0)
const totalMemberPayment = ref(0)

// calculate total penalty
const totalPenalty = ref(0)

onBeforeMount(async () => {
  const [incomeResult, expenseResult, penaltyResult] = await Promise.all([
    trpc.income.find.query(),
    trpc.expense.find.query(),
    trpc.penalty.find.query(),
  ])

  incomes.value = incomeResult
  expenses.value = expenseResult
  penalties.value = penaltyResult

  totalIncome.value = 0
  totalDeposit.value = 0
  totalSubscription.value = 0

  incomes.value.forEach((income) => {
    totalIncome.value += income.amount
    if (income.type === 'deposit') {
      totalDeposit.value += income.amount
    } else {
      totalSubscription.value += income.amount
    }
  })

  totalExpense.value = 0
  totalMaterialExpense.value = 0
  totalMemberPayment.value = 0

  expenses.value.forEach((expense) => {
    totalExpense.value += expense.amount
    if (expense.type === 'material cost') {
      totalMaterialExpense.value += expense.amount
    } else {
      totalMemberPayment.value += expense.amount
    }
  })
  totalPenalty.value = 0
  penalties.value.forEach((penalty) => {
    totalPenalty.value += penalty.amount
  })
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
  <div class="flex flex-col space-y-10">
    <!-- Overall Data -->
    <div class="flex w-full flex-col space-y-5 rounded-md border border-[#455a64] p-10">
      <h1 class="text-3xl font-bold text-[#383e49d4]">Overall Monetary</h1>
      <div class="flex w-full justify-between space-x-10">
        <!-- Overall Income -->
        <div class="flex w-1/3 flex-col space-y-4 border-l-2 border-[#E19133] p-4">
          <h2 class="text-xl font-semibold text-[#E19133]">Income</h2>
          <div class="flex justify-between">
            <div class="flex flex-col space-y-4">
              <h3 class="text-l font-semibold">{{ Number(totalIncome) }}</h3>
              <p class="text-sm">Total Income</p>
            </div>
            <div class="flex flex-col space-y-4">
              <h3 class="text-l font-semibold">{{ Number(totalDeposit) }}</h3>
              <p class="text-sm">Total Deposit</p>
            </div>
            <div class="flex flex-col space-y-4">
              <h3 class="text-l font-semibold">{{ Number(totalSubscription) }}</h3>
              <p class="text-sm">Total Subscription</p>
            </div>
          </div>
        </div>
        <!-- Overall Expense -->
        <div class="flex w-1/3 flex-col space-y-4 border-l-2 border-[#267D9E] p-4">
          <h2 class="text-xl font-semibold text-[#267D9E]">Expense</h2>
          <div class="flex justify-between">
            <div class="flex flex-col space-y-4">
              <h3 class="text-l font-semibold">{{ Number(totalExpense) }}</h3>
              <p class="text-sm">Total Expense</p>
            </div>
            <div class="flex flex-col space-y-4">
              <h3 class="text-l font-semibold">{{ Number(totalMaterialExpense) }}</h3>
              <p class="text-sm">Material Expense</p>
            </div>
            <div class="flex flex-col space-y-4">
              <h3 class="text-l font-semibold">{{ Number(totalMemberPayment) }}</h3>
              <p class="text-sm">Member Payment</p>
            </div>
          </div>
        </div>
        <!-- Overall Penalty -->
        <div class="flex w-1/3 flex-col space-y-4 border-l-2 border-[#F36960] p-4">
          <h2 class="text-xl font-semibold text-[#F36960]">Penalty</h2>
          <div class="flex justify-between">
            <div class="flex flex-col space-y-4">
              <h3 class="text-l font-semibold">{{ Number(totalPenalty) }}</h3>
              <p class="text-sm">Total Penalty</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Table data -->
    <div>
      <fwb-tabs v-model="activeTab" variant="underline" class="p-5">
        <fwb-tab name="first" title="Income">
          <div class="flex flex-col space-y-10">
            <fwb-button
              component="RouterLink"
              tag="router-link"
              :href="{ name: 'CreateIncome' } as any"
              size="xs"
              class="flex h-10 w-32 items-center justify-center self-end"
            >
              New Income
            </fwb-button>
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
                  <fwb-table-cell class="capitalize">{{ income.type }}</fwb-table-cell>
                  <fwb-table-cell>{{ income.amount }}</fwb-table-cell>
                  <fwb-table-cell class="capitalize">{{
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
          </div>
        </fwb-tab>
        <fwb-tab name="second" title="Expense">
          <div class="flex flex-col space-y-10">
            <fwb-button
              component="RouterLink"
              tag="router-link"
              :href="{ name: 'CreateExpense' } as any"
              size="xs"
              class="flex h-10 w-32 items-center justify-center self-end"
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
          </div>
        </fwb-tab>
        <fwb-tab name="third" title="Penalty">
          <div class="flex flex-col space-y-10">
            <fwb-button
              component="RouterLink"
              tag="router-link"
              :href="{ name: 'CreatePenalty' } as any"
              size="xs"
              class="flex h-10 w-32 items-center justify-center self-end"
            >
              New Penalty
            </fwb-button>
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
          </div>
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
