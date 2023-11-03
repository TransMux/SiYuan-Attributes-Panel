<template>
    <div class="attribute-row">
        <t-select v-model="value" :borderless="true" class="attr-selector" placeholder="-请选择-" :showArrow="false"
            :options="options" readonly>
            <template #prefixIcon>
                <component :is="dynamicIcon"></component>
            </template>
        </t-select>
        <!-- This is rendered by displayElement. -->
        <t-loading :loading="submitting" size="small">
            <component :is="dynamicComponent"></component>
        </t-loading>
    </div>
</template>
  
<script setup lang="tsx">
import { computed, ref, shallowRef, watch } from 'vue';
import { useAttributesStore } from '@/store/attribute';
import { useRuleStore } from '@/store/rules';
import { ViewListIcon } from 'tdesign-icons-vue-next';
import { MessagePlugin } from 'tdesign-vue-next';

const attributeStore = useAttributesStore();
const ruleStore = useRuleStore();

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});

const displayKey = props.name;
const attributeValue = computed(() => attributeStore.attributes[props.name] || '')

const submitting = ref(false);
function submit(text, callback?: any) {
    submitting.value = true;
    attributeStore.setAttribute(props.name, text, () => {
        // TODO: 这里没做错误处理，万一没成功呢？
        if (callback && typeof callback === "function") callback()
        MessagePlugin.success(`设置 ${displayKey} 成功`)
        submitting.value = false;
    })
}

const dynamicIcon = shallowRef(
    <ViewListIcon />
)

const dynamicComponent = shallowRef(
    <t-input
        defaultValue={attributeValue.value}
        borderless="true"
        onEnter={submit}
    />
)

const options = ref([]);

watch(attributeValue, (newValue) => {
    dynamicComponent.value = <t-input
        defaultValue={newValue}
        borderless="true"
    />
    const displayRule = ruleStore.displayRules[displayKey];
    if (displayRule) {
        const displayMethod = ruleStore.renderMethods[displayRule.dataType];
        dynamicIcon.value = displayRule.icon;
        if (displayMethod) {
            dynamicComponent.value = displayMethod(attributeValue.value, displayRule.editable, submit);
        }
        options.value = [
            {
                label: displayRule.displayAs,
                value: '1',
            }
        ];
    } else {
        options.value = [
            {
                label: props.name,
                value: '1',
            }
        ];
        dynamicComponent.value = <t-input
            defaultValue={attributeValue.value}
            borderless="true"
            autoWidth={attributeValue.value !== ""}
            onEnter={submit}
        />
    }
}, { immediate: true })

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