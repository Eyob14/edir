<script setup lang="ts">
import { FwbToast } from 'flowbite-vue'

const { visible, message, type } = defineProps(['visible', 'message', 'type'])
// const toastClass = type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
</script>

<template>
  <div class="flex justify-end" v-if="visible">
    <fwb-toast closable class="align-center text-white" :style="{ backgroundColor: type === 'success' ? 'green' : 'red' }">
      {{ message }}
    </fwb-toast>
  </div>
</template>

