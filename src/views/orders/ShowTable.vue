<template>
  <h1>Orders</h1>
  <ProgressSpinner v-if="isLoading" />
  <div v-else>
    <DataTable class="p-datatable-striped" :value="orders">
      <Column field="id" header="ID"></Column>
      <Column field="dateCreated" header="Date created">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.dateCreated) }}
        </template>
      </Column>
      <Column field="status" header="Status"></Column>
      <Column>
        <template #body="slotProps">
          <Button
            icon="pi pi-eye"
            class="p-button-text p-mr-2"
            @click="router.push(`/orders/${slotProps.data.id}`)"
          />
          <Button icon="pi pi-pencil" class="p-button-text p-button-warning" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

import { useToast } from 'primevue/usetoast';
import ProgressSpinner from 'primevue/progressspinner';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';

import determineErrorMessage from '@/utils/error-message';

export default defineComponent({
  name: 'ShowOrders',
  components: {
    ProgressSpinner,
    DataTable,
    Column,
    Button,
    Dialog
  },
  setup() {
    const router = useRouter();
    const toast = useToast();

    const isLoading = ref<boolean>(true);
    const orders = ref<[] | null>(null);

    function formatDate(dateStr: string) {
      return new Date(dateStr).toISOString().substr(0, 10);
    }

    onMounted(async () => {
      try {
        const res = await axios.get('/api/orders');
        const data = res.data;

        orders.value = data;
        isLoading.value = false;
      } catch (error) {
        const message = determineErrorMessage(error);

        toast.add({
          severity: 'error',
          life: 3000,
          summary: 'Error',
          detail: message
        });
      }
    });

    return { router, formatDate, isLoading, orders };
  }
});
</script>
