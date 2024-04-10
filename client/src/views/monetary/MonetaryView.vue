<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { Income, Expense, Penalty } from '@mono/server/src/shared/entities'
import { FwbTab, FwbTabs } from 'flowbite-vue'
import { trpc } from '@/trpc'
import MonetaryComponent from '@/components/MonetaryComponent.vue'
import IncomeTableComponent from '@/components/tables/IncomeTableComponent.vue'
import ExpenseTableComponent from '@/components/tables/ExpenseTableComponent.vue'
import PenaltyTableComponent from '@/components/tables/penaltyTableComponent.vue'

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

// Calculate total income
const calculateTotalIncome = () => {
  totalIncome.value = 0
  totalDeposit.value = 0
  totalSubscription.value = 0

  incomes.value.forEach((income) => {
    totalIncome.value += Number(income.amount)
    if (income.type === 'deposit') {
      totalDeposit.value += Number(income.amount)
    } else {
      totalSubscription.value += Number(income.amount)
    }
  })
}

// Calculate total expense
const calculateTotalExpense = () => {
  totalExpense.value = 0
  totalMaterialExpense.value = 0
  totalMemberPayment.value = 0
  expenses.value.forEach((expense) => {
    totalExpense.value += Number(expense.amount)
    if (expense.type === 'material cost') {
      totalMaterialExpense.value += Number(expense.amount)
    } else {
      totalMemberPayment.value += Number(expense.amount)
    }
  })
}

// Calculate total penalty
const calculateTotalPenalty = () => {
  totalPenalty.value = 0
  penalties.value.forEach((penalty) => {
    totalPenalty.value += Number(penalty.amount)
  })
}

const updateIncomesData = (updatedIncomes: Income[]) => {
  incomes.value = updatedIncomes
}
const updateExpensesData = (updatedExpenses: Expense[]) => {
  expenses.value = updatedExpenses
}
const updatePenaltiesData = (updatedPenalties: Penalty[]) => {
  penalties.value = updatedPenalties
}

watchEffect(async () => {
  const [incomeResult, expenseResult, penaltyResult] = await Promise.all([
    trpc.income.find.query(),
    trpc.expense.find.query(),
    trpc.penalty.find.query(),
  ])

  updateIncomesData(incomeResult)
  updateExpensesData(expenseResult)
  updatePenaltiesData(penaltyResult)

  calculateTotalIncome()
  calculateTotalExpense()
  calculateTotalPenalty()
})
</script>

<template>
  <div class="flex flex-col space-y-10">
    <!-- Overall Data -->
    <div class="flex w-full flex-col space-y-5 rounded-md border border-[#455a64] p-10">
      <h1 class="text-3xl font-bold text-[#383e49d4]" data-testid="overall-monetary">Overall Monetary</h1>
      <div class="flex w-full justify-between space-x-10">
        <!-- Overall Income -->
        <div class="flex w-1/3 flex-col space-y-4 border-l-2 border-[#E19133] p-4">
          <h2 class="text-xl font-semibold text-[#E19133]">Income</h2>
          <div class="flex justify-between">
            <MonetaryComponent header="Total Income" :value="totalIncome" />
            <MonetaryComponent header="Total Deposit" :value="totalDeposit" />
            <MonetaryComponent header="Total Subscription" :value="totalSubscription" />
          </div>
        </div>
        <!-- Overall Expense -->
        <div class="flex w-1/3 flex-col space-y-4 border-l-2 border-[#267D9E] p-4">
          <h2 class="text-xl font-semibold text-[#267D9E]">Expense</h2>
          <div class="flex justify-between">
            <MonetaryComponent header="Total Expense" :value="totalExpense" />
            <MonetaryComponent header="Material Expense" :value="totalMaterialExpense" />
            <MonetaryComponent header="Member Payment" :value="totalMemberPayment" />
          </div>
        </div>
        <!-- Overall Penalty -->
        <div class="flex w-1/3 flex-col space-y-4 border-l-2 border-[#F36960] p-4">
          <h2 class="text-xl font-semibold text-[#F36960]">Penalty</h2>
          <div class="flex justify-between">
            <MonetaryComponent header="Total Penalty" :value="totalPenalty" />
          </div>
        </div>
      </div>
    </div>

    <!-- Table data -->
    <div>
      <fwb-tabs v-model="activeTab" variant="underline" class="p-5">
        <fwb-tab name="first" title="Income">
          <IncomeTableComponent
            :incomes="incomes"
            :visible="true"
            @recalculate="calculateTotalIncome"
            @update="updateIncomesData"
          />
        </fwb-tab>
        <fwb-tab name="second" title="Expense">
          <ExpenseTableComponent
            :expenses="expenses"
            :visible="true"
            @recalculate="calculateTotalExpense"
            @update="updateExpensesData"
          />
        </fwb-tab>
        <fwb-tab name="third" title="Penalty">
          <PenaltyTableComponent
            :penalties="penalties"
            :visible="true"
            @recalculate="calculateTotalPenalty"
            @update="updatePenaltiesData"
          />
        </fwb-tab>
      </fwb-tabs>
    </div>
  </div>
</template>
