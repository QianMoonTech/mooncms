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
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入用户名',
      },
      // 字段名
      fieldName: 'username',
      // 界面显示的label
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
});

function onSubmit(values: Record<string, any>) {
  ElMessage.success({
    message: `提交成功：${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Page title="Form 表单示例">
    <ElCard class="mb-4" header="基础示例">
      <Form />
    </ElCard>
  </Page>
</template>
