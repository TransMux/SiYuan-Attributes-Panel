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
import { computed, onMounted } from 'vue';
// 通过一个块id，渲染对应的属性面板

const attributeStore = useAttributesStore();


onMounted(() => {
    attributeStore.fetchAttributes();
});
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