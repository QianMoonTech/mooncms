<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { ElCard } from 'element-plus';
</script>

<template>
  <Page auto-content-height title="列布局页面示例">
    <ElCard class="mb-4" header="列布局">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div class="h-32 bg-muted">列 1</div>
        <div class="h-32 bg-muted">列 2</div>
        <div class="h-32 bg-muted">列 3</div>
        <div class="h-32 bg-muted">列 4</div>
        <div class="h-32 bg-muted">列 5</div>
        <div class="h-32 bg-muted">列 6</div>
      </div>
    </ElCard>
  </Page>
</template>
