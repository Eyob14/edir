<script lang="ts" setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  FwbNavbar,
  FwbNavbarCollapse,
  FwbNavbarLink,
  FwbFooter,
  FwbFooterCopyright
} from 'flowbite-vue'

const { links } = defineProps<{
  links: {
    label: string
    name: string
    isActive?: boolean
  }[]
}>()

const route = useRoute()

const navigation = computed(() => {
  return links.map((item) => ({
    ...item,
    isActive: route.name === item.name,
  }))
})
</script>

<template>
  <FwbNavbar>
    <template #logo>
      <div class="flex items-center">
        <img src="../assets/logo.svg" alt="up arrow icon" class="w-24" />
        <p class="text-2xl">እድር</p>
      </div>
    </template>
    <template #default="{ isShowMenu }">
      <FwbNavbar-collapse :isShowMenu="isShowMenu">
        <!-- prettier-ignore -->
        <FwbNavbarLink
          v-for="link in navigation"
          :key="link.name"
          :is-active="link.isActive"
          :link="({ name: link.name } as any)"
          link-attr="to"
          component="RouterLink"
        >
          {{ link.label }}
        </FwbNavbarLink>
        <slot name="menu" />
      </FwbNavbar-collapse>
    </template>
  </FwbNavbar>

  <main>
    <div class="container mx-auto min-h-screen px-6 py-8">
      <RouterView />
    </div>
  </main>
  <fwb-footer footer-type="logo">
    <div class="mx-auto w-full max-w-screen-xl p-4 md:py-8">
      <fwb-footer-copyright href="/" by="Flowbite™" />
    </div>
  </fwb-footer>
</template>
