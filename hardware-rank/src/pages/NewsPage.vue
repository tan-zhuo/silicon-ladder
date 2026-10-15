<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCatalog } from '@/data/load'
import { useI18n } from '@/i18n'
import { useSeo } from '@/seo'
import BrandLogo from '@/components/BrandLogo.vue'

const catalog = useCatalog()
const { t } = useI18n()
const brand = ref('')
const brands = computed(() => [...new Set(catalog.news.items.map((i) => i.brand))])
const items = computed(() => catalog.news.items.filter((i) => !brand.value || i.brand === brand.value))
const groups = computed(() => {
  const out: { date: string; items: typeof catalog.news.items }[] = []
  for (const it of items.value) { const g = out.find((x) => x.date === it.date); if (g) g.items.push(it); else out.push({ date: it.date, items: [it] }) }
  return out
})
useSeo(() => ({
  title: t('news.title'),
  description: t('news.sub'),
  path: '/news',
  jsonLd: [{ '@context': 'https://schema.org', '@type': 'ItemList', name: t('news.title'), itemListElement: catalog.news.items.slice(0, 30).map((i, n) => ({ '@type': 'ListItem', position: n + 1, name: i.title, url: i.url })) }],
}))
</script>

<template>
  <div class="space-y-5">
    <div>
      <div class="kicker">{{ t('nav.news') }}</div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight mt-1">{{ t('news.title') }}</h1>
      <p class="text-sm text-muted mt-1 max-w-3xl">{{ t('news.sub') }} <span v-if="catalog.news.updated">{{ t('news.updated') }} {{ catalog.news.updated }}。</span></p>
    </div>

    <div class="flex flex-wrap items-center gap-1.5">
      <button class="pill !h-8 !text-xs" :class="{ 'pill-active': !brand }" @click="brand = ''">{{ t('news.all') }}</button>
      <button v-for="b in brands" :key="b" class="pill !h-8 !text-xs inline-flex items-center gap-1.5" :class="{ 'pill-active': brand === b }" @click="brand = b">
        <BrandLogo :brand="b" :size="14" />{{ b }}
      </button>
    </div>

    <div v-if="!items.length" class="card p-12 text-center text-muted">{{ t('news.empty') }}</div>

    <div v-else class="space-y-5">
      <section v-for="g in groups" :key="g.date">
        <div class="text-xs font-semibold text-muted tracking-wider mb-2 tabular-nums">{{ g.date }}</div>
        <div class="card divide-y divide-line/60">
          <a
            v-for="it in g.items" :key="it.id" :href="it.url" target="_blank" rel="noopener"
            class="flex items-center gap-3.5 px-4 sm:px-5 py-3.5 group hover:bg-accent/[.04] transition-colors"
            :title="t('news.visit')"
          >
            <BrandLogo :brand="it.brand" :size="22" />
            <div class="flex-1 min-w-0">
              <div class="font-medium leading-snug group-hover:text-accent">{{ it.title }}</div>
              <div class="text-[11px] text-muted mt-0.5">{{ it.source }}</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" class="text-muted shrink-0 group-hover:text-accent"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
          </a>
        </div>
      </section>
    </div>

    <p class="text-xs text-muted">{{ t('news.intelNote') }} {{ t('news.legal') }}</p>
  </div>
</template>
