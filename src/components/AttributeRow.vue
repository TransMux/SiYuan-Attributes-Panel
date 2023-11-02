<template>
    <div class="attribute-row">
        <t-select v-model="value" :borderless="true" class="attr-selector" placeholder="-请选择-" :showArrow="false"
            :options="options">
            <template #prefixIcon>
                <icon name="browse" style="margin-right: 4px" />
            </template>
        </t-select>
        <t-input placeholder="" v-model="attribute" />
    </div>
</template>
  
<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from 'tdesign-icons-vue-next';
import { useAttributesStore } from '@/store/attribute';

const attributeStore = useAttributesStore();

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
});

const attribute = attributeStore.attributes[props.name] || '';

const options = [
    {
        label: props.name,
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