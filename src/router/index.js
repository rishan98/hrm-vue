import AppLayout from '@/layout/AppLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue'),
                    meta: { requiresAuth: true, role: 'admin' }
                },
                {
                  path: '/user/dashboard',
                  name: 'dashboard',
                  component: () => import('@/views/UserDashboard.vue'),
                  meta: { requiresAuth: true, role: 'user' }
              },
                {
                    path: '/products',
                    name: 'products',
                    component: () => import('@/views/pages/products/ViewProducts.vue'),
                    meta: { requiresAuth: true, role: 'admin' }
                },
                {
                  path: '/create-product',
                  name: 'create-product',
                  component: () => import('@/views/pages/products/CreateProduct.vue'),
                  meta: { requiresAuth: true, role: 'admin' }
              }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
          path: '/auth/register',
          name: 'register',
          component: () => import('@/views/pages/auth/Register.vue')
      },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

// router.beforeEach((to, from, next) => {
    
//     if (to.matched.some(record => record.meta.requiresAuth)) {
      
//       if (!store.getters['authData/isAuthenticated']) { 
//         next({
//           path: '/auth/login',
//           query: { redirect: to.fullPath }
//         });
//       } else {
//         next();
//       }
//     } else {
//       next();
//     }
//   });
  router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters['authData/isAuthenticated'];
    const userRole = store.getters['authData/authRole'];
  
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        next('/auth/login'); // Redirect to login if not authenticated
      } else {
        const requiredRole = to.meta.role;
      
        if (requiredRole && requiredRole !== userRole) {
          next('/auth/access'); // Redirect to unauthorized page if role does not match
        } else {
          next(); // Proceed to route
        }
      }
    } else {
      next(); // Proceed to route if no authentication required
    }
  });
export default router;
