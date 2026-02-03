<script lang="ts" setup>
import { Page, useVbenModal } from '@vben/common-ui';

import { ElButton, ElCard } from 'element-plus';

import DocButton from '../doc-button.vue';
import AutoHeightDemo from './auto-height-demo.vue';
import BaseDemo from './base-demo.vue';
import BlurDemo from './blur-demo.vue';
import DragDemo from './drag-demo.vue';
import DynamicDemo from './dynamic-demo.vue';
import FormModalDemo from './form-modal-demo.vue';
import InContentDemo from './in-content-demo.vue';
import NestedDemo from './nested-demo.vue';
import SharedDataDemo from './shared-data-demo.vue';

defineOptions({ name: 'ModalExample' });

const [BaseModal, baseModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: BaseDemo,
});

const [InContentModal, inContentModalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: InContentDemo,
});

const [AutoHeightModal, autoHeightModalApi] = useVbenModal({
  connectedComponent: AutoHeightDemo,
});

const [DynamicModal, dynamicModalApi] = useVbenModal({
  connectedComponent: DynamicDemo,
});

const [SharedDataModal, sharedModalApi] = useVbenModal({
  connectedComponent: SharedDataDemo,
});

const [FormModal, formModalApi] = useVbenModal({
  connectedComponent: FormModalDemo,
});

const [NestedModal, nestedModalApi] = useVbenModal({
  connectedComponent: NestedDemo,
});

const [BlurModal, blurModalApi] = useVbenModal({
  connectedComponent: BlurDemo,
});

const [DragModal, dragModalApi] = useVbenModal({
  connectedComponent: DragDemo,
});

function openBaseModal() {
  baseModalApi.open();
}

function openInContentModal() {
  inContentModalApi.open();
}

function openAutoHeightModal() {
  autoHeightModalApi.open();
}

function openDynamicModal() {
  dynamicModalApi.open();
}

function handleUpdateTitle() {
  dynamicModalApi.setState({ title: '外部动态标题' }).open();
}

function openSharedModal() {
  sharedModalApi
    .setData({
      content: '外部传递的数据 content',
      payload: '外部传递的数据 payload',
    })
    .open();
}

function openFormModal() {
  formModalApi
    .setData({
      // 表单值
      values: { field1: 'abc', field2: '123' },
    })
    .open();
}

function openNestedModal() {
  nestedModalApi.open();
}

function openBlurModal() {
  blurModalApi.open();
}

function openDragModal() {
  dragModalApi.open();
}
</script>

<template>
  <Page
    auto-content-height
    description="弹窗组件通常用于在当前页面上显示一个覆盖层，用以展示重要信息或提供用户交互界面。"
    title="弹窗组件示例"
  >
    <template #extra>
      <DocButton path="/components/common-ui/vben-modal" />
    </template>
    <BaseModal />
    <InContentModal />
    <AutoHeightModal />
    <DynamicModal />
    <SharedDataModal />
    <FormModal />
    <NestedModal />
    <BlurModal />
    <DragModal />

    <ElCard class="mb-4" header="基本使用">
      <p class="mb-3">一个基础的弹窗示例</p>
      <ElButton type="primary" @click="openBaseModal">打开弹窗</ElButton>
    </ElCard>

    <ElCard class="mb-4" header="在内容区域打开">
      <p class="mb-3">指定弹窗在内容区域打开，不会覆盖顶部和左侧菜单等区域</p>
      <ElButton type="primary" @click="openInContentModal">打开弹窗</ElButton>
    </ElCard>

    <ElCard class="mb-4" header="内容高度自适应滚动">
      <p class="mb-3">可根据内容自动计算滚动高度</p>
      <ElButton type="primary" @click="openAutoHeightModal">打开弹窗</ElButton>
    </ElCard>

    <ElCard class="mb-4" header="动态配置示例">
      <p class="mb-3">通过 setState 动态调整弹窗数据</p>
      <ElButton type="primary" @click="openDynamicModal">打开弹窗</ElButton>
      <ElButton class="ml-2" type="primary" @click="handleUpdateTitle">
        从外部修改标题并打开
      </ElButton>
    </ElCard>

    <ElCard class="mb-4" header="内外数据共享示例">
      <p class="mb-3">通过共享 sharedData 来进行数据交互</p>
      <ElButton type="primary" @click="openSharedModal">
        打开弹窗并传递数据
      </ElButton>
    </ElCard>

    <ElCard class="mb-4" header="表单弹窗示例">
      <p class="mb-3">打开弹窗并设置表单schema以及数据</p>
      <ElButton type="primary" @click="openFormModal">
        打开弹窗并设置表单schema以及数据
      </ElButton>
    </ElCard>

    <ElCard class="mb-4" header="嵌套弹窗示例">
      <p class="mb-3">弹窗内打开新的弹窗</p>
      <ElButton type="primary" @click="openNestedModal">打开弹窗</ElButton>
    </ElCard>

    <ElCard class="mb-4" header="遮罩层模糊">
      <p class="mb-3">设置遮罩层模糊程度</p>
      <ElButton type="primary" @click="openBlurModal">打开弹窗</ElButton>
    </ElCard>

    <ElCard class="mb-4" header="可拖拽弹窗">
      <p class="mb-3">弹窗支持拖拽移动</p>
      <ElButton type="primary" @click="openDragModal">打开弹窗</ElButton>
    </ElCard>
  </Page>
</template>
