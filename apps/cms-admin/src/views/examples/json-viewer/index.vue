<script lang="ts" setup>
import { ref } from 'vue';

import { JsonViewer, Page } from '@vben/common-ui';

import { ElButton, ElCard, ElInput } from 'element-plus';

const jsonData = ref({
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
  address: {
    street: '123 Main St',
    city: 'New York',
    country: 'USA',
  },
  hobbies: ['reading', 'swimming', 'coding'],
});

const inputValue = ref(JSON.stringify(jsonData.value, null, 2));

function updateJson() {
  try {
    jsonData.value = JSON.parse(inputValue.value);
  } catch (e) {
    // 解析失败，保持原值
  }
}
</script>

<template>
  <Page title="JSON Viewer 示例">
    <ElCard class="mb-4" header="JSON 查看器">
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div>
          <h4 class="mb-2 font-semibold">输入 JSON：</h4>
          <ElInput
            v-model="inputValue"
            type="textarea"
            :rows="15"
            placeholder="请输入 JSON 数据"
          />
          <ElButton class="mt-2" type="primary" @click="updateJson">
            更新
          </ElButton>
        </div>
        <div>
          <h4 class="mb-2 font-semibold">预览：</h4>
          <JsonViewer :value="jsonData" />
        </div>
      </div>
    </ElCard>
  </Page>
</template>
