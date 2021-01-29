<template>
  <h1>Your order</h1>
  <code>{{ products }}</code>
  <p>
    Total: <em>${{ totalPrice }}</em>
  </p>
</template>

<script lang="ts">
import OrderProduct from '@/interfaces/order-product';
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ShowCurrentOrder',
  setup() {
    const store = useStore();
    const products = computed<OrderProduct[]>(() => store.getters.getProducts);
    const totalPrice = computed<number>(() => store.getters.getTotalPrice);

    return { products, totalPrice };
  }
});
</script>
