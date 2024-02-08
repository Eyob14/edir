<script setup lang="ts">
import Chart, { type ChartConfiguration, type ChartItem } from 'chart.js/auto'
import { onBeforeMount, onMounted, ref, type Ref } from 'vue'
import type { Income, Expense, Penalty } from '@mono/server/src/shared/entities'
const { incomes, expenses, penalties } = defineProps(['incomes', 'expenses', 'penalties'])

const labels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const incomeByMonth = ref<{ [key: string]: number }>({})
const expenseByMonth = ref<{ [key: string]: number }>({})
const penaltyByMonth = ref<{ [key: string]: number }>({})

// Sum up income amounts by month
incomes?.forEach((income: Income) => {
  const monthIndex = new Date(income.createdAt).getMonth()
  const monthLabel = labels[monthIndex]

  if (!incomeByMonth.value[monthLabel]) {
    incomeByMonth.value[monthLabel] = 0
  }

  incomeByMonth.value[monthLabel] += Number(income.amount)
})

// Sum up expense amounts by month
expenses?.forEach((expense: Expense) => {
  const monthIndex = new Date(expense.createdAt).getMonth()
  const monthLabel = labels[monthIndex]

  if (!expenseByMonth.value[monthLabel]) {
    expenseByMonth.value[monthLabel] = 0
  }

  expenseByMonth.value[monthLabel] += Number(expense.amount)
})

// Sum up penalties amounts by month
penalties?.forEach((penalty: Penalty) => {
  const monthIndex = new Date(penalty.createdAt).getMonth()
  const monthLabel = labels[monthIndex]

  if (!penaltyByMonth.value[monthLabel]) {
    penaltyByMonth.value[monthLabel] = 0
  }

  penaltyByMonth.value[monthLabel] += Number(penalty.amount)
})

const incomeData = labels.map((label) => incomeByMonth.value[label] || 0)
const expenseData = labels.map((label) => expenseByMonth.value[label] || 0)
const penaltyData = labels.map((label) => penaltyByMonth.value[label] || 0)

const data = {
  labels: labels,
  datasets: [
    {
      label: 'Income',
      backgroundColor: 'rgb(0, 255, 0)',
      borderColor: 'rgb(0, 255, 0)',
      data: incomeData,
    },
    {
      label: 'Expense',
      backgroundColor: 'rgb(255, 99, 132)',
      borderColor: 'rgb(255, 99, 132)',
      data: expenseData,
    },
    {
      label: 'Penalty',
      backgroundColor: 'rgb(0, 0, 200)',
      borderColor: 'rgb(0, 0, 200)',
      data: penaltyData,
    },
  ],
}
const config: ChartConfiguration = {
  type: 'line',
  data: data,
  options: {},
}

onMounted(() => {
  const myChartContext = document.getElementById('myChart') as ChartItem
  new Chart(myChartContext, config)
})
</script>

<template>
  <div>
    <canvas id="myChart" class="w-full"></canvas>
  </div>
</template>
