<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { FwbButton, FwbInput, FwbTextarea, FwbSelect } from 'flowbite-vue'
import AlertError from '@/components/AlertError.vue'
import useErrorMessage from '@/composables/useErrorMessage'
import { trpc } from '@/trpc'
import { uploadImageToCloudinary } from '@/utils/fileUploader'
import type { RelativeInsert } from '@mono/server/src/shared/entities'
import PageForm from '@/components/PageForm.vue'
import { Toast } from '@/utils/snackBarUtil'

const router = useRouter()
const buttonLoading = ref(false)

const selected = ref('')
const types = [
  { value: 'child', name: 'Child' },
  { value: 'mother', name: 'Mother' },
  { value: 'father', name: 'Father' },
  { value: 'sibling', name: 'Sibling' },
  { value: 'grandparent', name: 'Grandparent' },
  { value: 'grandchild', name: 'Grandchild' },
  { value: 'aunt', name: 'Aunt' },
  { value: 'uncle', name: 'Uncle' },
]

const relativeForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  age: '',
  description: '',
  relativePhoto: null as File | null,
})

const [createNewRelative, errorMessage] = useErrorMessage(async () => {
  try {
    if (relativeForm.value.relativePhoto === null) {
      Toast.fire({
        icon: 'error',
        title: 'Relative photo is required!',
      })
      return
    }
    buttonLoading.value = true
    const uploadedImage = await uploadImageToCloudinary(relativeForm.value.relativePhoto)

    const newRelative = {
      firstName: relativeForm.value.firstName,
      lastName: relativeForm.value.lastName,
      email: relativeForm.value.email,
      age: parseInt(relativeForm.value.age),
      type: selected.value as RelativeInsert['type'],
      description: relativeForm.value.description,
      relativePhoto: uploadedImage,
    } as RelativeInsert

    await trpc.relative.create.mutate(newRelative)
    buttonLoading.value = false
    Toast.fire({
      icon: 'success',
      title: 'New Relative Created Successfully',
    })
    router.back()
  } catch (error) {
    buttonLoading.value = false
    Toast.fire({
      icon: 'error',
      title: 'Could not create a new relative!',
    })
    throw error
  }
})

const imageUrl = ref<string | undefined>(undefined)

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    relativeForm.value.relativePhoto = file
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
  <PageForm heading="Add New Relative" formLabel="Create New Relative" @submit="createNewRelative">
    <template #default>
      <div class="space-y-6">
        <div class="flex justify-center">
          <label
            for="profileImage"
            class="relative block h-40 w-40 cursor-pointer overflow-hidden rounded-full border-4 border-gray-200"
          >
            <img
              v-if="relativeForm.relativePhoto"
              :src="imageUrl"
              alt="Relative's Image"
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
            aria-label="First Name"
            v-model="relativeForm.firstName"
            label="First Name"
            placeholder="First Name"
            :required="true"
          />
          <FwbInput
            aria-label="Last Name"
            v-model="relativeForm.lastName"
            label="Last Name"
            placeholder="Last Name"
            :required="true"
          />
          <FwbInput
            label="Email"
            aria-label="Email"
            placeholder="Email"
            type="email"
            v-model="relativeForm.email"
            :required="true"
          />
          <FwbInput
            aria-label="Age"
            v-model="relativeForm.age"
            :type="'number'"
            label="Age"
            placeholder="Age"
            :required="true"
          />
          <fwb-select
            v-model="selected"
            :options="types"
            label="Select type of your relation"
            size="md"
            :required="true"
          />
          <fwb-textarea
            v-model="relativeForm.description"
            :rows="4"
            :minlength="2"
            label="Relative description"
            placeholder="Write your description..."
            :required="true"
          />
        </div>
      </div>

      <AlertError :message="errorMessage" />

      <div class="mt-6 grid grid-cols-2 items-center gap-3">
        <FwbButton
          color="dark"
          outline
          class="text-center text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          @click="router.back()"
          >Cancel</FwbButton
        >
        <FwbButton type="submit" :loading="buttonLoading">Create</FwbButton>
      </div>
    </template>
  </PageForm>
</template>
