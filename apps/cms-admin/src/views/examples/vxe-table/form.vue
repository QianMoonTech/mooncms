<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { ElCard, ElMessage } from 'element-plus';

import { useVbenForm } from '#/adapter/form';
import { useVbenVxeGrid } from '#/adapter/vxe-table';

interface RowType {
  address: string;
  age: number;
  id: number;
  name: string;
  nickname: string;
  role: string;
}

const [Form] = useVbenForm({
  handleSubmit: onSubmit,
  layout: 'inline',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名',
      },
      fieldName: 'name',
      label: '用户名',
    },
    {
      component: 'Select',
      componentProps: {
        options: [
          { label: 'Develop', value: 'Develop' },
          { label: 'Test', value: 'Test' },
          { label: 'PM', value: 'PM' },
        ],
        placeholder: '请选择角色',
      },
      fieldName: 'role',
      label: '角色',
    },
  ],
  showDefaultActions: true,
  submitButtonOptions: {
    text: '查询',
  },
});

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

function onSubmit(values: Record<string, any>) {
  ElMessage.success({
    message: `查询参数：${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Page auto-content-height title="Vxe Table 表单查询">
    <ElCard class="mb-4" header="表单查询">
      <Form />
      <Grid class="mt-4" />
    </ElCard>
  </Page>
</template>
