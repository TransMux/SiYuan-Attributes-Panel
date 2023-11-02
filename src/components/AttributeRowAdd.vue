<template>
    <div class="add-attribute-row">
        <t-button style="width: 150px" theme="default" variant="text" v-if="!creating" @click="creating = true">
            <template #icon><add-icon /></template>
            添加新的属性
        </t-button>

        <template v-else>
            <t-select v-model="attributeKey" :borderless="true" class="attr-selector" placeholder="-请选择-" :showArrow="false"
                filterable :readonly="!creating" @change="handleSelect">
                <t-option v-for="item in options" :key="item.key" :value="item.key" :label="item.displayAs">
                    <div class="create-option">
                        <component :is="item.icon"></component>
                        <div>{{ item.displayAs }}</div>
                    </div>
                </t-option>

                <template #prefixIcon>
                    <component :is="dynamicIcon"></component>
                </template>
            </t-select>
            <!-- This is rendered by displayElement. -->
            <component v-if="selected" :is="dynamicComponent"></component>
        </template>
    </div>
</template>
  
<script setup lang="tsx">
import { ref, shallowRef } from 'vue';
import { useAttributesStore } from '@/store/attribute';
import { useRuleStore } from '@/store/rules';
import { AddIcon, ChevronDownIcon } from 'tdesign-icons-vue-next';

const attributeStore = useAttributesStore();
const ruleStore = useRuleStore();

const options = ruleStore.createOptions

const attributeKey = ref("");
const attributeValue = ref('');

const dynamicIcon = shallowRef(
    <ChevronDownIcon />
)

const selected = ref(false)
function handleSelect() {
    const displayRule = ruleStore.displayRules[attributeKey.value];
    if (displayRule) {
        const displayMethod = ruleStore.renderMethods[displayRule.dataType];
        dynamicIcon.value = displayRule.icon;
        if (displayMethod) {
            dynamicComponent.value = displayMethod("", true);
        }
        attributeKey.value = displayRule.displayAs;
        selected.value = true
    } else {
        console.log("### ??? 怎么没有")
    }
}

const dynamicComponent = shallowRef(
    <t-input
        v-model={attributeValue.value}
        autowidth
        borderless="true"
    />
)

// const displayRule = ruleStore.displayRules[attributeKey.value];
// if (displayRule) {
//     const displayMethod = ruleStore.renderMethods[displayRule.dataType];
//     dynamicIcon.value = displayRule.icon;
//     if (displayMethod) {
//         dynamicComponent.value = displayMethod(attributeValue, displayRule.editable);
//     }
//     attributeKey.value = displayRule.displayAs;
// }

const creating = ref(false)
</script>

<style scoped>
.create-option {
    display: flex;
    align-items: center;
}

/* make select and input in one row */
.add-attribute-row {
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

:deep(.t-button--variant-text) {
    padding-left: 0px;
}
</style>