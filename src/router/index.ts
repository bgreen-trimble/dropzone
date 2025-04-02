import { createMemoryHistory, createRouter } from 'vue-router'
import DropZoneView from '@/views/DropZoneView.vue'
import GeneralSearchView from '@/views/GeneralSearchView.vue'

const routes = [
  { path: '/', component: DropZoneView },
  { path: '/search', component: GeneralSearchView },

]

const router = createRouter({
  history: createMemoryHistory(),
  routes,
})

export default router
