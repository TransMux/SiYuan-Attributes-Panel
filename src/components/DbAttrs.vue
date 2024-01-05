<template>
    <t-card :bordered="false">
        <DebugInfo />
        <template v-if="avID">

            <!-- <AttributeRowAdd /> -->
        </template>

        <template v-else>
            暂无属性
        </template>
    </t-card>
</template>


<script setup lang="ts">
import AttributeRow from '@/components/AttributeRow.vue';
import { useAttributesStore } from '@/store/attribute';
import { useRuleStore } from '@/store/rules';
import { ref, watch } from 'vue';

const props = defineProps({
    avID: {
        type: String,
        required: true,
    },
});

// 通过数据库id，渲染对应的属性面板
const attributeStore = useAttributesStore();

const targetTable = attributeStore.avs.find((av) => av.avID === props.avID)
console.log(targetTable)

</script>


<style scoped>
.form-step-container {
    background-color: var(--td-bg-color-container);
    padding: 12px 12px;
    border-radius: var(--td-radius-medium);
    height: 100%;
}

:deep(.t-card__body) {
    padding: 0px 0px;
}

.content {
    /* Gray */
    color: #4F4F4F;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 4px;
}
</style>