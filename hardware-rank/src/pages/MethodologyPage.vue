<script setup lang="ts">
import { useCatalog } from '@/data/load'
import { useI18n, locale } from '@/i18n'
import { useSeo } from '@/seo'
import { METHOD, type L3 } from '@/content/methodology'
const catalog = useCatalog()
const { t } = useI18n()
const p = (v?: L3) => (v ? v[locale.value === 'en' ? 1 : locale.value === 'ja' ? 2 : 0] : '')
useSeo(() => ({ title: t('method.title'), description: t('method.p1a'), path: '/methodology' }))
</script>

<template>
  <div class="grid lg:grid-cols-[14rem_1fr] gap-8">
    <aside class="hidden lg:block">
      <nav class="sticky top-24 space-y-1 text-sm">
        <a v-for="s in METHOD" :key="s.id" :href="'#' + s.id" class="block px-3 py-1.5 rounded-lg text-muted hover:text-fg hover:bg-card2">{{ p(s.title) }}</a>
      </nav>
    </aside>
    <article class="max-w-3xl space-y-8 min-w-0">
      <div>
        <div class="kicker">{{ t('nav.methodology') }}</div>
        <h1 class="text-2xl sm:text-3xl font-bold tracking-tight mt-1">{{ t('method.title') }}</h1>
        <p class="text-sm text-muted mt-1">{{ t('method.version', { v: catalog.meta.version, d: catalog.meta.updated }) }} · {{ catalog.meta.note }}</p>
        <nav class="mt-3 flex flex-wrap gap-2 lg:hidden"><a v-for="s in METHOD" :key="s.id" :href="'#' + s.id" class="pill !h-8 !text-xs">{{ p(s.title) }}</a></nav>
      </div>
      <section v-for="s in METHOD" :id="s.id" :key="s.id" class="card p-5 space-y-3 scroll-mt-20">
        <h2 class="font-bold text-lg">{{ p(s.title) }}</h2>
        <template v-for="(b, i) in s.blocks" :key="i">
          <p v-if="b.type === 'p'" class="text-sm leading-relaxed">{{ p(b.text) }}</p>
          <pre v-else-if="b.type === 'code'" class="bg-card2 border border-line rounded-lg p-3 text-sm overflow-x-auto whitespace-pre">{{ p(b.text) }}</pre>
          <div v-else-if="b.type === 'table'" class="-mx-1">
            <table class="w-full text-sm">
              <thead class="text-xs text-muted"><tr><th v-for="h in b.head" :key="p(h)" class="text-left px-2 py-2">{{ p(h) }}</th></tr></thead>
              <tbody><tr v-for="(row, ri) in b.rows" :key="ri" class="border-t border-line/60 align-top"><td v-for="(c, ci) in row" :key="ci" class="px-2 py-2" :class="ci === 0 ? 'font-semibold' : ''">{{ p(c) }}</td></tr></tbody>
            </table>
          </div>
          <ul v-else-if="b.type === 'list'" class="text-sm space-y-1.5 list-disc pl-5"><li v-for="it in b.items" :key="p(it)">{{ p(it) }}</li></ul>
          <dl v-else-if="b.type === 'kv'" class="divide-y divide-line/60 text-sm">
            <div v-for="[k, v] in b.kv" :key="p(k)" class="py-2 grid sm:grid-cols-[11rem_1fr] gap-1 sm:gap-4"><dt class="font-semibold">{{ p(k) }}</dt><dd class="text-muted">{{ p(v) }}</dd></div>
          </dl>
        </template>
      </section>
    </article>
  </div>
</template>
