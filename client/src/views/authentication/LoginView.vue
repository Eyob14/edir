<script lang="ts" setup>
import { login } from '@/stores/user'
import { ref } from 'vue'
import PageForm from '@/components/PageForm.vue'
import { FwbAlert, FwbButton, FwbInput } from 'flowbite-vue'
import { useRouter } from 'vue-router'
import useErrorMessage from '@/composables/useErrorMessage'
import { authUserRole } from '../../stores/user'

const router = useRouter()

const userForm = ref({
  email: '',
  password: '',
})
const buttonLoading = ref(false)

const [loginForm, errorMessage] = useErrorMessage(async () => {
  try {
    buttonLoading.value = true
    await login(userForm.value)
    buttonLoading.value = false
    if (authUserRole.value == 'admin') {
      router.push({ name: 'Dashboard' })
    } else {
      router.push({ name: 'UserMonetary' })
    }
  } catch (error) {
    buttonLoading.value = false
    throw error
  }
})

</script>

<template>
  <PageForm heading="Log in to your account" formLabel="Login" @submit="loginForm">
    <template #default>
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

      <FwbAlert v-if="errorMessage" type="danger">
        {{ errorMessage }}
      </FwbAlert>

      <div class="grid">
        <FwbButton color="default" type="submit" :loading="buttonLoading" size="xl"
          >Log in</FwbButton
        >
      </div>
    </template>

    <template #footer>
      <FwbAlert class="bg-transparent text-center">
        Not a member?
        {{ ' ' }}
        <RouterLink
          :to="{ name: 'Signup' }"
          class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >Sign up</RouterLink
        >
      </FwbAlert>
    </template>
  </PageForm>
</template>
