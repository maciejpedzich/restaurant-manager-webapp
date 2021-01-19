<template>
  <h1 class="p-mb-4">Log in</h1>
  <form class="p-fluid p-formgrid p-grid" @submit.prevent="logIn">
    <div class="p-field p-col-12 p-md-6">
      <label for="email">Email address</label>
      <InputText id="email" type="email" v-model="user.email" />
    </div>
    <div class="p-field p-col-12 p-md-6">
      <label for="password">Password</label>
      <Password id="password" :feedback="false" v-model="user.password" />
    </div>
    <Button type="submit" class="p-mt-3" id="confirm" label="Confirm" />
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
      email: '',
      password: ''
    });

    async function logIn() {
      try {
        await store.dispatch('logIn', user);

        router.push('/');
        toast.add({
          severity: 'success',
          life: 3000,
          summary: 'Success',
          detail: 'Welcome back!'
        });
      } catch (error) {
        toast.add({
          severity: 'error',
          life: 3000,
          summary: 'Error',
          detail: error.message
        });
      }
    }

    return { user, logIn };
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
