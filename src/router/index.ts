import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';

import Home from '../views/Home.vue';
import AuthModuleState from '@/interfaces/auth-module-state';
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
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue')
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
