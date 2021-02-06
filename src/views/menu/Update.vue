<template>
  <h1 class="p-mb-4">Update product</h1>
  <ProgressSpinner v-if="isLoading" />
  <form
    v-else
    class="p-fluid p-formgrid p-grid"
    @submit.prevent="updateProduct"
  >
    <div class="p-field p-col-12 p-md-6">
      <label for="name">Name</label>
      <InputText id="firstname" type="text" v-model="product.name" />
    </div>
    <div class="p-field p-col-12 p-md-6">
      <label for="price">Price</label>
      <InputNumber
        id="price"
        v-model="product.price"
        :min="0"
        :step="0.01"
        showButtons
        buttonLayout="horizontal"
        decrementButtonClass="p-button-danger"
        incrementButtonClass="p-button-success"
        incrementButtonIcon="pi pi-plus"
        decrementButtonIcon="pi pi-minus"
        mode="currency"
        currency="USD"
      />
    </div>
    <div class="p-field p-col-12">
      <label for="category">Category</label>
      <InputText id="category" type="text" v-model="product.category" />
    </div>
    <p class="radio-label">Availability</p>
    <div class="p-field-radiobutton p-col-12">
      <label for="availability-in-stock">
        <strong>In stock</strong>
      </label>
      <RadioButton
        id="availability-in-stock"
        name="availability"
        value="In stock"
        v-model="product.availability"
      />
    </div>
    <div class="p-field-radiobutton p-col-12">
      <label for="availability-low-stock">
        <strong>Low stock</strong>
      </label>
      <RadioButton
        id="availability-low-stock"
        name="availability"
        value="Low stock"
        v-model="product.availability"
      />
    </div>
    <div class="p-field-radiobutton p-col-12">
      <label for="availability-out-of-stock">
        <strong>Out of stock</strong>
      </label>
      <RadioButton
        id="availability-out-of-stock"
        name="availability"
        value="Out of stock"
        v-model="product.availability"
      />
    </div>
    <Button type="submit" class="p-mt-3" id="confirm" label="Confirm" />
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

import { useToast } from 'primevue/usetoast';
import ProgressSpinner from 'primevue/progressspinner';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';

import Product from '@/interfaces/models/product';
import determineErrorMessage from '@/utils/error-message';

export default defineComponent({
  name: 'UpdateProduct',
  components: {
    ProgressSpinner,
    InputText,
    InputNumber,
    RadioButton,
    Button
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const toast = useToast();

    const productId = route.params.productId;
    const isLoading = ref<boolean>(true);
    const product = ref<Product | null>(null);

    onMounted(async () => {
      try {
        const res = await axios.get(`/api/products/${productId}`);
        const data = res.data as Product;
        data.price = parseFloat(data.price as string);

        product.value = data;
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

    async function updateProduct() {
      try {
        await axios.put(`/api/products/${productId}`, product.value);

        toast.add({
          severity: 'success',
          life: 3000,
          summary: 'Success',
          detail: 'Prodcut has been updated'
        });
        router.push('/menu');
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
      isLoading,
      product,
      updateProduct
    };
  }
});
</script>
