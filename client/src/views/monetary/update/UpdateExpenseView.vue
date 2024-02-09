<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FwbButton, FwbInput, FwbTextarea, FwbSelect } from 'flowbite-vue'
import AlertError from '@/components/AlertError.vue'
import { trpc } from '@/trpc'
import type { Expense, ExpenseInsert } from '@mono/server/src/shared/entities'
import PageForm from '@/components/PageForm.vue'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import { Toast } from '@/utils/snackBarUtil'

const router = useRouter()
const route = useRoute()
const expenseId = Number(route.params.id)

const expense = ref<Expense>()
const buttonLoading = ref(false)
const errorMessage = ref('')

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

watchEffect(async () => {
  expense.value = await trpc.expense.findDetails.query({ id: expenseId })
  expenseForm.value.userEmail = expense.value?.user?.email
  expenseForm.value.amount = expense.value?.amount.toString()
  expenseForm.value.materialName = expense.value?.material?.name
  expenseForm.value.reason = expense.value?.reason ?? ''
  selected.value = expense.value?.type ?? ''
})

async function updateExpense() {
  try {
    if (selected.value !== 'member payment' && selected.value !== 'material cost') {
      throw Error('Please select a valid expense type')
    }
    buttonLoading.value = true
    const updatedExpense = {
      id: expenseId,
      userEmail: selected.value === 'member payment' ? expenseForm.value.userEmail : null,
      materialName: selected.value === 'material cost' ? expenseForm.value.materialName : null,
      amount: parseInt(expenseForm.value.amount),
      type: selected.value as ExpenseInsert['type'],
      reason: expenseForm.value.reason,
    }
    await trpc.expense.update.mutate(updatedExpense)
    buttonLoading.value = false
    Toast.fire({
      icon: 'success',
      title: 'Expense Updated Successfully',
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
    heading="Update Existing Expense"
    formLabel="Update Existing Expense"
    @submit="updateExpense"
  >
    <template #default>
      <div class="space-y-6">
        <div class="mt-6 flex flex-col space-y-4">
          <fwb-select
            v-model="selected"
            :options="types"
            label="Select type of Expense"
            size="md"
            :required="true"
            :disabled="true"
          />
          <FwbInput
            v-if="selected === 'member payment'"
            label="User Email"
            aria-label="User Email"
            placeholder="User Email"
            type="email"
            v-model="expenseForm.userEmail"
            :disabled="true"
          />
          <FwbInput
            v-if="selected === 'material cost'"
            label="Material Name"
            aria-label="Material Name"
            placeholder="Material Name"
            type="text"
            v-model="expenseForm.materialName"
            :disabled="true"
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
            label="Expense reason"
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
