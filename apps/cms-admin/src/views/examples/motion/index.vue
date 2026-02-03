<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { ElButton, ElCard } from 'element-plus';

const show = ref(true);
</script>
<template>
  <Page title="Motion 组件示例">
    <ElCard class="mb-4" header="基础示例">
      <ElButton type="primary" @click="show = !show">切换动画</ElButton>
      <div v-if="show"
        class="mt-4 flex h-20 w-full items-center justify-center bg-primary text-white"
      >
        Motion 动画组件
      </div>
    </ElCard>

    <ElCard class="mb-4" header="预设动画">
      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div class="flex-center h-20 bg-primary text-white">fade</div>
        <div class="flex-center h-20 bg-primary text-white">slide-up</div>
        <div class="flex-center h-20 bg-primary text-white">slide-down</div>
        <div class="flex-center h-20 bg-primary text-white">slide-left</div>
        <div class="flex-center h-20 bg-primary text-white">slide-right</div>
        <div class="flex-center h-20 bg-primary text-white">zoom</div>
        <div class="flex-center h-20 bg-primary text-white">bounce</div>
        <div class="flex-center h-20 bg-primary text-white">flip</div>
      </div>
    </ElCard>

    <ElCard class="mb-4" header="列表动画">
      <div class="mb-2 h-10 bg-muted">Item 1</div>
      <div class="mb-2 h-10 bg-muted">Item 2</div>
      <div class="mb-2 h-10 bg-muted">Item 3</div>
      <div class="h-10 bg-muted">Item 4</div>
    </ElCard>
  </Page>
</template>
