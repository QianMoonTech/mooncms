<script lang="ts" setup>
import { ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { ElInput, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';

const value = ref('');

const [Form] = useVbenForm({
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: 'KeepAlive测试：内部组件',
      },
      fieldName: 'field1',
      hideLabel: true,
      label: '字段1',
    },
  ],
  showDefaultActions: false,
});

const [Modal, modalApi] = useVbenModal({
  destroyOnClose: false,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    ElMessage.info('onConfirm');
    // modalApi.close();
  },
});
</script>
<template>
  <Modal append-to-main title="基础弹窗示例" title-tooltip="标题提示内容">
    <template #extra> extra </template>
    此弹窗指定在内容区域打开，并且在关闭之后弹窗内容不会被销毁
    <ElInput
      v-model="value"
      placeholder="KeepAlive测试:connectedComponent"
    />
    <Form />
  </Modal>
</template>
