<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { ElButton, ElCard, ElMessage } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface RowType {
  address: string;
  age: number;
  id: number;
  name: string;
  nickname: string;
  role: string;
}

const [Grid] = useVbenVxeGrid<RowType>({
  gridOptions: {
    columns: [
      { title: '序号', type: 'seq', width: 50 },
      { field: 'name', title: 'Name' },
      { field: 'age', sortable: true, title: 'Age' },
      { field: 'nickname', title: 'Nickname' },
      { field: 'role', title: 'Role' },
      { field: 'address', showOverflow: true, title: 'Address' },
    ],
    data: [
      {
        address: 'New York No. 1 Lake Park',
        age: 32,
        id: 10001,
        name: 'Test1',
        nickname: 'T1',
        role: 'Develop',
      },
      {
        address: 'Shanghai No. 1 Lake Park',
        age: 28,
        id: 10002,
        name: 'Test2',
        nickname: 'T2',
        role: 'Test',
      },
      {
        address: 'Los Angeles No. 1 Lake Park',
        age: 24,
        id: 10003,
        name: 'Test3',
        nickname: 'T3',
        role: 'PM',
      },
    ],
    height: 'auto',
    pagerConfig: {
      enabled: false,
    },
  },
});

function showToast() {
  ElMessage.success('Hello Vben Admin');
}
</script>

<template>
  <Page auto-content-height title="Vxe Table 基础示例">
    <ElCard class="mb-4" header="基础表格">
      <template #extra>
        <ElButton type="primary" @click="showToast">测试</ElButton>
      </template>
      <Grid />
    </ElCard>
  </Page>
</template>
