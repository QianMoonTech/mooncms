<script setup lang="ts">
import { Page } from '@vben/common-ui';

import { refAutoReset } from '@vueuse/core';
import { ElButton, ElCard, ElEmpty } from 'element-plus';

import ConcurrencyCaching from './concurrency-caching.vue';
import InfiniteQueries from './infinite-queries.vue';
import PaginatedQueries from './paginated-queries.vue';
import QueryRetries from './query-retries.vue';

const showCaching = refAutoReset(true, 1000);
</script>

<template>
  <Page title="Vue Query示例">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <ElCard>
        <template #header>分页查询</template>
        <PaginatedQueries />
      </ElCard>
      <ElCard>
        <template #header>无限滚动</template>
        <InfiniteQueries class="h-[300px] overflow-auto" />
      </ElCard>
      <ElCard>
        <template #header>错误重试</template>
        <QueryRetries />
      </ElCard>
      <ElCard
        v-loading="!showCaching"
        :body-style="{ minHeight: '330px' }"
      >
        <template #header>
          <div class="flex items-center justify-between">
            <span>并发和缓存</span>
            <ElButton size="small" @click="showCaching = false">重新加载</ElButton>
          </div>
        </template>
        <ConcurrencyCaching v-if="showCaching" />
        <ElEmpty v-else description="正在加载..." />
      </ElCard>
    </div>
  </Page>
</template>
