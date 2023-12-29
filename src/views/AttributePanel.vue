<template>
    <div class="attribute-panel">
        <t-card :bordered="false">
            <!-- <DebugInfo /> -->
            <template v-if="attributeStore.inspectBlockId">
                <template v-for="attribute in monitor" :key="attribute">
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
import { useRuleStore } from '@/store/rules';
import { ref, watch } from 'vue';
// 通过一个块id，渲染对应的属性面板

const attributeStore = useAttributesStore();
const ruleStore = useRuleStore();

const monitor = ref(attributeStore.ordered);

watch(
    () => attributeStore.attributes,
    () => {
        const result = Object.keys(attributeStore.ordered);
        // render templates
        for (const template of Object.values(ruleStore.userTemplates)) {
            if (!template.display(attributeStore.attributes)) continue;

            // merge template.attributes
            for (const attribute of template.attributes) {
                if (!result.includes(attribute)) {
                    result.push(attribute);
                }
            }
        }
        monitor.value = result;
    }, { deep: true });
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
    padding-top: 12px;
}

.content {
    /* Gray */
    color: #4F4F4F;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 4px;
}
</style>