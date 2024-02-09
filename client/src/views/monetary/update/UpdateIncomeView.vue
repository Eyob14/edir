<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FwbButton, FwbInput, FwbTextarea, FwbSelect } from 'flowbite-vue'
import AlertError from '@/components/AlertError.vue'
import { trpc } from '@/trpc'
import type { IncomeInsert, Income } from '@mono/server/src/shared/entities'
import PageForm from '@/components/PageForm.vue'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import { Toast } from '@/utils/snackBarUtil'

const router = useRouter()
const route = useRoute()
const incomeId = Number(route.params.id)

const income = ref<Income>()
const buttonLoading = ref(false)
const errorMessage = ref('')

const selected = ref('')
const types = [
  { value: 'subscription', name: 'Subscription' },
  { value: 'deposit', name: 'Deposit' },
]

const incomeForm = ref({
  userEmail: '',
  amount: '',
  description: '',
})

watchEffect(async () => {
  income.value = await trpc.income.findDetails.query({ id: incomeId })
  incomeForm.value.userEmail = income.value?.user.email
  incomeForm.value.amount = income.value?.amount.toString()
  incomeForm.value.description = income.value?.description ?? ''
  selected.value = income.value?.type ?? ''
})

async function updateIncome() {
  try {
    if (selected.value !== 'subscription' && selected.value !== 'deposit') {
      throw Error('Please select a valid income type')
    }
    buttonLoading.value = true
    const updatedIncome = {
      id: incomeId,
      amount: parseInt(incomeForm.value.amount),
      type: selected.value as IncomeInsert['type'],
      description: incomeForm.value.description,
    }
    await trpc.income.update.mutate(updatedIncome)
    buttonLoading.value = false
    Toast.fire({
      icon: 'success',
      title: 'Income Updated Successfully',
    })
    router.back()
  } catch (error) {
    buttonLoading.value = false
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
    Toast.fire({
      icon: 'error',
      title: 'Could Not Update Income!',
      text: errorMessage.value,
    })
    router.back()
  }
}
</script>

<template>
  <PageForm
    heading="Update Existing Income"
    formLabel="Update Existing Income"
    @submit="updateIncome"
  >
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
            :disabled="true"
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
        <FwbButton type="submit" :loading="buttonLoading">Update</FwbButton>
      </div>
    </template>
  </PageForm>
</template>
