import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import ModelDetail from '../views/ModelDetail.vue'
import Quiz from '../views/Quiz.vue'
import Profile from '../views/Profile.vue'
import Favorites from '../views/Favorites.vue'
import CheckIn from '../views/CheckIn.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { showTabbar: true }
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: Favorites,
    meta: { showTabbar: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { showTabbar: true }
  },
  {
    path: '/checkin',
    name: 'CheckIn',
    component: CheckIn,
    meta: { showTabbar: false }
  },
  {
    path: '/model/:id',
    name: 'ModelDetail',
    component: ModelDetail,
    meta: { showTabbar: false }
  },
  {
    path: '/quiz/:id',
    name: 'Quiz',
    component: Quiz,
    meta: { showTabbar: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
