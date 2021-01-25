<template>
  <h1>Menu</h1>
  <ProgressSpinner v-if="isLoading" />
  <div v-else>
    <Button
      v-if="isAuthenticated && currentUser.permissions === 'Owner'"
      label="Add product"
      icon="pi pi-plus"
      @click="router.push('/menu/add')"
    />
    <div v-if="products.length > 0">
      <code>{{ products }}</code>
    </div>
    <p v-else>
      Looks like there are no products available. That's awkward...
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import { useToast } from 'primevue/usetoast';

import Product from '../../interfaces/product';
import determineErrorMessage from '../../utils/error-message';
import User from '@/interfaces/user';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'ShowMenu',
  components: {
    Button,
    ProgressSpinner
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    const currentUser = computed<User>(() => store.getters.currentUser);
    const isAuthenticated = computed<boolean>(
      () => store.getters.isAuthenticated
    );

    const isLoading = ref<boolean>(true);
    const products = ref<Product[] | null>(null);
    const categories = ref<string[] | null>(null);

    onMounted(async () => {
      try {
        const res = await axios.get('/api/products');
        const data = res.data as Product[];
        const itemCategories = data.map((item) => item.category);

        products.value = data;
        categories.value =
          itemCategories.length > 0 ? [...new Set(itemCategories)] : [];
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

    return {
      router,
      isAuthenticated,
      currentUser,
      isLoading,
      products,
      categories
    };
  }
});
</script>
