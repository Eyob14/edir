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
  <div v-if="user" class="flex space-x-4">
    <div class="w-1/2">
      <div>
        <img v-if="user.profileImage" :src="user.profileImage" alt="Profile Image" />
      </div>
    </div>
    <div class="flex w-1/2 flex-col justify-center border space-y-4 px-10">
      <div class="flex space-x-6">
        <p>Name:</p>
        <p>{{ user.firstName }} {{ user.lastName }}</p>
      </div>
      <div class="flex space-x-6">
        <p>Email:</p>
        <p>{{ user.email }}</p>
      </div>
      <div class="flex space-x-6">
        <p>Age:</p>
        <p>{{ user.age }}</p>
      </div>
      <div class="flex space-x-6">
        <p>Verification:</p>
        <p>
          <span
            class="p-2 text-white"
            :class="{
              'bg-green-500': user.isVerified,
              'bg-red-500': !user.isVerified,
            }"
          >
            {{ user.isVerified ? 'Verified' : 'Unverified' }}
          </span>
        </p>
      </div>
      <div class="flex space-x-6">
        <p>Number of Relatives:</p>
        <p>{{ user.relatives.length }}</p>
      </div>
      <div class="flex space-x-6">
        <p>Created At:</p>
        <p>{{ dateConvertor(user.createdAt) }}</p>
      </div>
    </div>
  </div>
</template>
