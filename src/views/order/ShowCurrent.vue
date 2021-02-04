<template>
  <h1>Your order</h1>
  <div v-if="products.length > 0">
    <div v-for="product in products" :key="product.name">
      <div class="p-d-flex p-jc-between">
        <div class="p-d-flex">
          <Button
            icon="pi pi-trash"
            class="p-button-rounded p-button-danger p-mr-3"
            @click="removeProduct(product)"
          />
          <span class="product">
            {{ product.name }} - <strong>${{ product.cost }}</strong>
          </span>
        </div>
        <InputNumber
          v-model="product.quantity"
          :min="1"
          mode="decimal"
          showButtons
          buttonLayout="horizontal"
          decrementButtonClass="p-button-danger"
          incrementButtonClass="p-button-success"
          incrementButtonIcon="pi pi-plus"
          decrementButtonIcon="pi pi-minus"
        />
      </div>
      <Divider />
    </div>
    <span>
      Total: <strong>${{ totalPrice }}</strong>
    </span>
    <p>
      <em>
        Because of me being plain lazy, and this project taking me way too long
        than it should have, let's just fucking skip payment and possible
        delivery options, as well as address form. I know how to implement them,
        it's just high time I moved on to another project for goodness sake.
      </em>
    </p>
    <Button label="Submit" @click="submitOrder"></Button>
  </div>
  <p v-else>
    Wow! It's empty. Head over to <strong>Menu</strong>, and add some products
    to your order.
  </p>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';

import { useToast } from 'primevue/usetoast';
import InputNumber from 'primevue/inputnumber';
import Divider from 'primevue/divider';
import Button from 'primevue/button';

import OrderProduct from '@/interfaces/order-product';
import determineErrorMessage from '@/utils/error-message';

export default defineComponent({
  name: 'ShowCurrentOrder',
  components: {
    InputNumber,
    Divider,
    Button
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    const products = computed<OrderProduct[]>(() => store.getters.getProducts);
    const totalPrice = computed<number>(() => store.getters.getTotalPrice);

    function removeProduct(product: OrderProduct) {
      store.commit('REMOVE_PRODUCT', product);
    }

    async function submitOrder() {
      try {
        await axios.post('/api/orders', {
          content: products.value,
          cost: totalPrice.value
        });

        store.commit('CLEAR_PRODUCTS');
        router.push('/');
        toast.add({
          severity: 'success',
          life: 3000,
          summary: 'Success',
          detail: `Your order has been submitted`
        });
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

    return { products, totalPrice, removeProduct, submitOrder };
  }
});
</script>
<style scoped>
.product {
  line-height: 2.25rem;
  vertical-align: middle;
}
</style>
