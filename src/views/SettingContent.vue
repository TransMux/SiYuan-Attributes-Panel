<template>
    <div class="setting command-palette detail-base">
        <t-card title="设置" :bordered="false">

        </t-card>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';


</script>

<style scoped lang="scss">
.step {
    margin-bottom: var(--td-comp-margin-xxl);
}

.detail-base {
    :deep(.t-card) {
        padding: var(--td-comp-paddingTB-xxl) var(--td-comp-paddingLR-xxl);
    }

    :deep(.t-card__header) {
        padding: 0;
        margin-bottom: var(--td-comp-margin-m);
    }

    :deep(.t-card__body) {
        padding: 0;
    }

    :deep(.t-card__title) {
        font: var(--td-font-title-large);
        font-weight: 400;
    }

    &-info-steps {
        padding-top: var(--td-comp-margin-xl);
    }
}

.info-block {
    column-count: 2;

    .info-item {
        padding-top: var(--td-comp-margin-xxl);
        display: flex;
        color: var(--td-text-color-primary);

        h1 {
            width: 160px;
            font: var(--td-font-body-medium);
            color: var(--td-text-color-secondary);
            font-weight: normal;
            text-align: left;
        }

        span {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            margin-left: var(--td-comp-margin-xxl);
        }

        i {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: var(--td-radius-circle);
            background: var(--td-success-color);
        }
    }
}

.drag-area {
    justify-content: center;
    align-items: center;
    display: flex;
    border: 1px dashed var(--td-component-border);
    border-radius: var(--td-radius-small);
    font: var(--td-font-body-medium);
    color: var(--td-text-color-secondary);
    cursor: pointer;
    padding: var(--td-comp-margin-l);
    position: relative;
    overflow: auto;
    box-sizing: border-box;
    transition: border-color .2s linear;
}

.drag-area:hover {
    border-color: var(--td-brand-color);
}
</style>
