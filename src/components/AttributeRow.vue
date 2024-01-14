<template>
    <BaseRow :name="displayAs" :key="index" :siyuan-key="key">

        <!-- 单行输入框 -->
        <template v-if="renderMethod === 'input'">
            <t-input v-model="value" :borderless="true" placeholder="请输入" @blur="handleSubmit" :disabled="!editable" />
        </template>

        <!-- 链接 -->
        <template v-else-if="renderMethod === 'link'">
            <t-input v-model="value" :borderless="true" placeholder="请输入" @blur="handleSubmit" :disabled="!editable" />
        </template>

        <!-- Tag 输入框 -->
        <template v-else-if="renderMethod === 'tag-input'">
            <t-input-number v-model="value" :borderless="true" placeholder="请输入" :disabled="!editable" />
        </template>

        <!-- 日期时间 -->
        <template v-else-if="renderMethod === 'datetime'">
            <t-date-picker v-model="value" :borderless="true" placeholder="请选择" enableTimePicker allow-input
                :disabled="!editable" />
        </template>

        <!-- 复选框 Unused -->
        <template v-else-if="renderMethod === 'checkbox'">
            <t-checkbox v-model="value" :borderless="true" :disabled="!editable" />
        </template>

        <template v-else>
            <t-input v-model="value" :borderless="true" placeholder="请输入" :disabled="!editable" @blur="handleSubmit" />
        </template>
    </BaseRow>
</template>
  
<script setup lang="tsx">
import { useAttributesStore } from '@/store/attribute';
import { storeToRefs } from 'pinia';
import { fetchPost } from 'siyuan';
import { MessagePlugin } from 'tdesign-vue-next';
import { toRefs } from 'vue';

const attributeStore = useAttributesStore();

const props = defineProps({
    index: {
        type: Number,
        required: true,
    },
});

// TODO: 这样到底会不会丢失响应性
const { builtInAttributes } = storeToRefs(attributeStore);
const attributeValue = builtInAttributes.value[props.index]
const { key, value, renderMethod, displayAs, editable } = toRefs(attributeValue)

function handleSubmit() {
    fetchPost(
        "/api/attr/setBlockAttrs",
        {
            id: attributeStore.documentId,
            attrs: {
                [key.value]: value.value,
            },
        },
        () => {
            MessagePlugin.success("设置成功");
        }
    );
}

</script>

<style scoped>
/* make select and input in one row */
.attribute-row {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

:deep(.t-input:not(:hover)) {
    border: white;
}

:deep(.t-input--focused) {
    border-color: var(--td-brand-color);
}

.attr-selector {
    width: 150px;
    margin-right: 8px;
}

:deep(.t-icon) {
    margin-right: 4px;
}
</style>