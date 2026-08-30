<script setup lang="ts">
import { useCatalog } from '@/data/load'
const catalog = useCatalog()
</script>

<template>
  <footer class="border-t border-line mt-10">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6 text-sm text-muted flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
      <div>
        数据更新：<span class="text-fg">{{ catalog.meta.updated || '—' }}</span>
        <span class="mx-2">·</span>
        <router-link to="/methodology" class="hover:text-fg underline underline-offset-4">方法论与数据来源</router-link>
      </div>
      <div>数据为静态快照，分数用于相对排序，不构成购买建议。</div>
    </div>
  </footer>
</template>
