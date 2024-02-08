<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FwbButton, FwbInput, FwbTextarea, FwbSelect } from 'flowbite-vue'
import AlertError from '@/components/AlertError.vue'
import useErrorMessage from '@/composables/useErrorMessage'
import { trpc } from '@/trpc'
import type { PenaltyInsert } from '@mono/server/src/shared/entities'
import PageForm from '@/components/PageForm.vue'

const router = useRouter()
const buttonLoading = ref(false)

const penaltyForm = ref({
  amount: '',
  userEmail: '',
  reason: '',
  paymentDate: '',
})

const [createNewPenalty, errorMessage] = useErrorMessage(async () => {
  buttonLoading.value = true

  const newPenalty: PenaltyInsert = {
    userEmail: penaltyForm.value.userEmail,
    amount: parseInt(penaltyForm.value.amount),
    paymentDate: new Date(penaltyForm.value.paymentDate),
    reason: penaltyForm.value.reason,
  }

  await trpc.penalty.create.mutate(newPenalty)
  buttonLoading.value = false
  router.back()
})
</script>

<template>
  <PageForm heading="Add New Penalty" formLabel="Create New Penalty" @submit="createNewPenalty">
    <template #default>
      <div class="space-y-6">
        <div class="mt-6 flex flex-col space-y-4">
          <FwbInput
            label="User Email"
            aria-label="User Email"
            placeholder="User Email"
            type="email"
            v-model="penaltyForm.userEmail"
            :required="true"
          />
          <FwbInput
            aria-label="Amount"
            v-model="penaltyForm.amount"
            :type="'number'"
            label="Amount"
            placeholder="Amount"
            :required="true"
          />
          <FwbInput
            aria-label="Payment Date"
            v-model="penaltyForm.paymentDate"
            :type="'date'"
            label="Payment Date"
            required
          />
          <fwb-textarea
            v-model="penaltyForm.reason"
            :rows="4"
            :minlength="2"
            label="Penalty reason"
            placeholder="Write your reason..."
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
