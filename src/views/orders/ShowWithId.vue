<template> </template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

import { useToast } from 'primevue/usetoast';
import ProgressSpinner from 'primevue/progressspinner';

import Order from '@/interfaces/order';
import determineErrorMessage from '@/utils/error-message';

export default defineComponent({
  name: 'ShowOrderWithId',
  components: {
    ProgressSpinner
  },
  setup() {
    const route = useRoute();
    const toast = useToast();

    const isLoading = ref<boolean>(true);
    const order = ref<Order | null>(null);

    onMounted(async () => {
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

    return { isLoading, order };
  }
});
</script>
