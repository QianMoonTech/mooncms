<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { ElCard, ElMessage } from 'element-plus';

import { useVbenForm, z } from '#/adapter/form';

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
      component: 'Input',
      componentProps: {
        placeholder: '请输入邮箱',
      },
      fieldName: 'email',
      label: '邮箱',
      rules: 'email',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入年龄',
      },
      fieldName: 'age',
      label: '年龄',
      rules: z.number().min(0, '年龄不能小于0').max(120, '年龄不能超过120'),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入手机号',
      },
      fieldName: 'phone',
      label: '手机号',
      rules: z.string().regex(/^1[3-9]\d{9}$/, '请输入正确的手机号'),
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
    <ElCard class="mb-4" header="表单验证">
      <Form />
    </ElCard>
  </Page>
</template>
