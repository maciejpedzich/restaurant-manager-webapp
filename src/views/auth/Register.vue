<template>
  <h1 class="p-mb-4">Register</h1>
  <form class="p-fluid p-formgrid p-grid" @submit.prevent="register">
    <div class="p-field p-col-12 p-md-6">
      <label for="firstname">First name</label>
      <InputText id="firstname" type="text" v-model="user.firstname" />
    </div>
    <div class="p-field p-col-12 p-md-6">
      <label for="lastname">Last name</label>
      <InputText id="lastname" type="text" v-model="user.lastname" />
    </div>
    <div class="p-field p-col-12">
      <label for="email">Email address</label>
      <InputText id="email" type="email" v-model="user.email" />
    </div>
    <div class="p-field p-col-12">
      <label for="password">Password</label>
      <Password id="password" :feedback="false" v-model="user.password" />
    </div>
    <p class="radio-label">Permissions</p>
    <div class="p-field-radiobutton p-col-12">
      <label for="permissions-customer">
        <strong>Customer</strong>
      </label>
      <RadioButton
        id="permissions-customer"
        name="permissions"
        value="Customer"
        v-model="user.permissions"
      />
    </div>
    <div class="p-field-radiobutton p-col-12">
      <label for="permissions-employee">
        <strong>Employee</strong>
      </label>
      <RadioButton
        id="permissions-employee"
        name="permissions"
        value="Employee"
        v-model="user.permissions"
      />
    </div>
    <div class="p-field-radiobutton p-col-12">
      <label for="permissions-owner">
        <strong>Owner</strong>
      </label>
      <RadioButton
        id="permissions-owner"
        name="permissions"
        value="Owner"
        v-model="user.permissions"
      />
    </div>
    <Button type="submit" class="p-mt-3" label="Confirm" />
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';

import User from '../../interfaces/user';

export default defineComponent({
  name: 'Register',
  components: {
    InputText,
    Password,
    RadioButton,
    Button
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const toast = useToast();

    const user = reactive<User>({
      firstname: '',
      lastname: '',
      email: '',
      password: '',
      permissions: 'Customer'
    });

    async function register() {
      try {
        await store.dispatch('register', user);

        toast.add({
          severity: 'success',
          life: 3000,
          summary: 'Success',
          detail: 'You have been registered'
        });
        router.push('/');
      } catch (error) {
        toast.add({
          severity: 'error',
          life: 3000,
          summary: 'Error',
          detail: error.message
        });
      }
    }

    return { user, register };
  }
});
</script>
