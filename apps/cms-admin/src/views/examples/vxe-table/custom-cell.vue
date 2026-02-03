<script lang="tsx" setup>
import { Page } from '@vben/common-ui';

import { ElButton, ElCard, ElTag } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface RowType {
  address: string;
  age: number;
  id: number;
  name: string;
  nickname: string;
  role: string;
  status: string;
}

const [Grid] = useVbenVxeGrid<RowType>({
  gridOptions: {
    columns: [
      { title: '序号', type: 'seq', width: 50 },
      { field: 'name', title: 'Name' },
      {
        cellRender: { name: 'CellLink' },
        field: 'nickname',
        title: 'Nickname',
      },
      {
        field: 'status',
        slots: {
          default: ({ row }: { row: RowType }) => {
            return (
              <ElTag type={row.status === 'active' ? 'success' : 'danger'}>
                {row.status}
              </ElTag>
            );
          },
        },
        title: 'Status',
      },
      { field: 'role', title: 'Role' },
      { field: 'address', showOverflow: true, title: 'Address' },
      {
        slots: {
          default: () => {
            return (
              <ElButton size="small" type="primary">
                编辑
              </ElButton>
            );
          },
        },
        title: '操作',
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
        status: 'active',
      },
      {
        address: 'Shanghai No. 1 Lake Park',
        age: 28,
        id: 10002,
        name: 'Test2',
        nickname: 'T2',
        role: 'Test',
        status: 'inactive',
      },
      {
        address: 'Los Angeles No. 1 Lake Park',
        age: 24,
        id: 10003,
        name: 'Test3',
        nickname: 'T3',
        role: 'PM',
        status: 'active',
      },
    ],
    height: 'auto',
    pagerConfig: {
      enabled: false,
    },
  },
});
</script>

<template>
  <Page auto-content-height title="Vxe Table 自定义单元格">
    <ElCard class="mb-4" header="自定义单元格">
      <Grid />
    </ElCard>
  </Page>
</template>
