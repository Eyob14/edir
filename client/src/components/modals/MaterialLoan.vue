<script setup lang="ts">
import { FwbHeading } from 'flowbite-vue'
import ModalComponent from '../Modal.vue'
import { dateConvertor } from '@/utils/dateConvertor'
const { visible, materialLoan } = defineProps(['visible', 'materialLoan'])
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
          <p>Material Name:</p>
          <p class="capitalize">{{ materialLoan.material.name }}</p>
        </div>
        <div class="flex justify-between">
          <p>Requested Quantity:</p>
          <p>{{ materialLoan.countTaken }}</p>
        </div>
        <div class="flex justify-between">
          <p>Requested Date:</p>
          <p>{{ dateConvertor(materialLoan.requestedDate) }}</p>
        </div>
        <div class="flex justify-between">
          <p>Request status:</p>
          <span
            :class="{
              'text-green-500': materialLoan.isApproved,
              'text-red-500': !materialLoan.isApproved,
            }"
          >
            {{ materialLoan.isApproved ? 'Approved' : 'Not Approved' }}
          </span>
        </div>
        <div class="flex justify-between">
          <p>Return status:</p>
          <span
            :class="{
              'text-green-500': materialLoan.isReturned,
              'text-red-500': !materialLoan.isReturned,
            }"
          >
            {{ materialLoan.isReturned ? 'Returned' : 'Pending' }}
          </span>
        </div>
        <div class="flex flex-col justify-between">
          <p>Reason:</p>
          <div class="m-2 h-28 w-full border p-4">
            <p class="text-base leading-relaxed text-gray-500">
              {{ materialLoan.reason }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </ModalComponent>
</template>
