<template>
  <Menubar :model="menuItems"></Menubar>
  <Toast position="top-right" />
  <div class="container">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
import Menubar from 'primevue/menubar';
import Toast from 'primevue/toast';

export default defineComponent({
  name: 'App',
  components: {
    Menubar,
    Toast
  },
  setup() {
    const menuItems = reactive([
      {
        label: 'Home',
        icon: 'pi pi-home',
        to: '/'
      },
      {
        label: 'Log in',
        icon: 'pi pi-sign-in'
        // to: '/login'
      },
      {
        label: 'Register',
        icon: 'pi pi-user-plus',
        to: '/register'
      }
    ]);

    return { menuItems };
  }
});
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
    Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.container {
  padding-right: 15px;
  padding-left: 15px;
  margin-right: auto;
  margin-left: auto;
}
@media (min-width: 768px) {
  .container {
    width: 750px;
  }
}
@media (min-width: 992px) {
  .container {
    width: 970px;
  }
}
@media (min-width: 1200px) {
  .container {
    width: 1170px;
  }
}
</style>
