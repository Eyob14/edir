<script setup lang="ts">
import type { Penalty } from '@mono/server/src/shared/entities'
import { dateConvertor } from '@/utils/dateConvertor'
import {
  FwbTable,
  FwbTableBody,
  FwbTableCell,
  FwbTableHead,
  FwbTableHeadCell,
  FwbTableRow,
  FwbButton,
  FwbButtonGroup,
} from 'flowbite-vue'
import { ref } from 'vue'
import { trpc } from '@/trpc'
import { Toast } from '@/utils/snackBarUtil'
import { DEFAULT_SERVER_ERROR } from '@/consts'
import PenaltyDetails from '@/components/modals/penaltyDetails.vue'

const { penalties, visible } = defineProps(['penalties', 'visible'])

const emit = defineEmits(['openModal', 'recalculate', 'update'])

const calculateTotalPenalities = () => {
  emit('recalculate')
}

const updatePenaltiesData = (penalties: Penalty[]) => {
  emit('update', penalties)
}

const deleteButtonLoading = ref(false)
const errorMessage = ref('')

async function deletePenalty(penaltyId: number) {
  try {
    deleteButtonLoading.value = true
    await trpc.penalty.deletePenalty.mutate({ id: penaltyId })
    deleteButtonLoading.value = false
    Toast.fire({
      icon: 'success',
      title: 'Penalty Deleted Successfully',
    })
    const updatedPenalty = penalties.value.filter((penalty: Penalty) => penalty.id !== penaltyId)
    updatePenaltiesData(updatedPenalty)
    calculateTotalPenalities()
  } catch (error) {
    deleteButtonLoading.value = false
    errorMessage.value = error instanceof Error ? error.message : DEFAULT_SERVER_ERROR
    Toast.fire({
      icon: 'error',
      title: 'Could Not Delete Penalty!',
      text: errorMessage.value,
    })
  }
}
// penalty modal
const isPenaltyModalOpened = ref(false)
const selectedPenalty = ref<Penalty>()

const openPenaltyModal = (penalty: Penalty) => {
  isPenaltyModalOpened.value = true
  selectedPenalty.value = penalty
}

const closePenaltyModal = () => {
  isPenaltyModalOpened.value = false
}
</script>

<template>
  <div class="flex flex-col space-y-10">
    <fwb-button
      component="RouterLink"
      tag="router-link"
      :href="{ name: 'CreatePenalty' } as any"
      size="xs"
      class="flex h-10 w-32 items-center justify-center self-end"
      v-if="visible"
    >
      New Penalty
    </fwb-button>
    <fwb-table>
      <fwb-table-head>
        <fwb-table-head-cell>Penalty Date</fwb-table-head-cell>
        <fwb-table-head-cell>Amount</fwb-table-head-cell>
        <fwb-table-head-cell>Payed By</fwb-table-head-cell>
        <fwb-table-head-cell>Details</fwb-table-head-cell>
      </fwb-table-head>
      <fwb-table-body v-if="penalties.length">
        <fwb-table-row v-for="penalty in penalties" :key="penalty.id">
          <fwb-table-cell>{{ dateConvertor(penalty.createdAt) }}</fwb-table-cell>
          <fwb-table-cell>{{ penalty.amount }}</fwb-table-cell>
          <fwb-table-cell class="capitalize">{{
            penalty.user.firstName + ' ' + penalty.user.lastName
          }}</fwb-table-cell>
          <fwb-table-cell>
            <fwb-button-group class="space-x-3">
              <FwbButton @click="openPenaltyModal(penalty)" class="pr-3"> View </FwbButton>
              <FwbButton
                component="RouterLink"
                tag="router-link"
                :href="
                  {
                    name: 'UpdatePenalty',
                    params: { id: penalty.id },
                  } as any
                "
                class="pr-3"
                color="yellow"
                v-if="visible"
              >
                Edit
              </FwbButton>
              <FwbButton
                @click="deletePenalty(penalty.id)"
                :loading="deleteButtonLoading"
                class="pr-3"
                color="red"
                v-if="visible"
              >
                Delete
              </FwbButton>
            </fwb-button-group>
          </fwb-table-cell>
        </fwb-table-row>
      </fwb-table-body>
      <fwb-table-body v-else>
        <fwb-table-row>
          <fwb-table-cell colspan="6">
            <div class="flex h-40 w-full items-center justify-center border">No Penalties yet!</div>
          </fwb-table-cell>
        </fwb-table-row>
      </fwb-table-body>
    </fwb-table>
  </div>
  <PenaltyDetails
    :visible="isPenaltyModalOpened"
    @close="closePenaltyModal"
    :penalty="selectedPenalty"
  />
</template>
