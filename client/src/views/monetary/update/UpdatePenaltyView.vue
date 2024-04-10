<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FwbButton, FwbInput, FwbTextarea } from 'flowbite-vue'
import AlertError from '@/components/AlertError.vue'
import { trpc } from '@/trpc'
import type {  Penalty } from '@mono/server/src/shared/entities'
import PageForm from '@/components/PageForm.vue'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import { Toast } from '@/utils/snackBarUtil'

const router = useRouter()
const route = useRoute()
const penaltyId = Number(route.params.id)

const penalty = ref<Penalty>()
const buttonLoading = ref(false)
const errorMessage = ref('')

const penaltyForm = ref({
  amount: '',
  userEmail: '',
  reason: '',
  paymentDate: '',
})

watchEffect(async () => {
  penalty.value = await trpc.penalty.findDetails.query({ id: penaltyId })
  penaltyForm.value.userEmail = penalty.value?.user.email
  penaltyForm.value.amount = penalty.value?.amount.toString()
  penaltyForm.value.reason = penalty.value?.reason ?? ''
  penaltyForm.value.paymentDate =
    new Date(penalty.value?.paymentDate!).toISOString().split('T')[0] ?? ''
})

async function updatePenalty() {
  try {
    buttonLoading.value = true
    const updatedPenalty = {
      id: penaltyId,
      userEmail: penaltyForm.value.userEmail,
      amount: parseInt(penaltyForm.value.amount),
      paymentDate: new Date(penaltyForm.value.paymentDate),
      reason: penaltyForm.value.reason,
    }
    await trpc.penalty.update.mutate(updatedPenalty)

    buttonLoading.value = false
    Toast.fire({
      icon: 'success',
      title: 'Penalty Updated Successfully',
    })
    router.back()
  } catch (error) {
    buttonLoading.value = false
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
    Toast.fire({
      icon: 'error',
      title: 'Could Not Update Penalty!',
      text: errorMessage.value,
    })
    router.back()
  }
}
</script>

<template>
  <PageForm
    heading="Update Existing Penalty"
    formLabel="Update Existing Penalty"
    @submit="updatePenalty"
  >
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
            :disabled="true"
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
        <FwbButton type="submit" :loading="buttonLoading">Update</FwbButton>
      </div>
    </template>
  </PageForm>
</template>
