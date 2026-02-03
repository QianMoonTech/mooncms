<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { ElButton, ElCard, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';

const [Form, formApi] = useVbenForm({
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
      label: '字符串',
      rules: 'required',
    },
    {
      component: 'InputNumber',
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'number',
      label: '数字(带后缀)',
      suffix: () => '¥',
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
      label: '下拉选',
    },
    {
      component: 'DatePicker',
      fieldName: 'date',
      label: '日期',
    },
    {
      component: 'RangePicker',
      fieldName: 'range',
      label: '范围',
    },
    {
      component: 'Checkbox',
      componentProps: {
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
        ],
      },
      fieldName: 'checkbox',
      label: '多选框',
    },
    {
      component: 'Radio',
      componentProps: {
        options: [
          { label: '选项1', value: '1' },
          { label: '选项2', value: '2' },
        ],
      },
      fieldName: 'radio',
      label: '单选框',
    },
    {
      component: 'Switch',
      componentProps: {
        checkedChildren: '开启',
        unCheckedChildren: '关闭',
      },
      fieldName: 'switch',
      label: '开关',
    },
  ],
  // 是否显示默认的操作按钮
  showDefaultActions: true,
  // 提交按钮参数
  submitButtonOptions: {
    text: '提交',
  },
});

function onSubmit(values: Record<string, any>) {
  ElMessage.success({
    message: `提交成功：${JSON.stringify(values)}`,
  });
}

function setFormValues() {
  formApi.setValues({
    username: 'admin',
    number: 123,
    options: '1',
    date: new Date(),
    range: [new Date(), new Date()],
    checkbox: ['1'],
    radio: '1',
    switch: true,
  });
}

function setLoading() {
  // formApi.setState({ loading: true });
  setTimeout(() => {
    // formApi.setState({ loading: false });
  }, 2000);
}
</script>

<template>
  <Page title="Form 表单示例">
    <ElCard class="mb-4" header="表单 API">
      <div class="mb-4 flex gap-4">
        <ElButton type="primary" @click="setFormValues">设置表单值</ElButton>
        <ElButton type="primary" @click="setLoading">设置加载状态</ElButton>
      </div>
      <Form />
    </ElCard>
  </Page>
</template>
