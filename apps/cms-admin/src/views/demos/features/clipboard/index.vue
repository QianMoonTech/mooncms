<script setup lang="ts">
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { useClipboard } from '@vueuse/core';
import { ElButton, ElCard, ElInput } from 'element-plus';

const source = ref('Hello');
const { copy, text } = useClipboard({ legacy: true, source });
</script>

<template>
  <Page title="剪切板示例">
    <ElCard>
      <template #header>基本使用</template>
      <p class="mb-3">
        Current copied: <code>{{ text || 'none' }}</code>
      </p>
      <div class="flex">
        <ElInput v-model="source" class="mr-3 flex w-[200px]" />
        <ElButton type="primary" @click="copy(source)"> Copy </ElButton>
      </div>
    </ElCard>
  </Page>
</template>
