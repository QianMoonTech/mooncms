<script lang="ts" setup>
import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { ElButton, ElCard, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';

const [Form, formApi] = useVbenForm({
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行
  layout: 'vertical',
  // 表单默认数据
  schema: [],
  // 是否显示默认的操作按钮
  showDefaultActions: true,
});

const fieldCount = ref(0);

function addField() {
  fieldCount.value++;
  const currentSchema = formApi.getState()?.schema || [];
  formApi.setState({
    schema: [
      ...currentSchema,
      {
        component: 'Input',
        componentProps: {
          placeholder: `请输入字段${fieldCount.value}`,
        },
        fieldName: `field${fieldCount.value}`,
        label: `字段${fieldCount.value}`,
      },
    ],
  });
}

function removeField() {
  if (fieldCount.value <= 0) return;
  const currentSchema = formApi.getState()?.schema || [];
  currentSchema.pop();
  formApi.setState({
    schema: [...currentSchema],
  });
  fieldCount.value--;
}

function onSubmit(values: Record<string, any>) {
  ElMessage.success({
    message: `提交成功：${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Page title="Form 表单示例">
    <ElCard class="mb-4" header="动态表单">
      <div class="mb-4 flex gap-4">
        <ElButton type="primary" @click="addField">添加字段</ElButton>
        <ElButton type="danger" @click="removeField">删除字段</ElButton>
      </div>
      <Form />
    </ElCard>
  </Page>
</template>
