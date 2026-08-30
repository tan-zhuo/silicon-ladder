<script setup lang="ts">
import { useCatalog } from '@/data/load'
import { useI18n } from '@/i18n'
import { useSeo } from '@/seo'
const catalog = useCatalog()
const { t } = useI18n()

useSeo(() => ({ title: t('method.title'), description: t('method.p1a'), path: '/methodology' }))
</script>

<template>
  <article class="max-w-3xl space-y-6">
    <div>
      <div class="kicker">{{ t('nav.methodology') }}</div>
      <h1 class="text-2xl sm:text-3xl font-bold tracking-tight mt-1">{{ t('method.title') }}</h1>
      <p class="text-sm text-muted mt-1">{{ t('method.version', { v: catalog.meta.version, d: catalog.meta.updated }) }}</p>
    </div>
    <section class="card p-5 space-y-2"><h2 class="font-bold">{{ t('method.h1') }}</h2><p class="text-sm">{{ t('method.p1a') }}</p><p class="text-sm text-muted">{{ catalog.meta.note }}</p><p class="text-sm">{{ t('method.p1b') }}</p></section>
    <section class="card p-5 space-y-2"><h2 class="font-bold">{{ t('method.h2') }}</h2><p class="text-sm">{{ t('method.p2') }}</p></section>
    <section class="card p-5 space-y-2">
      <h2 class="font-bold">{{ t('method.h3') }}</h2><p class="text-sm">{{ t('method.p3a') }}</p>
      <pre class="bg-card2 border border-line rounded-lg p-3 text-sm overflow-x-auto">rel(x) = round(x / max(pool) × 1000) / 10</pre>
      <p class="text-sm text-muted">{{ t('method.p3b') }}</p>
    </section>
    <section class="card p-5 space-y-3">
      <h2 class="font-bold">{{ t('method.h4') }}</h2><p class="text-sm text-muted">{{ t('method.p4') }}</p>
      <div class="text-sm space-y-2">
        <div v-for="n in 6" :key="n"><span class="text-accent font-semibold">{{ t(`method.w${n}`) }}</span>：{{ t(`method.w${n}d`) }}</div>
      </div>
    </section>
    <section class="card p-5 space-y-2"><h2 class="font-bold">{{ t('method.h5') }}</h2><p class="text-sm">{{ t('method.p5') }}</p></section>
    <section class="card p-5 space-y-2"><h2 class="font-bold">{{ t('method.h6') }}</h2><p class="text-sm text-muted">{{ t('method.p6') }}</p></section>
  </article>
</template>
