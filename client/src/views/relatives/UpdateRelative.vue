<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { FwbButton, FwbInput, FwbTextarea, FwbSelect } from 'flowbite-vue'
import AlertError from '@/components/AlertError.vue'
import { trpc } from '@/trpc'
import { uploadImageToCloudinary } from '@/utils/fileUploader'
import type { RelativeInsert, Relative } from '@mono/server/src/shared/entities'
import PageForm from '@/components/PageForm.vue'
import { Toast } from '@/utils/snackBarUtil'
import { DEFAULT_SERVER_ERROR } from '@/consts'

const router = useRouter()
const route = useRoute()
const relativeId = Number(route.params.id)

const relative = ref<Relative>()
const buttonLoading = ref(false)
const errorMessage = ref('')

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
  photo: '',
  relativePhoto: null as File | null,
})

watchEffect(async () => {
  relative.value = await trpc.relative.findDetails.query({ id: relativeId })
  relativeForm.value.firstName = relative.value?.firstName ?? ''
  relativeForm.value.lastName = relative.value?.lastName ?? ''
  relativeForm.value.email = relative.value?.email ?? ''
  relativeForm.value.age = relative.value?.age.toString()
  relativeForm.value.description = relative.value?.description ?? ''
  relativeForm.value.photo = relative.value?.relativePhoto ?? ''
  selected.value = relative.value?.type ?? ''
})

// const [createNewRelative, errorMessage] = useErrorMessage(async () => {
//   if (relativeForm.value.relativePhoto === null) {
//     return
//   }
//   buttonLoading.value = true
//   const uploadedImage = await uploadImageToCloudinary(relativeForm.value.relativePhoto)

//   const newRelative = {
//     firstName: relativeForm.value.firstName,
//     lastName: relativeForm.value.lastName,
//     email: relativeForm.value.email,
//     age: parseInt(relativeForm.value.age),
//     type: selected.value as RelativeInsert['type'],
//     description: relativeForm.value.description,
//     relativePhoto: uploadedImage,
//   } as RelativeInsert

//   await trpc.relative.create.mutate(newRelative)
//   buttonLoading.value = false
//   router.back()
// })

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

async function updateRelative() {
  try {
    if (relativeForm.value.relativePhoto === null) {
      errorMessage.value = 'Relative photo is required!'
      return
    }
    buttonLoading.value = true
    const uploadedImage = await uploadImageToCloudinary(relativeForm.value.relativePhoto)

    const updatedRelative = {
      id: relativeId,
      firstName: relativeForm.value.firstName,
      lastName: relativeForm.value.lastName,
      email: relativeForm.value.email,
      age: parseInt(relativeForm.value.age),
      type: selected.value as RelativeInsert['type'],
      description: relativeForm.value.description,
      relativePhoto: uploadedImage,
    }
    await trpc.relative.update.mutate(updatedRelative)
    buttonLoading.value = false
    Toast.fire({
      icon: 'success',
      title: 'Relative Data Updated Successfully',
    })
    router.back()
  } catch (error) {
    buttonLoading.value = false
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
    Toast.fire({
      icon: 'error',
      title: 'Could Not Update Relative Data!',
      text: errorMessage.value,
    })
    router.back()
  }
}
</script>

<template>
  <PageForm heading="Update Relative" formLabel="Update Relative" @submit="updateRelative">
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
              <img
                :src="relativeForm.photo"
                alt="Relative's Image"
                class="h-full w-full object-cover"
              />
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
        <FwbButton type="submit" :loading="buttonLoading">Update</FwbButton>
      </div>
    </template>
  </PageForm>
</template>
