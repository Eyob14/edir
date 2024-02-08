<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FwbButton, FwbHeading, FwbInput, FwbTextarea } from 'flowbite-vue'
import AlertError from '@/components/AlertError.vue'
import useErrorMessage from '@/composables/useErrorMessage'
import { trpc } from '@/trpc'
import { uploadImageToCloudinary } from '@/utils/fileUploader'

const router = useRouter()

const materialForm = ref({
  name: '',
  count: '',
  description: '',
  boughtAt: '',
  materialPhoto: null as File | null,
})

const [createMaterial, errorMessage] = useErrorMessage(async () => {
  if (materialForm.value.materialPhoto === null) {
    return
  }
  const uploadedImage = await uploadImageToCloudinary(materialForm.value.materialPhoto)

  const newMaterial = {
    name: materialForm.value.name,
    description: materialForm.value.description,
    image: uploadedImage,
    initialCount: parseInt(materialForm.value.count),
    boughtAt: new Date(materialForm.value.boughtAt),
  }
  await trpc.material.create.mutate(newMaterial)

  router.push({ name: 'Material' })
})

const imageUrl = ref<string | undefined>(undefined)

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    materialForm.value.materialPhoto = file
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        imageUrl.value = event.target.result
      }
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <div class="flex items-center justify-between">
    <form aria-label="Project" @submit.prevent="createMaterial">
      <div class="space-y-6">
        <FwbHeading tag="h4">Create a new material</FwbHeading>
        <div class="flex justify-center">
          <label
            for="profileImage"
            class="relative block h-40 w-40 cursor-pointer overflow-hidden rounded-full border-4 border-gray-200"
          >
            <img
              v-if="materialForm.materialPhoto"
              :src="imageUrl"
              alt="Profile Image"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <input
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFileSelect"
            />
          </label>
        </div>
        <div class="mt-6 flex flex-col space-y-4">
          <FwbInput
            aria-label="Material name"
            v-model="materialForm.name"
            label="Material Name"
            placeholder="Material Name"
            required
          />
          <FwbInput
            aria-label="Material count"
            v-model="materialForm.count"
            :type="'number'"
            label="Material Count"
            placeholder="Material count"
            required
          />
          <FwbInput
            aria-label="Bought Date"
            v-model="materialForm.boughtAt"
            :type="'date'"
            label="Bought Date"
            required
          />
          <fwb-textarea
            v-model="materialForm.description"
            :rows="4"
            :minlength="2"
            label="Material description"
            placeholder="Write your description..."
          />
        </div>
      </div>

      <AlertError :message="errorMessage" />

      <div class="mt-6 grid grid-cols-2 items-center gap-3">
        <FwbButton type="submit">Create</FwbButton>
        <RouterLink
          class="text-center text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          component="RouterLink"
          :to="{ name: 'Material' }"
          >Cancel</RouterLink
        >
      </div>
    </form>
  </div>
</template>
