<template>
    <t-card :bordered="false">
        <template v-for="(attribute, index) in attributeStore.builtInAttributes" :key="attribute.name">
            <AttributeRow :index="index" />
        </template>
        <AttributeRowAdd />
    </t-card>
</template>


<script setup lang="ts">
import AttributeRow from '@/components/AttributeRow.vue';
import { useAttributesStore } from '@/store/attribute';

// 通过一个文档id，渲染对应的内置属性属性面板
const attributeStore = useAttributesStore();
</script>


<style scoped>
.form-step-container {
    background-color: var(--td-bg-color-container);
    padding: 12px 12px;
    border-radius: var(--td-radius-medium);
    height: 100%;
}

:deep(.t-card__body) {
    padding: 0px 0px;
}

.content {
    /* Gray */
    color: #4F4F4F;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 4px;
}
</style>