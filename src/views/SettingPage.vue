<template>
    <div>
        <h1>Setting Page</h1>
        {{ attributeStore.inspectBlockId }}
    </div>
</template>

<script setup lang="ts">
import { useAttributesStore } from '@/store/attribute';

const attributeStore = useAttributesStore();

</script>