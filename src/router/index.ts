import { createMemoryHistory, createRouter } from 'vue-router'
import GeneralSearchView from '@/views/GeneralSearchView.vue'

const routes = [
  { path: '/', component: GeneralSearchView },
]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
