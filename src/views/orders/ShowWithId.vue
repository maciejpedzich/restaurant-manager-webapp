<template>
  <ProgressSpinner v-if="isLoading" />
  <div v-else>
    <h1>Order (ID: {{ order.id }})</h1>
    <h3 class="p-text-light">
      Date ordered: {{ dateFormat(order.dateCreated, 'dd.mm.yyyy (HH:MM)') }}
    </h3>
    <Timeline :value="events" layout="horizontal">
      <template #content="slotProps">
        {{ slotProps.item }}
      </template>
      <template #marker="slotProps">
        <div
          :class="{
            'p-timeline-event-marker': true,
            'current-status': order.status === slotProps.item
          }"
        ></div>
      </template>
    </Timeline>
    <h2>Content:</h2>
    <ul>
      <li v-for="product in order.content" :key="product.name">
        {{ product.name }} x{{ product.quantity }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import dateFormat from 'dateformat';

import { useToast } from 'primevue/usetoast';
import Timeline from 'primevue/timeline';
import ProgressSpinner from 'primevue/progressspinner';

import socketConnectMixin from '@/mixins/socket-connect';
import socket from '@/socket.io';

import Order from '@/interfaces/models/order';
import determineErrorMessage from '@/utils/error-message';

export default defineComponent({
  name: 'ShowOrderWithId',
  components: {
    ProgressSpinner,
    Timeline
  },
  mixins: [socketConnectMixin],
  setup() {
    const route = useRoute();
    const toast = useToast();

    const isLoading = ref<boolean>(true);
    const order = ref<Order | null>(null);
    const events = ['Received', 'Preparing', 'Packing', 'Ready'];

    onMounted(async () => {
      socket.emit('join room', `order ${route.params.orderId}`);

      socket.on(
        'order updated',
        (status: string) => ((order.value as Order).status = status)
      );

      try {
        const res = await axios.get(`/api/orders/${route.params.orderId}`);

        order.value = res.data;
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

    return { dateFormat, isLoading, order, events };
  }
});
</script>

<style scoped>
.current-status {
  background-color: #4caf50;
}
</style>
