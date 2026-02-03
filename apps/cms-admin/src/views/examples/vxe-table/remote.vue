<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { ElButton, ElCard } from 'element-plus';

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
      { title: '序号', type: 'seq', width: 50 },
      { field: 'name', title: 'Name' },
      { field: 'age', sortable: true, title: 'Age' },
      { field: 'nickname', title: 'Nickname' },
      { field: 'role', title: 'Role' },
      { field: 'address', showOverflow: true, title: 'Address' },
    ],
    height: 'auto',
    pagerConfig: {
      enabled: true,
      pageSize: 10,
    },
    proxyConfig: {
      ajax: {
        query: async ({ page }: { page: { currentPage: number; pageSize: number } }) => {
          return new Promise((resolve) => {
            setTimeout(() => {
              const data = Array.from({ length: 100 }, (_, i) => ({
                address: `Address ${i + 1}`,
                age: 20 + (i % 50),
                id: 10001 + i,
                name: `Name ${i + 1}`,
                nickname: `Nick ${i + 1}`,
                role: ['Develop', 'Test', 'PM'][i % 3],
              }));
              resolve({
                items: data.slice(
                  (page.currentPage - 1) * page.pageSize,
                  page.currentPage * page.pageSize,
                ),
                total: data.length,
              });
            }, 500);
          });
        },
      },
    },
  },
});

function reload() {
  gridApi.reload();
}
</script>

<template>
  <Page auto-content-height title="Vxe Table 远程数据">
    <ElCard class="mb-4" header="远程数据">
      <template #extra>
        <ElButton type="primary" @click="reload">刷新</ElButton>
      </template>
      <Grid />
    </ElCard>
  </Page>
</template>
