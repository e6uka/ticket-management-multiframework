import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../utils/auth';

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/Landing.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/signup',
    name: 'Signup',
    component: () => import('../views/Signup.vue')
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../views/Dashboard.vue'),
    beforeEnter: (to, from, next) => {
      if (auth.isAuthenticated()) {
        next();
        } else {
        next('/login');
      }
    }
  },
  {
    path: '/tickets',
    name: 'Tickets',
    component: () => import('../views/Tickets.vue'),
    beforeEnter: (to, from, next) => {
      if (auth.isAuthenticated()) {
        next();
        } else {
        next('/login');
      }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
