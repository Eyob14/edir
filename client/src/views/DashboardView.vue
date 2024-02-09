<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import ChartComponent from '@/components/chartComponent.vue'
import { trpc } from '@/trpc'
import type { Income, Expense, Penalty, MaterialBare } from '@mono/server/src/shared/entities'
import { FwbTab, FwbTabs, FwbHeading } from 'flowbite-vue'
import IncomeTableComponent from '@/components/tables/IncomeTableComponent.vue'
import ExpenseTableComponent from '@/components/tables/ExpenseTableComponent.vue'
import PenaltyTableComponent from '@/components/tables/penaltyTableComponent.vue'

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

  totalIncome.value = incomeResult.reduce((acc, income) => acc + Number(income.amount), 0)
  totalExpense.value = expenseResult.reduce((acc, expense) => acc + Number(expense.amount), 0)
  totalMaterial.value = materialResult.length
  totalRevenue.value = totalIncome.value - totalExpense.value
})
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
          <IncomeTableComponent :incomes="incomes" :visible="false" />
        </fwb-tab>
        <fwb-tab name="second" title="Expense">
          <ExpenseTableComponent :expenses="expenses" :visible="false" />
        </fwb-tab>
        <fwb-tab name="third" title="Penalty">
          <PenaltyTableComponent :penalties="penalties" :visible="false" />
        </fwb-tab>
      </fwb-tabs>
    </div>
  </div>
</template>
