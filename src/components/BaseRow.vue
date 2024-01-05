<template>
    <div class="attribute-row">
        <t-select :default-value="name" :borderless="true" class="attr-selector" placeholder="-请选择-" :showArrow="false"
            readonly>
            <template #prefixIcon>
                <icon :name="icon" />
            </template>
        </t-select>
        <!-- This is rendered by displayElement. -->
        <t-loading :loading="submitting" size="small">
            <slot />
        </t-loading>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Icon } from 'tdesign-icons-vue-next';

const props = defineProps({
    name: {
        type: String,
        required: true,
    },
    key: {
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

const submitting = ref(false);

function handleSubmit(text) {
    submitting.value = true;
    props.callback(text)
    submitting.value = false;
}

</script>