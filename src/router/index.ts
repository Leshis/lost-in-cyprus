import { createRouter, createWebHashHistory } from 'vue-router'
import { supabaseAdmin } from '@/supabaseAdmin'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      name: 'home', 
      component: () => import('../views/HomeView.vue')  
    },
    { 
      path: '/article/:slug', 
      name: 'ArticleView', 
      component: () => import('../views/ArticleView.vue'),
      props: true
    },
    {
      path: '/about',
      name: 'About Me',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/contact',
      name: 'Contact',
      component: () => import('../views/ContactView.vue')
    },
    {
      path: '/gate',
      name: 'Admin',
      component: () => import('../views/AdminView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/gate/preview/:slug',
      name: 'ArticlePreview',
      component: () => import('../views/ArticleView.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/LoginView.vue')
    }
  ],
})

router.beforeEach(async (to) => {
  const { data: { session } } = await supabaseAdmin.auth.getSession();

  if (to.meta.requiresAuth && !session) {
    return '/login';
  }

  if (to.path === '/login' && session) {
    return '/gate';
  }

  return true;
});

export default router;
