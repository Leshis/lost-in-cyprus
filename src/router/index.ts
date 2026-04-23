import { createRouter, createWebHashHistory } from 'vue-router'
import { supabase } from '@/supabase';

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
      path: '/gate',
      name: 'Admin',
      component: () => import('../views/AdminView.vue'),
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
  const { data: { session } } = await supabase.auth.getSession();

  // If the route requires auth and there is no session...
  if (to.meta.requiresAuth && !session) {
    // Return the path you want to redirect to
    return '/login';
  }

  // If the user is logged in and tries to go to the login page...
  if (to.path === '/login' && session) {
    // Redirect them to the secret gate instead
    return '/gate';
  }

  // Otherwise, returning nothing (or undefined) allows the navigation
  return true;
});

export default router
