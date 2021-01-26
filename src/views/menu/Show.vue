<template>
  <div class="p-d-flex">
    <h1>Menu</h1>
  </div>
  <ProgressSpinner v-if="isLoading" />
  <div v-else>
    <Button
      v-if="isOwner"
      label="Add product"
      icon="pi pi-plus"
      @click="router.push('/menu/add')"
    />
    <div v-if="categoryMap && Object.values(categoryMap).length > 0">
      <div v-for="(products, category) in categoryMap" :key="category">
        <h2 class="p-text-uppercase p-text-light">{{ category }}</h2>
        <div class="p-grid">
          <div
            v-for="product in products"
            :key="product.id"
            class="p-col-12 p-md-4"
          >
            <Card>
              <template #header>
                <img :src="product.imageUrl" :alt="product.name" />
              </template>
              <template #title>
                <span>{{ product.name }}</span>
              </template>
              <template #subtitle>
                <span>${{ product.price }}</span>
              </template>
              <template #footer>
                <Button
                  v-if="isOwner"
                  icon="pi pi-pencil"
                  label="Update"
                  class="p-button-warning"
                  @click="router.push(`/menu/${product.id}/update`)"
                />
                <Button
                  v-if="isOwner"
                  icon="pi pi-trash"
                  label="Remove"
                  class="p-button-danger p-ml-2"
                  @click="confirmDeleteProduct(category, product.id)"
                />
              </template>
            </Card>
          </div>
        </div>
      </div>
    </div>
    <p v-else>
      Looks like there are no products available. That's awkward...
    </p>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';

import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import Card from 'primevue/card';

import StringMap from '@/interfaces/string-map';
import User from '@/interfaces/user';
import Product from '@/interfaces/product';
import determineErrorMessage from '../../utils/error-message';

export default defineComponent({
  name: 'ShowMenu',
  components: {
    Button,
    ProgressSpinner,
    Card
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();
    const confirm = useConfirm();

    const currentUser = computed<User>(() => store.getters.currentUser);
    const isAuthenticated = computed<boolean>(
      () => store.getters.isAuthenticated
    );
    const isOwner = ref<boolean>(
      isAuthenticated.value && currentUser.value.permissions === 'Owner'
    );

    const isLoading = ref<boolean>(true);
    const categoryMap = ref<StringMap<Product[]> | null>(null);

    onMounted(async () => {
      try {
        const res = await axios.get('/api/products');
        const data = res.data as Product[];
        const categorised = data.reduce(
          (obj: StringMap<Product[]>, product) => {
            const categoryArr: Product[] | undefined = obj[product.category];

            categoryArr
              ? categoryArr.push(product)
              : (obj[product.category] = [product]);

            return obj;
          },
          {}
        );

        categoryMap.value = categorised;
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

    function confirmDeleteProduct(category: string, id: string) {
      confirm.require({
        message: 'Are you sure you want to proceed?',
        header: 'Confirmation',
        icon: 'pi pi-exclamation-triangle',
        async accept() {
          try {
            await axios.delete(`/api/products/${id}`);

            const products = (categoryMap.value as StringMap<Product[]>)[
              category
            ];
            const removedProduct = products.find((p) => p.id === id);
            products.splice(products.indexOf(removedProduct as Product), 1);

            if (products.length === 0) {
              delete (categoryMap.value as StringMap<Product[]>)[category];
            }
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
      });
    }

    return {
      router,
      isAuthenticated,
      currentUser,
      isOwner,
      isLoading,
      categoryMap,
      confirmDeleteProduct
    };
  }
});
</script>
