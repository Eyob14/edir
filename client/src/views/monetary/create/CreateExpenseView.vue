<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FwbButton, FwbInput, FwbTextarea, FwbSelect } from 'flowbite-vue'
import AlertError from '@/components/AlertError.vue'
import useErrorMessage from '@/composables/useErrorMessage'
import { trpc } from '@/trpc'
import type { ExpenseInsert } from '@mono/server/src/shared/entities'
import PageForm from '@/components/PageForm.vue'

const router = useRouter()
const buttonLoading = ref(false)

const selected = ref('')
const types = [
  { value: 'member payment', name: 'Member Payment' },
  { value: 'material cost', name: 'Material Cost' },
]

const expenseForm = ref({
  amount: '',
  userEmail: '',
  materialName: '',
  reason: '',
})

const [createNewExpense, errorMessage] = useErrorMessage(async () => {
  buttonLoading.value = true

  const newExpense: ExpenseInsert = {
    userEmail: selected.value === 'member payment' ? expenseForm.value.userEmail : null,
    materialName: selected.value === 'material cost' ? expenseForm.value.materialName : null,
    amount: parseInt(expenseForm.value.amount),
    type: selected.value as ExpenseInsert['type'],
    reason: expenseForm.value.reason,
  }

  await trpc.expense.create.mutate(newExpense)
  buttonLoading.value = false
  router.back()
})
</script>

<template>
  <PageForm heading="Add New Expense" formLabel="Create New Expense" @submit="createNewExpense">
    <template #default>
      <div class="space-y-6">
        <div class="mt-6 flex flex-col space-y-4">
          <fwb-select
            v-model="selected"
            :options="types"
            label="Select type of Expense"
            size="md"
            :required="true"
          />
          <FwbInput
            v-if="selected === 'member payment'"
            label="User Email"
            aria-label="User Email"
            placeholder="User Email"
            type="email"
            v-model="expenseForm.userEmail"
          />
          <FwbInput
            v-if="selected === 'material cost'"
            label="Material Name"
            aria-label="Material Name"
            placeholder="Material Name"
            type="text"
            v-model="expenseForm.materialName"
          />
          <FwbInput
            aria-label="Amount"
            v-model="expenseForm.amount"
            :type="'number'"
            label="Amount"
            placeholder="Amount"
            :required="true"
          />

          <fwb-textarea
            v-model="expenseForm.reason"
            :rows="4"
            :minlength="2"
            label="Income description"
            placeholder="Write your description..."
            :required="true"
          />
        </div>
      </div>

      <AlertError :message="errorMessage" />

      <div class="mt-6 grid grid-cols-2 items-center gap-3">
        <FwbButton
          color="dark"
          outline
          class="text-center text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          @click="router.back()"
          >Cancel</FwbButton
        >
        <FwbButton type="submit" :loading="buttonLoading">Create</FwbButton>
      </div>
    </template>
  </PageForm>
</template>
