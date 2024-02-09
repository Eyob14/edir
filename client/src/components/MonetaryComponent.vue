<script setup lang="ts">
const { header, value } = defineProps(['header', 'value'])
</script>

<template>
  <div class="flex flex-col space-y-4">
    <h3 class="text-l font-semibold">{{ Number(value) }}</h3>
    <p class="text-sm">{{ header }}</p>
  </div>
</template>
