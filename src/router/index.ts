import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Home from '../views/Home.vue';
import AuthModuleState from '@/interfaces/states/auth-module';
import store from '@/store';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/auth/Register.vue')
  },
  {
    path: '/login',
    name: 'LogIn',
    component: () => import('../views/auth/LogIn.vue')
  },
  {
    path: '/menu',
    component: () => import('../views/menu/Index.vue'),
    children: [
      {
        path: '',
        name: 'ShowMenu',
        component: () => import('../views/menu/Show.vue')
      },
      {
        path: 'add',
        name: 'AddProduct',
        component: () => import('../views/menu/Add.vue')
      },
      {
        path: ':productId/update',
        name: 'UpdateProduct',
        component: () => import('../views/menu/Update.vue')
      }
    ]
  },
  {
    path: '/orders',
    component: () => import('../views/orders/Index.vue'),
    children: [
      {
        path: '',
        name: 'ShowOrders',
        component: () => import('../views/orders/ShowTable.vue')
      },
      {
        path: 'summary',
        name: 'CurrentOrderSummary',
        component: () => import('../views/orders/CurrentSummary.vue')
      },
      {
        path: ':orderId',
        name: 'ShowOrder',
        component: () => import('../views/orders/ShowWithId.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const state = store.state.auth as AuthModuleState;
  const isAuthenticated = !!state.accessToken && !!state.currentUser;

  if (!['LogIn', 'Register'].includes(to.name as string) && !isAuthenticated) {
    return next({ name: 'LogIn' });
  } else {
    return next();
  }
});

export default router;
