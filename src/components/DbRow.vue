
<template>
    <BaseRow :name="name" :key="cellID" :icon="siyuanDatabaseIcons[type]" :callback="handleSubmit">

        <!-- 单选 -->
        <template v-if="type === 'select'">
            <t-select v-model="value" :borderless="true" placeholder="-请选择-" :options="options" />
        </template>

        <!-- 文本 -->
        <template v-else-if="type === 'text'">
            <t-input v-model="value.content" :borderless="true" placeholder="请输入" />
        </template>

        <!-- 链接 -->
        <template v-else-if="type === 'url'">
            <t-input v-model="value.content" :borderless="true" placeholder="请输入" />
        </template>

        <!-- 数字 -->
        <template v-else-if="type === 'number'">
            <t-input-number v-model="value.content" :borderless="true" placeholder="请输入" />
        </template>

        <!-- 多选 -->
        <template v-else-if="type === 'mSelect'">
            <t-select v-model="value" :borderless="true" placeholder="-请选择-" :options="options" multiple />
        </template>

        <!-- 日期 -->
        <template v-else-if="type === 'date'">
            <t-date-picker v-model="value.content" :borderless="true" placeholder="请选择" />
        </template>

        <!-- 复选框 -->
        <template v-else-if="type === 'checkbox'">
            <t-checkbox v-model="value.checked" :borderless="true" />
        </template>

        <!-- 模板 -->
        <template v-else-if="type === 'template'">
            <t-input v-model="value.content" :borderless="true" placeholder="请输入" />
        </template>

        <template v-else>
            <t-input v-model="value" :borderless="true" placeholder="请输入" />
        </template>
    </BaseRow>
</template>

<script setup lang="ts">
import { useAttributesStore } from '@/store/attribute';
import BaseRow from './BaseRow.vue';

function handleSubmit(text) {
    console.log("Submit", text)
}

const siyuanDatabaseIcons = {
    'text': 'view-list',
    'select': 'chevron-down-s',
    'url': 'link',
    'number': 'add-and-subtract',
    'mSelect': 'chevron-down-double-s',
    'date': 'calendar-event',
    'checkbox': 'check',
    'template': 'sum',
}

const props = defineProps({
    avID: {
        type: String,
        required: true,
    },
    fieldIndex: {
        type: Number,
        required: true,
    },
});

const attributeStore = useAttributesStore();

const targetTable = attributeStore.avs[props.avID]
const targetField = targetTable.fields[props.fieldIndex]
const { cellID, keyID, rowID, name, value, type, options } = targetField
</script>