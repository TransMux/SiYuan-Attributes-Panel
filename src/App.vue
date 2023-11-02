<template>
    <div class="Mux-Attribute-Panel" :style="{ height: height + 'px' }">
        <AttributePanel />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import AttributePanel from './views/AttributePanel.vue';
import { useAttributesStore } from '@/store/attribute';

const attributeStore = useAttributesStore();

const height = computed(() => {
    const rows = attributeStore.ordered.length;
    const rowsHeight = rows * 32 + (rows - 1) * 10;
    const cardHeight = 24 * 2 + rowsHeight;
    const containerHeight = 18 * 2 + cardHeight;
    return containerHeight;
});

</script>

<style scoped>
/* Make this vue component floating on the page */
.Mux-Attribute-Panel {
    position: absolute;
    bottom: 100px;
    /* make it center */
    left: 50%;
    transform: translateX(-50%);
    width: 500px;
    border-left: 1px solid #ebeef5;
    z-index: 999;
    overflow-y: scroll;

    padding: 18px 18px;
    background-color: var(--b3-toolbar-background);
    border-radius: var(--td-radius-medium);
}
</style>