<script lang="ts" setup>
import { ref } from 'vue'
import PageForm from '@/components/PageForm.vue'
import { FwbAlert, FwbButton, FwbInput } from 'flowbite-vue'
import type AlertError from '@/components/AlertError.vue'
import { signup } from '@/stores/user'
import { uploadImageToCloudinary } from '@/utils/fileUploader'
import useErrorMessage from '@/composables/useErrorMessage'
import { Toast } from '@/utils/snackBarUtil'

const userForm = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  age: '',
  profile: null as File | null,
})

const hasSucceeded = ref(false)
const buttonLoading = ref(false)

const imageUrl = ref<string | undefined>(undefined)

function handleFileSelect(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    userForm.value.profile = file
    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target && typeof event.target.result === 'string') {
        imageUrl.value = event.target.result
      }
    }
    reader.readAsDataURL(file)
  }
}

const [submitSignup, errorMessage] = useErrorMessage(async () => {
  try {
    if (userForm.value.profile === null) {
      Toast.fire({
        icon: 'error',
        title: 'Profile image is required!',
      })
      return
    }
    
    buttonLoading.value = true
    const uploadedImage = await uploadImageToCloudinary(userForm.value.profile)

    const newUserData = {
      firstName: userForm.value.firstName,
      lastName: userForm.value.lastName,
      email: userForm.value.email,
      password: userForm.value.password,
      age: parseInt(userForm.value.age),
      profileImage: uploadedImage,
    }
    await signup(newUserData)
    buttonLoading.value = false
    hasSucceeded.value = true
  } catch (error) {
    buttonLoading.value = false
  }
})
</script>

<template>
  <PageForm heading="Create New Account" formLabel="Signup" @submit="submitSignup">
    <template #default>
      <div class="flex justify-center">
        <label
          for="profileImage"
          class="relative block h-40 w-40 cursor-pointer overflow-hidden rounded-full border-4 border-gray-200"
        >
          <img
            v-if="userForm.profile"
            :src="imageUrl"
            alt="Profile Image"
            class="h-full w-full object-cover"
          />
          <div>
            v-else
            class="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
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
      <FwbInput label="First Name" type="text" v-model="userForm.firstName" :required="true" id="firstName"/>
      <FwbInput label="Last Name" type="text" v-model="userForm.lastName" :required="true" id="lastName" />
      <FwbInput label="Email" type="email" v-model="userForm.email" :required="true" />
      <FwbInput
        label="Password"
        id="password"
        name="password"
        type="password"
        autocomplete="current-password"
        v-model="userForm.password"
        :required="true"
      />
      <FwbInput label="Age" type="number" v-model="userForm.age" :required="true" />

      <FwbAlert v-if="hasSucceeded" data-testid="successMessage" type="success">
        You have successfully signed up! You can now log in.
        <RouterLink
          :to="{ name: 'Login' }"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >Go to the login page</RouterLink
        >
      </FwbAlert>
      <AlertError :message="errorMessage" data-testid="errorMessage">
        {{ errorMessage }}
      </AlertError>
      
      <div class="grid">
        <FwbButton color="default" type="submit" :loading="buttonLoading" size="xl"
          >Sign up</FwbButton
        >
      </div>
    </template>

    <template #footer>
      <FwbAlert class="bg-transparent text-center">
        Already a member?
        {{ ' ' }}
        <RouterLink
          :to="{ name: 'Login' }"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >Log in</RouterLink
        >
      </FwbAlert>
    </template>
  </PageForm>
</template>
