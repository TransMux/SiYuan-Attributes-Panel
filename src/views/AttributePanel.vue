<template>
    <div class="attribute-panel">
        <DebugInfo />
        <AttributeRow />
        <AttributeRow />
        <AttributeRow />
        <AttributeRow />
        <AttributeRow />
        <AttributeRowAdd />
    </div>
</template>

<script setup lang="ts">
import AttributeRow from '@/components/AttributeRow.vue';
import { useAttributesStore } from '@/store/attribute';
import { onMounted } from 'vue';
// 通过一个块id，渲染对应的属性面板

const attributeStore = useAttributesStore();

onMounted(() => {
    attributeStore.fetchAttributes();
});
</script>