import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Students from '../views/Students.vue'

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/', redirect: '/students' },
  { path: '/students', name: 'Students', component: Students, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else {
    next()
  }
})

export default router
