import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.path === from.path) return undefined
    return { top: 0 }
  },
  routes: [
    { path: '/', component: () => import('./pages/HomePage.vue') },
    { path: '/rank/:category(cpu|gpu|ram|storage|psu)', component: () => import('./pages/RankPage.vue') },
    { path: '/product/:category(cpu|gpu|ram|storage|psu)/:id', component: () => import('./pages/ProductPage.vue') },
    { path: '/compare', component: () => import('./pages/ComparePage.vue') },
    { path: '/guide', component: () => import('./pages/GuidePage.vue') },
    { path: '/methodology', component: () => import('./pages/MethodologyPage.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
