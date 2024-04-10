<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { trpc } from '@/trpc'
import type { MaterialBare } from '@mono/server/src/shared/entities'
import { FwbButton, FwbAlert } from 'flowbite-vue'
import Material from '@/components/Material.vue'

const materials = ref<MaterialBare[]>([])

onBeforeMount(async () => {
  materials.value = await trpc.material.find.query()
})
</script>

<template>
  <div class="flex flex-col space-y-12">
    <div class="w-32 self-end">
      <fwb-button
        component="RouterLink"
        tag="router-link"
        :href="{ name: 'MaterialCreate' } as any"
        size="xs"
        class="h-12 w-full"
        id="material-create-button"
      >
        <template #prefix>
          <svg
            class="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
            />
          </svg>
        </template>
        New Material
      </fwb-button>
    </div>

    <div v-if="materials.length">
      <Material v-for="material in materials" :key="material.id" :material="material" />
    </div>
    <FwbAlert
      v-else
      class="flex h-40 items-center justify-center text-center"
      data-testid="projectListEmpty"
      >No Materials Yet!</FwbAlert
    >
  </div>
</template>
