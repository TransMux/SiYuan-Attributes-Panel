<template>
    <div class="attribute-panel">
        <template v-if="Object.keys(attributeStore.dataBaseAttributes).length === 0">
            <!-- 只有内置的话就只显示内置的 -->
            <BuiltInAttrs />
        </template>

        <template v-else>
            <t-tabs :default-value="Object.keys(attributeStore.dataBaseAttributes)[0]">
                <!-- 否则默认显示第一个数据库 -->
                <t-tab-panel value="builtin">
                    <template #label> <t-icon name="table-1" class="tabs-icon-margin" /> 内置属性 </template>
                    <KeepAlive>
                        <BuiltInAttrs />
                    </KeepAlive>
                </t-tab-panel>

                <template v-for="(av, avID) in attributeStore.dataBaseAttributes" :key="avID">
                    <t-tab-panel :value="avID">
                        <template #label> <t-icon name="data-base" class="tabs-icon-margin" /> {{ av.avName || avID }}
                        </template>
                        <KeepAlive>
                            <DbAttrs :avID="avID" />
                        </KeepAlive>
                    </t-tab-panel>
                </template>
            </t-tabs>

        </template>
    </div>
</template>

<script setup lang="ts">
import { useAttributesStore } from '@/store/attribute';

// 通过文档id，渲染对应的属性面板
const attributeStore = useAttributesStore();
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

:deep(.t-card) {
    margin-top: 8px;
}

.content {
    /* Gray */
    color: #4F4F4F;
    font-size: 14px;
    line-height: 20px;
    margin-bottom: 4px;
}

.tabs-icon-margin {
    margin-right: 4px;
}
</style>