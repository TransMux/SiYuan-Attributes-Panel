<template>
    <BaseRow :name="name" :key="cellID" :icon="siyuanDatabaseIcons[type]">

        <!-- 单选 -->
        <template v-if="attributeValue.renderMethod === 'select'">
            <t-select v-model="selectValue" :borderless="true" placeholder="-请选择-">
                <t-option v-for="(item, index) in options" :key="index" :value="index" :label="item.name"></t-option>
            </t-select>
        </template>

        <!-- 文本 -->
        <template v-else-if="attributeValue.renderMethod === 'text'">
            <t-input v-model="value.content" :borderless="true" placeholder="请输入" @blur="handleSubmit" />
        </template>

        <!-- 链接 -->
        <template v-else-if="attributeValue.renderMethod === 'url'">
            <t-input v-model="value.content" :borderless="true" placeholder="请输入" @blur="handleSubmit" />
        </template>

        <!-- 数字 -->
        <template v-else-if="attributeValue.renderMethod === 'number'">
            <t-input-number v-model="value.content" :borderless="true" placeholder="请输入" @change="handleChange" />
        </template>

        <!-- 多选 -->
        <template v-else-if="attributeValue.renderMethod === 'mSelect'">
            <t-select v-model="selectValue" :borderless="true" placeholder="-请选择-" multiple>
                <t-option v-for="(item, index) in options" :key="index" :value="index" :label="item.name"></t-option>
            </t-select>
        </template>

        <!-- 日期 -->
        <template v-else-if="attributeValue.renderMethod === 'date'">
            <template v-if="!value.hasEndDate">
                <t-date-picker v-model="value.content" :borderless="true" placeholder="请选择"
                    :enableTimePicker="!value.isNotTime" allow-input @change="handleDateChange" />
            </template>
            <template v-else>
                <t-date-range-picker v-model="dateRange" :borderless="true" placeholder="请选择"
                    :enableTimePicker="!value.isNotTime" allow-input @change="handleDateChange" />
            </template>
        </template>

        <!-- 复选框 -->
        <template v-else-if="attributeValue.renderMethod === 'checkbox'">
            <t-checkbox v-model="value.checked" :borderless="true" @change="handleSubmit" />
        </template>

        <!-- 模板 -->
        <template v-else-if="attributeValue.renderMethod === 'template'">
            <t-input v-model="value.content" :borderless="true" placeholder="请输入" readonly />
        </template>

        <template v-else>
            <t-input v-model="value" :borderless="true" placeholder="请输入" />
        </template>
    </BaseRow>
</template>
  
<script setup lang="tsx">
import { innerAttribute, useAttributesStore } from '@/store/attribute';
import { storeToRefs } from 'pinia';
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
const { name, type, options, displayKey } = toRefs(attributeValue)

// function submit(text, callback?: any) {
//     submitting.value = true;
//     attributeStore.setAttribute(props.name, text, () => {
//         // TODO: 这里没做错误处理，万一没成功呢？
//         if (callback && typeof callback === "function") callback()
//         MessagePlugin.success(`设置 ${displayKey} 成功`)
//         submitting.value = false;
//     })
// }
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