<script lang="ts" setup>
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import type { MaterialBare } from '@mono/server/src/shared/entities'
import { FwbButton } from 'flowbite-vue'
import Card from './Card.vue'

defineProps<{
  material: MaterialBare
}>()
</script>

<template>
  <Card class="flex flex-row items-center justify-between" data-testid="project">
    <div class="flex space-x-4">
      <img
        :src="material.image ? material.image : '../assets/landing-4.jpg'"
        alt="material image"
        class="h-40 w-40"
      />
      <div class="flex flex-col items-start justify-center space-y-2">
        <h5 class="text-2xl font-bold capitalize tracking-tight text-gray-900 dark:text-white">
          {{ material.name }}
        </h5>
        <p class="text-sm text-gray-500 dark:text-gray-400">{{ material.remainingCount }} in total</p>
        <p class="truncate text-sm text-gray-500 dark:text-gray-400">
          {{ material.description }}
        </p>
      </div>
    </div>

    <!-- prettier-ignore -->
    <FwbButton
      component="RouterLink"
      tag="router-link"
      data-testid="viewProjectBugs"
      :href="({name: 'MaterialDetails', params: {id: material.id}}) as any"
      class="pr-3"
    >
      View Detail
      <ArrowRightIcon aria-hidden="true" class="inline h-4 w-4" />
    </FwbButton>
  </Card>
</template>
