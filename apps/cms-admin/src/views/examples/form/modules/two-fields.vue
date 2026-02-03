<script lang="ts" setup>
import { computed } from 'vue';

import { ElInput } from 'element-plus';

interface Props {
  modelValue?: { field1?: string; field2?: string };
}

const props = defineProps<Props>();

const emit = defineEmits(['update:modelValue']);

const value = computed({
  get() {
    return props.modelValue || {};
  },
  set(val) {
    emit('update:modelValue', val);
  },
});
</script>

<template>
  <div class="flex gap-4">
    <ElInput v-model="value.field1" placeholder="字段1" />
    <ElInput v-model="value.field2" placeholder="字段2" />
  </div>
</template>
