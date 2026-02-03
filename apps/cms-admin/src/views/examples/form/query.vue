<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { ElCard, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';

const [Form] = useVbenForm({
  // 提交函数
  handleSubmit: onSubmit,
  // 水平布局，label和input在同一行
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
    {
      component: 'DatePicker',
      fieldName: 'date',
      label: '日期',
    },
  ],
  // 是否显示默认的操作按钮
  showDefaultActions: true,
  // 提交按钮参数
  submitButtonOptions: {
    text: '查询',
  },
  // 重置按钮参数
  resetButtonOptions: {
    text: '重置',
  },
  // 表单按钮位置
  actionWrapperClass: 'text-left',
});

function onSubmit(values: Record<string, any>) {
  ElMessage.success({
    message: `查询参数：${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Page title="Form 表单示例">
    <ElCard class="mb-4" header="查询表单">
      <Form />
    </ElCard>
  </Page>
</template>
