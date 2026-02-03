<script lang="ts" setup>
import type { LoginExpiredModeType } from '@vben/types';

import { Page } from '@vben/common-ui';
import { preferences, updatePreferences } from '@vben/preferences';

import { ElButton, ElCard } from 'element-plus';

import { getMockStatusApi } from '#/api';

async function handleClick(type: LoginExpiredModeType) {
  const loginExpiredMode = preferences.app.loginExpiredMode;

  updatePreferences({ app: { loginExpiredMode: type } });
  await getMockStatusApi('401');
  updatePreferences({ app: { loginExpiredMode } });
}
</script>

<template>
  <Page title="登录过期演示">
    <template #description>
      <div class="mt-2 text-foreground/80">
        接口请求遇到401状态码时，需要重新登录。有两种方式：
        <p>1.转到登录页，登录成功后跳转回原页面</p>
        <p>
          2.弹出重新登录弹窗，登录后关闭弹窗，不进行任何页面跳转（刷新后还是会跳转登录页面）
        </p>
      </div>
    </template>

    <ElCard class="mb-5" header="跳转登录页面方式">
      <ElButton type="primary" @click="handleClick('page')"> 点击触发 </ElButton>
    </ElCard>
    <ElCard class="mb-5" header="登录弹窗方式">
      <ElButton type="primary" @click="handleClick('modal')"> 点击触发 </ElButton>
    </ElCard>
  </Page>
</template>
