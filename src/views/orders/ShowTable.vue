<template>
  <h1>Orders</h1>
  <ProgressSpinner v-if="isLoading" />
  <div v-else>
    <Dialog header="Update status" v-model:visible="orderChosen">
      <div class="p-field-radiobutton p-col-12">
        <label for="status-received">
          <strong>Received</strong>
        </label>
        <RadioButton
          id="status-received"
          name="status"
          value="Received"
          v-model="orderToEdit.status"
        />
      </div>
      <div class="p-field-radiobutton p-col-12">
        <label for="status-preparing">
          <strong>Preparing</strong>
        </label>
        <RadioButton
          id="status-preparing"
          name="status"
          value="Preparing"
          v-model="orderToEdit.status"
        />
      </div>
      <div class="p-field-radiobutton p-col-12">
        <label for="status-packing">
          <strong>Packing</strong>
        </label>
        <RadioButton
          id="status-packing"
          name="status"
          value="Packing"
          v-model="orderToEdit.status"
        />
      </div>
      <div class="p-field-radiobutton p-col-12">
        <label for="status-ready">
          <strong>Ready</strong>
        </label>
        <RadioButton
          id="status-ready"
          name="status"
          value="Ready"
          v-model="orderToEdit.status"
        />
      </div>
      <Button label="Cancel" class="p-mr-2" @click="orderToEdit = null" />
      <Button label="Update" class="p-button-warning" @click="updateOrder" />
    </Dialog>
    <DataTable class="p-datatable-striped" :value="orders">
      <Column field="id" header="ID" />
      <Column field="dateCreated" header="Date created">
        <template #body="slotProps">
          {{ dateFormat(slotProps.data.dateCreated, 'dd.mm.yyyy (hh:MM)') }}
        </template>
      </Column>
      <Column field="status" header="Status" />
      <Column>
        <template #body="slotProps">
          <Button
            icon="pi pi-eye"
            class="p-button-text p-mr-2"
            @click="router.push(`/orders/${slotProps.data.id}`)"
          />
          <Button
            icon="pi pi-pencil"
            class="p-button-text p-button-warning"
            @click="orderToEdit = slotProps.data"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

import { useToast } from 'primevue/usetoast';
import ProgressSpinner from 'primevue/progressspinner';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import RadioButton from 'primevue/radiobutton';
import Dialog from 'primevue/dialog';

import dateFormat from 'dateformat';
import determineErrorMessage from '@/utils/error-message';
import Order from '@/interfaces/models/order';
import socket from '@/socket.io';

export default defineComponent({
  name: 'ShowOrders',
  components: {
    ProgressSpinner,
    DataTable,
    Column,
    Button,
    RadioButton,
    Dialog
  },
  setup() {
    const router = useRouter();
    const toast = useToast();

    const isLoading = ref<boolean>(true);
    const orders = ref<Order[] | null>(null);
    const orderToEdit = ref<Order | null>(null);
    const orderChosen = ref<boolean>(!!orderToEdit.value);

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

    watch(orderToEdit, (newValue) => (orderChosen.value = !!newValue));

    async function updateOrder() {
      try {
        const order = orderToEdit.value as Order;
        await axios.put(`/api/orders/${order.id}`, { status: order.status });

        socket.emit('update order', order.id, order.status);
        orderToEdit.value = null;
      } catch (error) {
        const message = determineErrorMessage(error);

        toast.add({
          severity: 'error',
          life: 3000,
          summary: 'Error',
          detail: message
        });
      }
    }

    return {
      router,
      dateFormat,
      updateOrder,
      isLoading,
      orders,
      orderToEdit,
      orderChosen
    };
  }
});
</script>
