<script lang="ts" setup>
import { FwbButton } from 'flowbite-vue'
</script>

<template>
  <!-- landing page with Tailwind -->
  <div class="bg-white dark:bg-gray-800">
    <div class="container mx-auto px-6 py-8">
      <div class="items-center lg:flex">
        <div class="lg:w-1/2">
          <h2 class="text-3xl font-bold text-gray-800 dark:text-gray-100">
            We help out during funerals
          </h2>

          <p class="mt-4 text-gray-500 dark:text-gray-400 lg:max-w-md">
            We provide a service to help you organize and manage funerals. Our goal is to help everyone to have a unique and 
            <strong>Memorable</strong> funeral ceremony. We are committed to providing the highest quality to assist you the 
            whole process.
          </p>

          <div class="mt-6 flex items-center gap-2">
            <!-- prettier-ignore -->
            <FwbButton
              component="RouterLink"
              tag="router-link"
              :href="({ name: 'Signup' } as any)"
            >
              Get Started
            </FwbButton>
            <FwbButton
              component="RouterLink"
              :href="{ name: 'Login' } as any"
              tag="router-link"
              color="alternative"
            >
              Log in
            </FwbButton>
          </div>
        </div>

        <div class="mt-8 lg:mt-0 lg:w-1/2">
          <div class="flex items-center justify-center lg:justify-end">
            <div class="max-w-lg">
                <img
                  class="h-64 w-full rounded-md object-cover object-center shadow"
                  src="../assets/funeral.png"
                  alt=""
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
