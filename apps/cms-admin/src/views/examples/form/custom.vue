<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { ElCard, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';

import TwoFields from './modules/two-fields.vue';

const [Form] = useVbenForm({
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行
  layout: 'vertical',
  // 表单默认数据
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名',
      },
      fieldName: 'username',
      label: '用户名',
      rules: 'required',
    },
    {
      // 自定义组件
      component: TwoFields,
      fieldName: 'twoFields',
      label: '自定义组件',
    },
  ],
  // 是否显示默认的操作按钮
  showDefaultActions: true,
});

function onSubmit(values: Record<string, any>) {
  ElMessage.success({
    message: `提交成功：${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Page title="Form 表单示例">
    <ElCard class="mb-4" header="自定义组件">
      <Form />
    </ElCard>
  </Page>
</template>
