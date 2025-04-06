import { createMemoryHistory, createRouter } from 'vue-router'
import GeneralSearchView from '@/views/GeneralSearchView.vue'
import AboutView from '@/views/AboutView.vue'

const routes = [
  { path: '/', component: GeneralSearchView },
  { path: '/about', component: AboutView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
