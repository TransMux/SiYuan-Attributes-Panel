<template>
    <div class="attribute-panel">
        <t-card :bordered="false">
            <!-- <DebugInfo /> -->
            <template v-if="attributeStore.inspectBlockId">
                <template v-for="attribute in Object.keys(monitor)" :key="attribute">
                    <AttributeRow :name="attribute" />
                </template>
                <AttributeRowAdd />
            </template>

            <template v-else>
                暂无属性
            </template>
        </t-card>
    </div>
</template>

<script setup lang="ts">
import AttributeRow from '@/components/AttributeRow.vue';
import { useAttributesStore } from '@/store/attribute';
import { ref, watch } from 'vue';
// 通过一个块id，渲染对应的属性面板

const attributeStore = useAttributesStore();
const monitor = ref(attributeStore.ordered);

watch(
    () => attributeStore.attributes,
    () => {
        console.log('attributes changed', attributeStore.ordered);
        monitor.value = attributeStore.ordered;
    }, { deep: true });
</script>

<style scoped>
.form-step-container {
    background-color: var(--td-bg-color-container);
    padding: 24px 24px;
    border-radius: var(--td-radius-medium);
    height: 100%;
}

:deep(.t-card__body) {
    padding: 24px 24px;
}
</style>