<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { ElCard } from 'element-plus';

import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface RowType {
  address: string;
  age: number;
  hasChild?: boolean;
  id: number;
  name: string;
  parentId?: number | null;
}

const [Grid] = useVbenVxeGrid<RowType>({
  gridOptions: {
    columns: [
      { treeNode: true, type: 'seq', width: 50 },
      { field: 'name', title: 'Name' },
      { field: 'age', title: 'Age' },
      { field: 'address', showOverflow: true, title: 'Address' },
    ],
    data: [
      {
        address: 'New York No. 1 Lake Park',
        age: 32,
        hasChild: true,
        id: 10001,
        name: 'Test1',
        parentId: null,
      },
      {
        address: 'Shanghai No. 1 Lake Park',
        age: 28,
        id: 10002,
        name: 'Test2',
        parentId: 10001,
      },
      {
        address: 'Los Angeles No. 1 Lake Park',
        age: 24,
        id: 10003,
        name: 'Test3',
        parentId: 10001,
      },
      {
        address: 'Beijing No. 1 Lake Park',
        age: 30,
        hasChild: true,
        id: 10004,
        name: 'Test4',
        parentId: null,
      },
      {
        address: 'Shenzhen No. 1 Lake Park',
        age: 26,
        id: 10005,
        name: 'Test5',
        parentId: 10004,
      },
    ],
    height: 'auto',
    pagerConfig: {
      enabled: false,
    },
    treeConfig: {
      parentField: 'parentId',
      rowField: 'id',
      transform: true,
    },
  },
});
</script>

<template>
  <Page auto-content-height title="Vxe Table 树形表格">
    <ElCard class="mb-4" header="树形表格">
      <Grid />
    </ElCard>
  </Page>
</template>
