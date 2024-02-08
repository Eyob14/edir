<script setup lang="ts">
import { FwbHeading } from 'flowbite-vue'
import ModalComponent from '../Modal.vue'
const { visible, income } = defineProps(['visible', 'income'])
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
        <div class="flex justify-between" v-if="income.user?.firstName">
          <p>User Name:</p>
          <p class="capitalize">{{ income.user?.firstName + ' ' + income.user?.lastName }}</p>
        </div>
        <div class="flex justify-between">
          <p>Income Amount:</p>
          <p>{{ income.amount }}</p>
        </div>
        <div class="flex justify-between">
          <p>Income Type:</p>
          <p>{{ income.type }}</p>
        </div>
        <div class="flex flex-col justify-between">
          <p>Description:</p>
          <div class="m-2 h-28 w-full border p-4">
            <p class="text-base leading-relaxed text-gray-500">
              {{ income.description }}
            </p>
          </div>
        </div>
      </div>
    </template>
  </ModalComponent>
</template>
