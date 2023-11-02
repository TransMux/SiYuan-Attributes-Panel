<template>
    <div class="attribute-row">
        <t-select v-model="value" :borderless="true" class="attr-selector" placeholder="-请选择-" :showArrow="false"
            :options="options">
            <template #prefixIcon>
                <icon name="browse" style="margin-right: 4px" />
            </template>
        </t-select>
        <!-- This is rendered by displayElement. -->
        <component :is="dynamicComponent"></component>
    </div>
</template>
  
<script setup lang="tsx">
import { computed, ref } from 'vue';
import { Icon } from 'tdesign-icons-vue-next';
import { useAttributesStore } from '@/store/attribute';
import { useRuleStore } from '@/store/rules';

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

const dynamicComponent = ref(
    <t-input
        v-model={attributeValue}
        borderless="true"
    />
)

const displayRule = ruleStore.displayRules[displayKey.value];
if (displayRule) {
    const displayMethod = ruleStore.renderMethods[displayKey.value];
    console.log('### displayMethod', displayMethod, displayKey.value);
    if (displayMethod) {
        dynamicComponent.value = displayMethod(attributeValue.value, displayRule.editable);
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
</style>