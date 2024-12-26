import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import weatherDetails from '../views/weatherDetails.vue'
import userProfile from '../views/userProfile.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/details/:id',
      name: 'details',
      component: weatherDetails,
    },
    {
      path: '/profile',
      name: 'profile',
      component: userProfile,
    },
  ],
})

export default router
