<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { ElButton, ElCard } from 'element-plus';
</script>
<template>
  <Page title="Tippy 提示示例">
    <ElCard class="mb-4" header="基础示例">
      <div class="flex gap-4">
        <ElButton v-tippy="'这是一个提示'">悬停查看提示</ElButton>
        <ElButton v-tippy="{ content: '自定义提示', placement: 'bottom' }">
          底部提示
        </ElButton>
        <ElButton v-tippy="{ content: '点击触发', trigger: 'click' }">
          点击触发
        </ElButton>
      </div>
    </ElCard>

    <ElCard class="mb-4" header="不同位置">
      <div class="flex flex-wrap gap-4">
        <ElButton v-tippy="{ content: '顶部', placement: 'top' }">顶部</ElButton>
        <ElButton v-tippy="{ content: '底部', placement: 'bottom' }">
          底部
        </ElButton>
        <ElButton v-tippy="{ content: '左侧', placement: 'left' }">左侧</ElButton>
        <ElButton v-tippy="{ content: '右侧', placement: 'right' }">
          右侧
        </ElButton>
      </div>
    </ElCard>

    <ElCard class="mb-4" header="HTML 内容">
      <ElButton
        v-tippy="{
          content: '<strong>粗体文字</strong><br/>换行内容',
          allowHTML: true,
        }"
      >
        HTML 内容
      </ElButton>
    </ElCard>
  </Page>
</template>
