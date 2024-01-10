<template>
    <AttributePanel />
</template>

<script setup lang="ts">
import { useAttributesStore } from './store/attribute';
import AttributePanel from './views/AttributePanel.vue';

const attributeStore = useAttributesStore();
attributeStore.fetchInnerAttributes();
</script>

<style scoped></style>