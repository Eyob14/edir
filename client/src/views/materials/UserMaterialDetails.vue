<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onBeforeMount, ref } from 'vue'
import { trpc } from '@/trpc'
import type { Material, MaterialLoan } from '@mono/server/src/shared/entities'

type MaterialDetails = {
  materialDetails: Material | null
  materialLoans: MaterialLoan[]
}

const route = useRoute()
const materialId = Number(route.params.id)

const materialDetailsResult = ref<MaterialDetails>()

onBeforeMount(async () => {
  //   materials.value = await trpc.material.find.query()
  materialDetailsResult.value = await trpc.material.details.query({ id: materialId })
})
</script>

<template>
  <div class="flex flex-col justify-between space-y-8">
    <div v-if="materialDetailsResult?.materialDetails" class="flex space-x-8">
      <div class="flex w-1/2 flex-col">
        <h1 class="p-5 text-4xl font-bold capitalize">
          {{ materialDetailsResult?.materialDetails.name }}
        </h1>
        <img
          :src="
            materialDetailsResult?.materialDetails.image
              ? materialDetailsResult?.materialDetails.image
              : '../../assets/tent.png'
          "
          alt="material image"
          class=""
        />
      </div>
      <div class="my-2 flex w-1/2 flex-col space-y-2">
        <div class="flex justify-end">
          <p
            class="rounded-md border p-4 text-white"
            :style="{
              backgroundColor:
                materialDetailsResult?.materialDetails.remainingCount > 0 ? 'green' : 'red',
            }"
          >
            {{
              materialDetailsResult?.materialDetails.remainingCount > 0
                ? 'Available'
                : 'Not Available'
            }}
          </p>
        </div>
        <div class="flex h-full flex-col space-y-3 p-4">
          <div class="flex justify-between">
            <p>Initial count:</p>
            <p>{{ materialDetailsResult?.materialDetails.initialCount }}</p>
          </div>
          <div class="flex justify-between">
            <p>Remaining count:</p>
            <p>{{ materialDetailsResult?.materialDetails.remainingCount }}</p>
          </div>
          <div class="flex justify-between">
            <p>Total Loaned count:</p>
            <p>{{ materialDetailsResult?.materialLoans.length }}</p>
          </div>
          <div class="flex justify-between">
            <p>Pending Loaned count:</p>
            <p>{{ materialDetailsResult?.materialLoans.length }}</p>
          </div>
          <div class="flex justify-between">
            <p>Returned Loaned count:</p>
            <p>{{ materialDetailsResult?.materialLoans.length }}</p>
          </div>
          <div class="flex justify-between">
            <p>Total Damaged count:</p>
            <p>{{ materialDetailsResult?.materialLoans.length }}</p>
          </div>
          <div class="mt-4 flex grow rounded-md border border-[#243c5a] p-4">
            <p>{{ materialDetailsResult?.materialDetails.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
