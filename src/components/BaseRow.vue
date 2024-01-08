<template>
    <div class="attribute-row">
        <t-select :default-value="name" :borderless="true" class="attr-selector" placeholder="-请选择-" :showArrow="false"
            readonly>
            <template #prefixIcon>
                <icon :name="icon" />
            </template>
        </t-select>
        <slot />
    </div>
</template>

<script setup lang="ts">
import { Icon } from 'tdesign-icons-vue-next';

defineProps({
    name: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        required: false,
        default: 'view-list'
    },
    callback: {
        type: Function,
        required: false,
        default: () => { }
    },
});
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