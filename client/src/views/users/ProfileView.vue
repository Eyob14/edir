<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import type { User } from '@mono/server/src/shared/entities'
import { trpc } from '@/trpc'
import { authUserId } from '@/stores/user'
import { dateConvertor } from '@/utils/dateConvertor'

const user = ref<User>()
const userId = authUserId.value

watchEffect(async () => {
  if (userId) {
    user.value = await trpc.user.getDetails.query({ id: userId })
  }
})
</script>

<template>
  <div v-if="user" class="flex justify-between">
    <div class="w-1/2">
      <div class="w-3/5">
        <img v-if="user.profileImage" :src="user.profileImage" alt="Profile Image" />
      </div>
    </div>
    <div class="flex w-1/2 flex-col space-y-4">
      <p>Name: {{ user.firstName }} {{ user.lastName }}</p>
      <p>Email: {{ user.email }}</p>
      <p>Age: {{ user.age }}</p>
      <p>Verification: {{ user.isVerified ? 'Verified' : 'Unverified' }}</p>
      <p>Number of Relatives: {{ user.relatives.length }}</p>
      <p>Created At: {{ dateConvertor(user.createdAt) }}</p>
    </div>
  </div>
</template>
