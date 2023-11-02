<template>
    <div class="attribute-row">
        <t-select v-model="value" :borderless="true" class="attr-selector" placeholder="-请选择-" :showArrow="false"
            :options="options">
            <template #prefixIcon>
                <component :is="dynamicIcon"></component>
            </template>
        </t-select>
        <!-- This is rendered by displayElement. -->
        <component :is="dynamicComponent"></component>
    </div>
</template>
  
<script setup lang="tsx">
import { ref, shallowRef } from 'vue';
import { useAttributesStore } from '@/store/attribute';
import { useRuleStore } from '@/store/rules';
import { ViewListIcon } from 'tdesign-icons-vue-next';

const attributeStore = useAttributesStore();
const ruleStore = useRuleStore();

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});

const displayKey = ref(props.name);
const attributeValue = attributeStore.attributes[props.name] || '';

const dynamicIcon = shallowRef(
    <ViewListIcon />
)

const dynamicComponent = shallowRef(
    <t-input
        v-model={attributeValue}
        borderless="true"
    />
)

const displayRule = ruleStore.displayRules[displayKey.value];
if (displayRule) {
    const displayMethod = ruleStore.renderMethods[displayRule.dataType];
    dynamicIcon.value = displayRule.icon;
    if (displayMethod) {
        dynamicComponent.value = displayMethod(attributeValue, displayRule.editable);
    }
    displayKey.value = displayRule.displayAs;
}


const options = [
    {
        label: displayKey.value,
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

:deep(.t-input:not(:hover)) {
    border: white;
}

:deep(.t-input--focused) {
    border-color: var(--td-brand-color);
}

.attr-selector {
    width: 150px;
    margin-right: 10px;
}

:deep(.t-icon) {
    margin-right: 4px;
}
</style>