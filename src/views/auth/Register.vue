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
    <p id="permissions-label">Permissions</p>
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
    <Button type="submit" class="p-mt-3" id="confirm" label="Confirm" />
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import { useRouter } from 'vue-router';
import axios, { AxiosError } from 'axios';

import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import RadioButton from 'primevue/radiobutton';
import Button from 'primevue/button';

import User from '../../models/user';

export default defineComponent({
  name: 'Register',
  components: {
    InputText,
    Password,
    RadioButton,
    Button
  },
  setup() {
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
        await axios.post(`/api/auth/register`, user);
        router.push('/');
        toast.add({
          severity: 'success',
          life: 3000,
          summary: 'Success',
          detail: "You've been registered successfully!"
        });
      } catch (error) {
        const res = (error as AxiosError).response;
        const detail = res ? res.data.message : 'An unexpected error occurred';

        toast.add({ severity: 'error', life: 3000, summary: 'Error', detail });
      }
    }

    return { user, register };
  }
});
</script>

<style scoped>
.p-field-radiobutton > label {
  margin-left: 0;
  margin-right: 0.5rem;
}

#permissions-label {
  margin-left: 0.5rem;
}

#confirm {
  width: unset;
  margin-left: 0.5rem;
}
</style>
