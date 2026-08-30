import { createRouter, createWebHistory } from 'vue-router'
import { locale, setLocale, localizePath, type Locale } from './i18n'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, saved) {
    if (saved) return saved
    if (to.path === from.path) return undefined
    return { top: 0 }
  },
  routes: [
    { path: '/:lang(en|ja)?', component: () => import('./pages/HomePage.vue') },
    { path: '/:lang(en|ja)?/rank/:category(cpu|gpu|ram|storage|psu)', component: () => import('./pages/RankPage.vue') },
    { path: '/:lang(en|ja)?/product/:category(cpu|gpu|ram|storage|psu)/:id', component: () => import('./pages/ProductPage.vue') },
    { path: '/:lang(en|ja)?/compare', component: () => import('./pages/ComparePage.vue') },
    { path: '/:lang(en|ja)?/guide', component: () => import('./pages/GuidePage.vue') },
    { path: '/:lang(en|ja)?/methodology', component: () => import('./pages/MethodologyPage.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

/** URL 语言前缀是唯一真相：有前缀则同步 locale；无前缀而当前 locale 非中文则补前缀 */
router.beforeEach((to) => {
  const urlLang = (Array.isArray(to.params.lang) ? to.params.lang[0] : to.params.lang) as Locale | undefined
  if (urlLang) { if (locale.value !== urlLang) setLocale(urlLang); return true }
  if (locale.value !== 'zh') return { path: localizePath(to.path, locale.value), query: to.query, hash: to.hash, replace: true }
  return true
})

export default router
