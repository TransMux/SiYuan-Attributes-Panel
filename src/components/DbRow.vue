
<template>
    <BaseRow :name="name" :key="cellID" :icon="siyuanDatabaseIcons[type]">

        <!-- 单选 -->
        <template v-if="type === 'select'">
            <t-select v-model="selectValue" :borderless="true" placeholder="-请选择-">
                <t-option v-for="(item, index) in options" :key="index" :value="index" :label="item.name"></t-option>
            </t-select>
        </template>

        <!-- 文本 -->
        <template v-else-if="type === 'text'">
            <t-input v-model="value.content" :borderless="true" placeholder="请输入" @blur="handleSubmit" />
        </template>

        <!-- 链接 -->
        <template v-else-if="type === 'url'">
            <t-input v-model="value.content" :borderless="true" placeholder="请输入" @blur="handleSubmit" />
        </template>

        <!-- 数字 -->
        <template v-else-if="type === 'number'">
            <t-input-number v-model="value.content" :borderless="true" placeholder="请输入" @change="handleChange" />
        </template>

        <!-- 多选 -->
        <template v-else-if="type === 'mSelect'">
            <t-select v-model="selectValue" :borderless="true" placeholder="-请选择-" multiple>
                <t-option v-for="(item, index) in options" :key="index" :value="index" :label="item.name"></t-option>
            </t-select>
        </template>

        <!-- 日期 -->
        <template v-else-if="type === 'date'">
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
        <template v-else-if="type === 'checkbox'">
            <t-checkbox v-model="value.checked" :borderless="true" @change="handleSubmit" />
        </template>

        <!-- 模板 -->
        <template v-else-if="type === 'template'">
            <t-input v-model="value.content" :borderless="true" placeholder="请输入" readonly />
        </template>

        <template v-else>
            <t-input v-model="value" :borderless="true" placeholder="请输入" />
        </template>
    </BaseRow>
</template>

<script setup lang="ts">
import { useAttributesStore } from '@/store/attribute';
import BaseRow from './BaseRow.vue';
import { computed } from 'vue';
import { fetchPost } from 'siyuan';
import { storeToRefs } from 'pinia';


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

const { dataBaseAttributes } = storeToRefs(attributeStore)
const targetTable = dataBaseAttributes.value[props.avID]
const targetField = targetTable.fields[props.fieldIndex]
const { cellID, keyID, rowID, name, value, type, options } = targetField

const dateRange = computed({
    get() {
        if (type !== "date" || !value.hasEndDate) {
            return undefined
        } else {
            return [value.content, value.content2]
        }
    },
    set(newValue) {
        console.log("set", newValue)
        value.content = newValue[0]
        value.content2 = newValue[1]
    }
})

const selectValue = computed({
    get() {
        if (type === "select") {
            return value.content[0]
        } else if (type === "mSelect") {
            return value.content
        } else {
            return undefined
        }
    },
    set(newValue) {
        console.log("set", newValue)
        if (type === "select") {
            value.content[0] = newValue
        } else if (type === "mSelect") {
            value.content = newValue
        }

        // 映射回去options
        const optionsValue = value.content.map((item) => {
            return options[item]
        })

        fetchPost(
            "/api/av/setAttributeViewBlockAttr",
            {
                "avID": props.avID,
                "cellID": cellID,
                "keyID": keyID,
                "rowID": rowID,
                "value": {
                    "mSelect": {
                        "content": optionsValue
                    }
                },
            },
        );
    }
})

function handleSubmit(x) {
    console.log("handleSubmit", x)
    if (type === "checkbox") {
        fetchPost(
            "/api/av/setAttributeViewBlockAttr",
            {
                "avID": props.avID,
                "cellID": cellID,
                "keyID": keyID,
                "rowID": rowID,
                "value": {
                    "checkbox": {
                        "checked": x
                    }
                },
            },
        );
    } else {
        fetchPost(
            "/api/av/setAttributeViewBlockAttr",
            {
                "avID": props.avID,
                "cellID": cellID,
                "keyID": keyID,
                "rowID": rowID,
                "value": {
                    [type]: {
                        "content": x
                    }
                },
            },
        );
    }
}

function handleChange(x, context) {
    console.log("handleChange", x, context)
    // 'add' | 'reduce' | 'input' | 'blur' | 'enter' | 'clear' | 'props'
    if (["add", "reduce", "blur", "enter", "clear"].indexOf(context.type) === -1) {
        return
    }

    fetchPost(
        "/api/av/setAttributeViewBlockAttr",
        {
            "avID": props.avID,
            "cellID": cellID,
            "keyID": keyID,
            "rowID": rowID,
            "value": {
                [type]: {
                    "content": x
                }
            },
        },
    );
}


function handleDateChange(_, { dayjsValue }) {
    // 转换为时间戳
    if (type === "date") {
        if (value.hasEndDate) {
            value.content = dayjsValue[0].unix() * 1000
            value.content2 = dayjsValue[1].unix() * 1000
        } else {
            value.content = dayjsValue.unix() * 1000
        }
    }

    fetchPost(
        "/api/av/setAttributeViewBlockAttr",
        {
            "avID": props.avID,
            "cellID": cellID,
            "keyID": keyID,
            "rowID": rowID,
            "value": value
        },
    );
}

</script>