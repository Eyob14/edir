<script setup lang="ts">
import ModalComponent from '../Modal.vue'
const { visible, relative } = defineProps(['visible', 'relative'])
const emit = defineEmits(['close'])
const closeModal = () => {
  emit('close')
}
import { FwbHeading } from 'flowbite-vue'
import { dateConvertor } from '@/utils/dateConvertor'
</script>
<template>
  <ModalComponent :visible="visible" @close="closeModal">
    <template #header>
      <FwbHeading tag="h4" class="text-center">Relative Details</FwbHeading>
    </template>
    <template #body>
      <div class="flex justify-between">
        <div class="w-1/2">
          <div class="w-3/5">
            <img v-if="relative.relativePhoto" :src="relative.relativePhoto" alt="Profile Image" />
          </div>
        </div>
        <div class="flex w-1/2 flex-col space-y-4">
          <p>Name: {{ relative.firstName }} {{ relative.lastName }}</p>
          <p>Email: {{ relative.email }}</p>
          <p>Age: {{ relative.age }}</p>
          <p>Verification: {{ relative.isVerified ? 'Verified' : 'Unverified' }}</p>
          <p>Created At: {{ dateConvertor(relative.createdAt) }}</p>
        </div>
      </div>
    </template>
  </ModalComponent>
</template>
