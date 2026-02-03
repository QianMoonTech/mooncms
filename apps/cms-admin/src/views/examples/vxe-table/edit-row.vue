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

const [Grid, gridApi] = useVbenVxeGrid<RowType>({
  gridOptions: {
    columns: [
      { editRender: { name: 'input' }, field: 'name', title: 'Name' },
      {
        editRender: { name: 'input' },
        field: 'nickname',
        title: 'Nickname',
      },
      {
        editRender: { name: 'input' },
        field: 'role',
        title: 'Role',
      },
      {
        editRender: { name: 'input' },
        field: 'address',
        showOverflow: true,
        title: 'Address',
      },
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
    editConfig: {
      mode: 'row',
      trigger: 'click',
    },
    height: 'auto',
    pagerConfig: {
      enabled: false,
    },
  },
});

function getData() {
  const data = gridApi.grid.getData();
  ElMessage.success(`获取到 ${data.length} 条数据`);
}
</script>

<template>
  <Page auto-content-height title="Vxe Table 行编辑">
    <ElCard class="mb-4" header="行编辑">
      <template #extra>
        <ElButton type="primary" @click="getData">获取数据</ElButton>
      </template>
      <Grid />
    </ElCard>
  </Page>
</template>
