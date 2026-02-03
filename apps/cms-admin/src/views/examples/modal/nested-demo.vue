<script lang="ts" setup>
import { useVbenModal } from '@vben/common-ui';

import { ElButton, ElMessage } from 'element-plus';

const [Modal, modalApi] = useVbenModal({
  draggable: true,
  onCancel() {
    modalApi.close();
  },
  onConfirm() {
    ElMessage.info('onConfirm');
    // modalApi.close();
  },
  title: '嵌套弹窗示例',
});

const [InnerModal, innerModalApi] = useVbenModal({
  onCancel() {
    innerModalApi.close();
  },
  onConfirm() {
    ElMessage.info('内层弹窗 onConfirm');
    innerModalApi.close();
  },
  title: '内层弹窗',
});

function openInnerModal() {
  innerModalApi.open();
}
</script>
<template>
  <Modal>
    <InnerModal>
      <p>这是内层弹窗的内容</p>
    </InnerModal>
    <ElButton type="primary" @click="openInnerModal">打开内层弹窗</ElButton>
  </Modal>
</template>
