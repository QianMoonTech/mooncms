<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { ElCard, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';

const [Form] = useVbenForm({
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行
  layout: 'horizontal',
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
      component: 'InputPassword',
      componentProps: {
        placeholder: '请输入密码',
      },
      fieldName: 'password',
      label: '密码',
      rules: 'required',
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
        ],
        placeholder: '请选择',
      },
      fieldName: 'options',
      label: '选项',
    },
  ],
  // 是否显示默认的操作按钮
  showDefaultActions: true,
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});

function onSubmit(values: Record<string, any>) {
  ElMessage.success({
    message: `提交成功：${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Page title="Form 表单示例">
    <ElCard class="mb-4" header="自定义布局">
      <Form />
    </ElCard>
  </Page>
</template>
