<template>
  <h1 class="p-mb-4">Add product</h1>
  <form class="p-fluid p-formgrid p-grid" @submit.prevent="addProduct">
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
      <FileUpload
        name="image"
        accept=".png,.jpg,.jpeg"
        :disabled="product.imageUrl !== ''"
        :url="imageUploadUrl"
        :fileLimit="1"
        :previewWidth="150"
        @before-send="onBeforeSend"
        @upload="onUploadSuccess"
        @error="onUploadError"
      >
        <template #empty>
          <p>
            Image's preview will show here. You can only upload one file at a
            time, so choose your image wisely ;)
          </p>
        </template>
      </FileUpload>
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
import { defineComponent, ref, reactive, computed } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import axios from 'axios';

import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import FileUpload from 'primevue/fileupload';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';

import Product from '@/interfaces/product';
import determineErrorMessage from '@/utils/error-message';

interface FileUploadEvent {
  xhr: XMLHttpRequest;
  files: FormData;
}

export default defineComponent({
  name: 'AddProduct',
  components: {
    InputText,
    InputNumber,
    FileUpload,
    RadioButton,
    Button
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    const imageUploadUrl = ref<string>(
      `${process.env.VUE_APP_API_URL}/upload-image`
    );
    const product = reactive<Product>({
      name: '',
      price: 0,
      imageUrl: '',
      category: '',
      availability: 'In stock'
    });

    async function addProduct() {
      try {
        await axios.post('/api/products', product);

        toast.add({
          severity: 'success',
          life: 3000,
          summary: 'Hooray!',
          detail: 'Prodcut added sucessfully'
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

    function onBeforeSend({ xhr }: FileUploadEvent) {
      const accessTokenGetter = computed<string>(
        () => store.getters.accessToken
      );

      xhr.withCredentials = true;
      xhr.setRequestHeader(
        'Authorization',
        `Bearer ${accessTokenGetter.value}`
      );
    }

    function onUploadSuccess({ xhr }: FileUploadEvent) {
      product.imageUrl = JSON.parse(xhr.response).url;
      toast.add({
        severity: 'success',
        life: 3000,
        summary: 'Hooray!',
        detail: 'Image uploaded successfully'
      });
    }

    function onUploadError() {
      toast.add({
        severity: 'error',
        life: 3000,
        summary: 'Error',
        detail: 'Failed to upload image'
      });
    }

    return {
      product,
      imageUploadUrl,
      addProduct,
      onBeforeSend,
      onUploadSuccess,
      onUploadError
    };
  }
});
</script>
