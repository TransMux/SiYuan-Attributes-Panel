<template>
    <div class="attribute-info">
        <div>Inspecting: {{ attributeStore.inspectBlockId }}</div>
        <div>Attributes: {{ attributeStore.attributes }}</div>
    </div>
</template>

<script setup lang="ts">
import { useAttributesStore } from '@/store/attribute';
// 通过一个块id，渲染对应的属性面板

const attributeStore = useAttributesStore();
</script>