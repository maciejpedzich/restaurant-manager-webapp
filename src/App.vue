<template>
  <Menubar :model="menuItems">
    <template #start>
      <strong class="p-mx-lg-5 p-mx-sm-1">Restaurant</strong>
    </template>
  </Menubar>
  <Toast position="top-right" />
  <ConfirmDialog></ConfirmDialog>
  <div class="container">
    <router-view />
  </div>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
  watch
} from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

import Menubar from 'primevue/menubar';
import Toast from 'primevue/toast';
import ConfirmDialog from 'primevue/confirmdialog';

export default defineComponent({
  name: 'App',
  components: {
    Menubar,
    Toast,
    ConfirmDialog
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const refreshTimeoutId = computed<number | null>(
      () => store.getters.silentRefreshTimeout
    );
    const isAuthenticatedGetter = computed<boolean>(
      () => store.getters.isAuthenticated
    );

    const menuItems = reactive([
      {
        label: 'Home',
        icon: 'pi pi-home',
        to: '/',
        visible: isAuthenticatedGetter.value
      },
      {
        label: 'Menu',
        icon: 'pi pi-list',
        to: '/menu',
        visible: isAuthenticatedGetter.value
      },
      {
        label: 'Your order',
        icon: 'pi pi-shopping-cart',
        to: '/order',
        visible: isAuthenticatedGetter.value
      },
      {
        label: 'Log out',
        icon: 'pi pi-sign-out',
        command: logOut,
        visible: isAuthenticatedGetter.value
      },
      {
        label: 'Log in',
        icon: 'pi pi-sign-in',
        to: '/login',
        visible: !isAuthenticatedGetter.value
      },
      {
        label: 'Register',
        icon: 'pi pi-user-plus',
        to: '/register',
        visible: !isAuthenticatedGetter.value
      }
    ]);

    onMounted(() => {
      const nextRefreshTimestamp = computed<number | null>(
        () => store.getters.nextRefreshTimestamp
      ).value;

      if (nextRefreshTimestamp) {
        const timeout = nextRefreshTimestamp - new Date().getTime();
        store.dispatch('silentRefresh', timeout);
      }
    });

    onUnmounted(() => store.commit('setRefreshTimeout', null));

    watch(isAuthenticatedGetter, () =>
      menuItems.map((item) => {
        item.visible = !item.visible;
        return item;
      })
    );

    function logOut() {
      clearTimeout(refreshTimeoutId.value as number);
      store.commit('logOut');
      router.push('/login');
    }

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
  margin: 5.5rem auto 1.75rem auto;
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

.p-menubar {
  position: fixed;
  top: 0;
  width: 100%;
}

a.p-menubar-button {
  margin-left: auto;
}

.p-field-radiobutton > label {
  margin-left: 0;
  margin-right: 0.5rem;
}

.p-button[type='submit'] {
  width: unset;
  margin-left: 0.5rem;
}

.radio-label {
  margin-left: 0.5rem;
}
</style>
