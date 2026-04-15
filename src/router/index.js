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
      path: '/article/:id', 
      name: 'ArticleView', 
      component: () => import('../views/ArticleView.vue'),
      props: true
    }
  ],
})

export default router
