<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FwbButton, FwbInput, FwbTextarea, FwbSelect } from 'flowbite-vue'
import AlertError from '@/components/AlertError.vue'
import useErrorMessage from '@/composables/useErrorMessage'
import { trpc } from '@/trpc'
import type { IncomeInsert } from '@mono/server/src/shared/entities'
import PageForm from '@/components/PageForm.vue'

const router = useRouter()
const buttonLoading = ref(false)

const selected = ref('')
const types = [
  { value: 'subscription', name: 'Subscription' },
  { value: 'deposit', name: 'Deposit' },
]

const incomeForm = ref({
  amount: '',
  userEmail: '',
  description: '',
})

const [createNewIncome, errorMessage] = useErrorMessage(async () => {
  if (selected.value !== 'subscription' && selected.value !== 'deposit') {
    throw Error('Please select a valid income type')
  }
  buttonLoading.value = true

  const newIncome: IncomeInsert = {
    userEmail: incomeForm.value.userEmail,
    amount: parseInt(incomeForm.value.amount),
    type: selected.value as IncomeInsert['type'],
    description: incomeForm.value.description,
  }

  await trpc.income.create.mutate(newIncome)
  buttonLoading.value = false
  router.back()
})
</script>

<template>
  <PageForm heading="Add New Income" formLabel="Create New Income" @submit="createNewIncome">
    <template #default>
      <div class="space-y-6">
        <div class="mt-6 flex flex-col space-y-4">
          <FwbInput
            label="User Email"
            aria-label="User Email"
            placeholder="User Email"
            type="email"
            v-model="incomeForm.userEmail"
            :required="true"
          />
          <FwbInput
            aria-label="Amount"
            v-model="incomeForm.amount"
            :type="'number'"
            label="Amount"
            placeholder="Amount"
            :required="true"
          />
          <fwb-select
            v-model="selected"
            :options="types"
            label="Select type of Income"
            size="md"
            :required="true"
          />
          <fwb-textarea
            v-model="incomeForm.description"
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
