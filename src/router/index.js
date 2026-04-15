import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      name: 'home', 
      component: () => import('../views/HomeView.vue')  
    },
    { 
      path: '/limassol', 
      name: 'limassol', 
      // This is a "Lazy Load" import—it's another way to do it!
      component: () => import('../views/LimassolView.vue') 
    }
  ],
})

export default router
