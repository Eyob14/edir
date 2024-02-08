<script lang="ts" setup>
import { FwbModal } from 'flowbite-vue'
const { visible } = defineProps(['visible'])
const emit = defineEmits(['close'])
const closeModal = () => {
  emit('close')
}
</script>

<template>
  <fwb-modal v-if="visible" @close="closeModal">
    <template #header>
      <slot name="header" />
    </template>
    <template #body>
      <slot name="body" />
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </fwb-modal>
</template>
