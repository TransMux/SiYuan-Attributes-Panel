<template>
    <div class="attribute-panel">
        <t-card :bordered="false">
            <!-- <DebugInfo /> -->
            <template v-for="attribute in Object.keys(attributeStore.ordered)">
                <AttributeRow :name="attribute" />
            </template>
            <AttributeRowAdd />
        </t-card>
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
    window.addEventListener("click", handleShiftClick, false);
});

// eventListener: listen for shift + left click on class="protyle-gutters"
function handleShiftClick(e: MouseEvent) {
    if (!e.shiftKey) {
        return;
    }
    console.log("### shift + click", e.target);
    const target = e.target as HTMLElement;
    if (target.classList.contains("protyle-gutters")) {
        // find button in target, get data-node-id
        const button = target.getElementsByTagName("button")[0];
        const nodeId = button.dataset.nodeId;
        if (nodeId) {
            attributeStore.inspectBlock(nodeId);
            e.stopPropagation();
        }
    }
}
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