<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { ElCard, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';

const [Form] = useVbenForm({
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行
  layout: 'vertical',
  // 表单默认数据
  schema: Array.from({ length: 20 }, (_, i) => ({
    component: 'Input',
    componentProps: {
      placeholder: `请输入字段${i + 1}`,
    },
    fieldName: `field${i + 1}`,
    label: `字段${i + 1}`,
    rules: 'required',
  })),
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
    <ElCard class="mb-4" header="滚动到错误字段">
      <Form />
    </ElCard>
  </Page>
</template>
