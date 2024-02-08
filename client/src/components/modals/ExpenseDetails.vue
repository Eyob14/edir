<script setup lang="ts">
import { FwbHeading } from 'flowbite-vue'
import { dateConvertor } from '@/utils/dateConvertor'
import ModalComponent from '../Modal.vue'
const { visible, expense } = defineProps(['visible', 'expense'])
const emit = defineEmits(['close'])
const closeModal = () => {
  emit('close')
}
</script>
<template>
  <ModalComponent :visible="visible" @close="closeModal">
    <template #header>
      <FwbHeading tag="h4" class="text-center">Material Loan Details</FwbHeading>
    </template>
    <template #body>
      <div class="align-center flex flex-col justify-center space-y-3">
        <div class="flex justify-between">
          <p>User Name:</p>
          <p class="capitalize">{{ expense.user.firstName + ' ' + expense.user.lastName }}</p>
        </div>
        <div class="flex justify-between">
          <p>Expense Amount:</p>
          <p>{{ Number(expense.amount) }}</p>
        </div>
        <div class="flex justify-between">
          <p>Expense Type:</p>
          <p class="capitalize">{{ expense.type }}</p>
        </div>
        <div class="flex justify-between">
          <p>Expense Date:</p>
          <p>{{ dateConvertor(expense.createdAt) }}</p>
        </div>
        <div class="flex flex-col justify-between">
          <p>Reason:</p>
          <div class="m-2 h-28 w-full border p-4">
            <p class="text-base leading-relaxed text-gray-500">
              {{ expense.reason }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </ModalComponent>
</template>
