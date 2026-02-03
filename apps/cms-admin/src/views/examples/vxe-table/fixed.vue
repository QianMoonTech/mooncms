<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { ElCard } from 'element-plus';

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
      { fixed: 'left', title: '序号', type: 'seq', width: 50 },
      { field: 'name', fixed: 'left', title: 'Name', width: 120 },
      { field: 'age', sortable: true, title: 'Age', width: 100 },
      { field: 'nickname', title: 'Nickname', width: 120 },
      { field: 'role', title: 'Role', width: 120 },
      {
        field: 'address',
        showOverflow: true,
        title: 'Address',
        width: 300,
      },
      {
        field: 'name',
        fixed: 'right',
        title: 'Name2',
        width: 120,
      },
    ],
    data: Array.from({ length: 20 }, (_, i) => ({
      address: `Address ${i + 1}`,
      age: 20 + i,
      id: 10001 + i,
      name: `Name ${i + 1}`,
      nickname: `Nick ${i + 1}`,
      role: `Role ${i + 1}`,
    })),
    height: 'auto',
    pagerConfig: {
      enabled: false,
    },
  },
});
</script>

<template>
  <Page auto-content-height title="Vxe Table 固定列">
    <ElCard class="mb-4" header="固定列">
      <Grid />
    </ElCard>
  </Page>
</template>
