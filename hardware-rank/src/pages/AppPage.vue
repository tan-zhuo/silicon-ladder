<script setup lang="ts">
import { useI18n, tm } from '@/i18n'
import { useSeo, breadcrumb } from '@/seo'
import PhoneMock from '@/components/PhoneMock.vue'
import { useCatalog } from '@/data/load'

const { t, locale } = useI18n()
const catalog = useCatalog()
const REPO = 'https://github.com/tan-zhuo/silicon-ladder'
const list = (k: string) => (locale.value, tm<string[]>(k) ?? [])
const faq = () => (locale.value, tm<[string, string][]>('app.faq') ?? [])
const features = ['f1', 'f2', 'f3', 'f4']
const ICONS: Record<string, string> = {
  f1: 'M4 6h16M4 12h10M4 18h6', f2: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18', f3: 'M6 8a6 6 0 0112 0v5l2 3H4l2-3zM10 20h4', f4: 'M4 7h16v10H4zM8 7V4h8v3',
}
useSeo(() => ({
  title: `${t('app.title')} · ${t('app.soon')}`,
  description: t('app.sub'),
  path: '/app',
  jsonLd: [breadcrumb([{ name: t('product.home'), path: '/' }, { name: t('app.title'), path: '/app' }])],
}))
</script>

<template>
  <div class="space-y-10">
    <!-- Hero -->
    <section class="hero relative rounded-lg border border-line overflow-hidden shadow-sm px-6 sm:px-12 py-10 sm:py-14">
      <div class="relative z-[1] grid lg:grid-cols-[1fr_auto] gap-10 items-center">
        <div class="max-w-xl">
          <div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full bg-accent" /><span class="kicker">{{ t('app.kicker') }}</span></div>
          <h1 class="t-display mt-4">{{ t('app.title') }}</h1>
          <p class="mt-5 text-muted text-[15px] sm:text-[17px] leading-relaxed">{{ t('app.sub') }}</p>
          <div class="mt-7 flex flex-wrap gap-2.5">
            <span v-for="s in ['ios', 'android', 'apk']" :key="s" class="store-badge" aria-disabled="true">
              <svg v-if="s === 'ios'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M16.4 12.6c0-2.3 1.9-3.4 2-3.5-1.1-1.6-2.8-1.8-3.4-1.8-1.4-.1-2.8.9-3.5.9-.7 0-1.8-.8-3-.8-1.5 0-3 .9-3.8 2.3-1.6 2.8-.4 7 1.2 9.3.8 1.1 1.7 2.4 2.9 2.3 1.2 0 1.6-.8 3-.8s1.8.8 3 .7c1.3 0 2.1-1.1 2.8-2.3.9-1.3 1.3-2.6 1.3-2.6s-2.5-1-2.5-3.7zM14.1 5.8c.6-.8 1.1-1.9.9-3-.9.1-2.1.6-2.7 1.4-.6.7-1.1 1.8-1 2.9 1.1.1 2.1-.5 2.8-1.3z" /></svg>
              <svg v-else-if="s === 'android'" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 9.5l1.6-2.8a.4.4 0 00-.7-.4l-1.6 2.9A9.4 9.4 0 0012 8.2c-1.7 0-3.3.4-4.8 1L5.6 6.3a.4.4 0 00-.7.4l1.6 2.8A8.6 8.6 0 002 17h20a8.6 8.6 0 00-4.5-7.5zM7.5 14a1 1 0 110-2 1 1 0 010 2zm9 0a1 1 0 110-2 1 1 0 010 2z" /></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
              <span class="leading-tight"><span class="block t-overline text-faint !text-[9px]">{{ t('app.soon') }}</span><span class="block text-sm font-semibold">{{ t('app.' + s) }}</span></span>
            </span>
          </div>
          <p class="mt-4 text-xs text-faint num">{{ t('footer.updated') }}{{ catalog.meta.updated }} · v{{ catalog.meta.version }}</p>
        </div>
        <div class="hidden lg:block justify-self-end rotate-[-4deg] translate-y-2"><PhoneMock /></div>
      </div>
    </section>

    <!-- Features -->
    <section class="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <div v-for="f in features" :key="f" class="card p-5">
        <div class="w-10 h-10 rounded-sm bg-card2 border border-line flex items-center justify-center mb-4"><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path :d="ICONS[f]" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" /></svg></div>
        <div class="t-h3">{{ t(`app.${f}t`) }}</div>
        <p class="text-sm text-muted mt-1.5 leading-relaxed">{{ t(`app.${f}d`) }}</p>
      </div>
    </section>

    <!-- PWA now -->
    <section class="card p-6 sm:p-8">
      <div class="max-w-2xl">
        <div class="kicker">PWA</div>
        <h2 class="t-h2 mt-2">{{ t('app.nowTitle') }}</h2>
        <p class="text-sm text-muted mt-2 leading-relaxed">{{ t('app.nowDesc') }}</p>
      </div>
      <div class="grid md:grid-cols-2 gap-4 mt-6">
        <div v-for="os in ['ios', 'android']" :key="os" class="rounded-md border border-line bg-card2/60 p-5">
          <div class="t-h3 mb-3">{{ t(`app.${os}Title`) }}</div>
          <ol class="space-y-2.5">
            <li v-for="(s, i) in list(`app.${os}Steps`)" :key="i" class="flex items-start gap-3 text-sm">
              <span class="num w-6 h-6 rounded-sm bg-inverse text-inverseFg text-xs font-semibold inline-flex items-center justify-center shrink-0">{{ i + 1 }}</span>
              <span class="pt-0.5">{{ s }}</span>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- Notify + FAQ -->
    <section class="grid lg:grid-cols-3 gap-4">
      <div class="card p-6 lg:col-span-1">
        <h2 class="t-h3">{{ t('app.notifyTitle') }}</h2>
        <p class="text-sm text-muted mt-2 leading-relaxed">{{ t('app.notifyDesc') }}</p>
        <a :href="REPO" target="_blank" rel="noopener" class="btn mt-5 inline-flex">{{ t('app.notifyCta') }}<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg></a>
      </div>
      <div class="card p-6 lg:col-span-2">
        <h2 class="t-h3 mb-2">{{ t('app.faqTitle') }}</h2>
        <dl class="divide-y divide-line">
          <div v-for="[q, a] in faq()" :key="q" class="py-3.5">
            <dt class="font-medium text-sm">{{ q }}</dt>
            <dd class="text-sm text-muted mt-1 leading-relaxed">{{ a }}</dd>
          </div>
        </dl>
      </div>
    </section>
  </div>
</template>

<style scoped>
.store-badge { display: inline-flex; align-items: center; gap: 10px; height: 48px; padding: 0 16px 0 14px; border-radius: var(--r-sm); border: 1px solid rgb(var(--c-line-2)); background: rgb(var(--c-surface)); color: rgb(var(--c-fg)); box-shadow: var(--shadow-sm); opacity: .9; cursor: default; }
</style>
