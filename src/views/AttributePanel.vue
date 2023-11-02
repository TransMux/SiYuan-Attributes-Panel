<template>
    <div class="attribute-panel">
        <DebugInfo />
        <template v-for="attribute in Object.keys(orderedAttributes)">
            <AttributeRow :name="attribute" />
        </template>
        <AttributeRowAdd />
    </div>
</template>

<script setup lang="ts">
import AttributeRow from '@/components/AttributeRow.vue';
import { useAttributesStore } from '@/store/attribute';
import { useRuleStore } from '@/store/rules';
import { computed, onMounted } from 'vue';
// 通过一个块id，渲染对应的属性面板

const attributeStore = useAttributesStore();
const ruleStore = useRuleStore();

const orderedAttributes = computed(() => {
    const attributes = attributeStore.attributes;
    const orderResult = {};
    Object.keys(attributes).flatMap(key => {
        const conrespondingRule = ruleStore.displayRules[key];
        if (conrespondingRule && !conrespondingRule.display) {
            // 不显示
            return []
        }
        return [key];
    }).sort(key => {
        const conrespondingRule = ruleStore.displayRules[key];
        if (conrespondingRule) {
            return conrespondingRule.order || 9999;
        }
        // 没有的排在最下面
        return 99999;
    }).forEach(key => {
        orderResult[key] = attributes[key];
    });
    return orderResult;
});

onMounted(() => {
    attributeStore.fetchAttributes();
});
</script>