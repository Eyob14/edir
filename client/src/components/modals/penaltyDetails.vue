<script setup lang="ts">
import { FwbHeading } from 'flowbite-vue'
import ModalComponent from '../Modal.vue'
import { dateConvertor } from '../../utils/dateConvertor'
const { visible, penalty } = defineProps(['visible', 'penalty'])
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
          <p class="capitalize">{{ penalty.user.firstName + ' ' + penalty.user.lastName }}</p>
        </div>
        <div class="flex justify-between">
          <p>Penalty Amount:</p>
          <p>{{ penalty.amount }}</p>
        </div>
        <div class="flex justify-between">
          <p>Penalty Date:</p>
          <p>{{ dateConvertor(penalty.createdAt) }}</p>
        </div>
        <div class="flex flex-col justify-between">
          <p>Reason:</p>
          <div class="m-2 h-28 w-full border p-4">
            <p class="text-base leading-relaxed text-gray-500">
              {{ penalty.reason }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </ModalComponent>
</template>
