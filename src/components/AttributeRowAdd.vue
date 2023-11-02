<template>
    <div class="add-attribute-row">
        <t-button style="width: 150px" theme="default" variant="text">
            <template #icon><add-icon /></template>
            添加新的属性
        </t-button>
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { AddIcon } from 'tdesign-icons-vue-next';

const options = [
    {
        label: '已选择的选项',
        value: '1',
    },
    {
        label: '短的选项二',
        value: '2',
    },
    {
        label: '很长很长很长的选项三',
        value: '3',
    },
];

const value = ref('1');
</script>

<style scoped>
/* make select and input in one row */
.attribute-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

:deep(.t-button--variant-text){
    padding-left: 0px;
}
</style>