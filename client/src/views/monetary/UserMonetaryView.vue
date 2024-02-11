<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { trpc } from '@/trpc'
import type { Income, Penalty } from '@mono/server/src/shared/entities'
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
} from 'flowbite-vue'
import IncomeDetails from '@/components/modals/IncomeDetails.vue'
import PenaltyTableComponent from '@/components/tables/penaltyTableComponent.vue'
import { authUserId } from '../../stores/user'
import { dateConvertor } from '@/utils/dateConvertor'

const activeTab = ref('first')

const incomes = ref<Income[]>([])
const penalties = ref<Penalty[]>([])
const userId = authUserId.value

const selectedIncome = ref<Income>()

onBeforeMount(async () => {
  if (userId) {
    const [incomeResult, penaltyResult] = await Promise.all([
      trpc.income.findByUserId.query({ id: userId }),
      trpc.penalty.findByUserId.query({ id: userId }),
    ])

    incomes.value = incomeResult
    penalties.value = penaltyResult
  }
})

// calculate total income
const totalExpense = ref(0)
const totalDeposit = ref(0)
const totalSubscription = ref(0)

incomes.value.forEach((income) => {
  totalExpense.value += income.amount
  if (income.type === 'deposit') {
    totalDeposit.value += income.amount
  } else {
    totalSubscription.value += income.amount
  }
})

// calculate total penalty
const totalPenalty = ref(0)
penalties.value.forEach((penalty) => {
  totalPenalty.value += penalty.amount
})

const isIncomeModalOpened = ref(false)

const openIncomeModal = (income: Income) => {
  selectedIncome.value = income
  isIncomeModalOpened.value = true
}

const closeIncomeModal = () => {
  isIncomeModalOpened.value = false
}
</script>

<template>
  <div class="flex flex-col space-y-10">
    <!-- Overall Data -->
    <div class="flex w-full flex-col space-y-5 rounded-md border border-[#455a64] p-10">
      <h1 class="text-3xl font-bold text-[#383e49d4]">Overall Monetary</h1>
      <div class="flex w-full justify-between space-x-10">
        <!-- Overall Expense -->
        <div class="flex w-1/3 flex-col space-y-4 border-l-2 border-[#267D9E] p-4">
          <h2 class="text-xl font-semibold text-[#267D9E]">Expense</h2>
          <div class="flex justify-between">
            <div class="flex flex-col space-y-4">
              <h3 class="text-l font-semibold">{{ totalExpense }}</h3>
              <p class="text-sm">Total Expense</p>
            </div>
            <div class="flex flex-col space-y-4">
              <h3 class="text-l font-semibold">{{ totalDeposit }}</h3>
              <p class="text-sm">Total Deposit</p>
            </div>
            <div class="flex flex-col space-y-4">
              <h3 class="text-l font-semibold">{{ totalSubscription }}</h3>
              <p class="text-sm">Total Subscription</p>
            </div>
          </div>
        </div>
        <!-- Overall Penalty -->
        <div class="flex w-1/3 flex-col space-y-4 border-l-2 border-[#F36960] p-4">
          <h2 class="text-xl font-semibold text-[#F36960]">Penalty</h2>
          <div class="flex justify-between">
            <div class="flex flex-col space-y-4">
              <h3 class="text-l font-semibold">{{ totalPenalty }}</h3>
              <p class="text-sm">Total Penalty</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Table data -->
    <div>
      <fwb-tabs v-model="activeTab" variant="underline" class="p-5">
        <fwb-tab name="first" title="Expense">
          <fwb-table>
            <fwb-table-head>
              <fwb-table-head-cell>Expense Date</fwb-table-head-cell>
              <fwb-table-head-cell>Expense Type</fwb-table-head-cell>
              <fwb-table-head-cell>Amount</fwb-table-head-cell>
              <fwb-table-head-cell>Details</fwb-table-head-cell>
            </fwb-table-head>
            <fwb-table-body v-if="incomes.length">
              <fwb-table-row v-for="income in incomes" :key="income.id">
                <fwb-table-cell>{{ dateConvertor(income.createdAt) }}</fwb-table-cell>
                <fwb-table-cell>{{ income.type }}</fwb-table-cell>
                <fwb-table-cell>{{ income.amount }}</fwb-table-cell>
                <fwb-table-cell>
                  <FwbButton @click="openIncomeModal(income)" class="pr-3"> View </FwbButton>
                </fwb-table-cell>
              </fwb-table-row>
            </fwb-table-body>
            <fwb-table-body v-else>
              <fwb-table-row>
                <fwb-table-cell colspan="6">
                  <div class="flex h-40 w-full items-center justify-center border">
                    No Expense yet!
                  </div>
                </fwb-table-cell>
              </fwb-table-row>
            </fwb-table-body>
          </fwb-table>
        </fwb-tab>
        <fwb-tab name="second" title="Penalty">
          <PenaltyTableComponent :penalties="penalties" :visible="false" />
        </fwb-tab>
      </fwb-tabs>
    </div>
  </div>
  <IncomeDetails
    :visible="isIncomeModalOpened"
    :income="selectedIncome"
    @close="closeIncomeModal"
  />
</template>
