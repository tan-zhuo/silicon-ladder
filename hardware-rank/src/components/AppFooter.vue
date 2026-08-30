<script setup lang="ts">
import { computed } from 'vue'
import { useCatalog } from '@/data/load'
import { useI18n } from '@/i18n'
import AppLogo from '@/components/AppLogo.vue'
import { catLabel } from '@/utils/format'
import { FORMS } from '@/utils/rank'
import type { Category } from '@/types/hardware'

const catalog = useCatalog()
const { t } = useI18n()
const year = new Date().getFullYear()
const CATS: Category[] = ['cpu', 'gpu', 'ram', 'storage', 'psu']
const total = computed(() => CATS.reduce((n, c) => n + catalog.byCategory(c).length, 0))
const REPO = 'https://github.com/tan-zhuo/silicon-ladder'
</script>

<template>
  <footer class="border-t border-line mt-16 bg-card2/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-8">
      <div class="grid gap-10 md:grid-cols-12">
        <!-- 品牌 -->
        <div class="md:col-span-4">
          <router-link to="/" class="flex items-center gap-2.5 font-semibold">
            <AppLogo :size="34" />
            <span class="leading-tight"><span class="block text-base">{{ t('site.name') }}</span><span class="block text-muted font-normal text-[11px] tracking-wide">{{ t('site.tagline') }}</span></span>
          </router-link>
          <p class="text-sm text-muted mt-4 leading-relaxed max-w-sm">{{ t('footerx.about') }}</p>
          <dl class="mt-5 grid grid-cols-3 gap-3 max-w-sm text-sm">
            <div><dt class="text-[11px] text-muted">{{ t('home.statItems') }}</dt><dd class="font-semibold">{{ total }}</dd></div>
            <div><dt class="text-[11px] text-muted">{{ t('footerx.dataVersion') }}</dt><dd class="font-semibold">v{{ catalog.meta.version }}</dd></div>
            <div><dt class="text-[11px] text-muted">{{ t('home.statUpdated') }}</dt><dd class="font-semibold">{{ catalog.meta.updated || '—' }}</dd></div>
          </dl>
        </div>

        <!-- 排行榜 -->
        <div class="md:col-span-3">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-muted mb-3">{{ t('footerx.rankings') }}</h3>
          <ul class="space-y-2 text-sm">
            <li v-for="c in CATS" :key="c" class="flex flex-wrap items-baseline gap-x-2">
              <router-link :to="`/rank/${c}`" class="font-medium hover:text-accent">{{ catLabel(c) }}</router-link>
              <span class="text-xs text-muted">
                <template v-for="(f, i) in FORMS[c]" :key="f.key">
                  <span v-if="i" class="mx-1 opacity-50">/</span>
                  <router-link :to="{ path: `/rank/${c}`, query: { form: f.key } }" class="hover:text-accent">{{ t('form.' + f.key) }}</router-link>
                </template>
              </span>
            </li>
          </ul>
        </div>

        <!-- 天梯 -->
        <div class="md:col-span-2">
          <h3 class="text-xs font-semibold uppercase tracking-widest text-muted mb-3">{{ t('footerx.ladders') }}</h3>
          <ul class="space-y-2 text-sm">
            <li><router-link :to="{ path: '/rank/cpu', query: { view: 'ladder' } }" class="hover:text-accent">{{ t('footerx.desktop') }} CPU</router-link></li>
            <li><router-link :to="{ path: '/rank/cpu', query: { view: 'ladder', form: 'laptop' } }" class="hover:text-accent">{{ t('footerx.laptop') }} CPU</router-link></li>
            <li><router-link :to="{ path: '/rank/gpu', query: { view: 'ladder' } }" class="hover:text-accent">{{ t('footerx.desktop') }} GPU</router-link></li>
            <li><router-link :to="{ path: '/rank/gpu', query: { view: 'ladder', form: 'laptop' } }" class="hover:text-accent">{{ t('footerx.laptop') }} GPU</router-link></li>
            <li><router-link :to="{ path: '/rank/gpu', query: { view: 'ladder', form: 'igpu' } }" class="hover:text-accent">{{ t('footerx.igpu') }}</router-link></li>
          </ul>
        </div>

        <!-- 工具 / 资源 -->
        <div class="md:col-span-3 grid grid-cols-2 gap-6">
          <div>
            <h3 class="text-xs font-semibold uppercase tracking-widest text-muted mb-3">{{ t('footerx.tools') }}</h3>
            <ul class="space-y-2 text-sm">
              <li><router-link to="/compare" class="hover:text-accent">{{ t('nav.compare') }}</router-link></li>
              <li><router-link to="/guide" class="hover:text-accent">{{ t('nav.guide') }}</router-link></li>
              <li><router-link to="/methodology" class="hover:text-accent">{{ t('nav.methodology') }}</router-link></li>
            </ul>
          </div>
          <div>
            <h3 class="text-xs font-semibold uppercase tracking-widest text-muted mb-3">{{ t('footerx.resources') }}</h3>
            <ul class="space-y-2 text-sm">
              <li><a :href="REPO" target="_blank" rel="noopener" class="hover:text-accent inline-flex items-center gap-1">{{ t('footerx.github') }}<svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg></a></li>
              <li><a :href="`${REPO}/tree/main/hardware-rank/public/data`" target="_blank" rel="noopener" class="hover:text-accent">{{ t('footerx.data') }}</a></li>
              <li><a href="/sitemap.xml" class="hover:text-accent">{{ t('footerx.sitemap') }}</a></li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 底栏 -->
      <div class="mt-10 pt-6 border-t border-line text-xs text-muted space-y-1.5">
        <p>{{ t('footer.disclaimer') }} {{ t('footerx.noAffiliation') }}</p>
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <span>{{ t('footerx.copyright', { y: year }) }}</span>
          <span>{{ t('footerx.builtWith') }}</span>
        </div>
      </div>
    </div>
  </footer>
</template>
