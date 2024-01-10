<template>
    <t-layout style="height: 100%;">
        <t-aside v-if="true">
            <t-menu theme="light" value="dashboard" style="margin-right: 50px" height="550px">
                <t-menu-item value="dashboard">
                    <template #icon>
                        <t-icon name="dashboard" />
                    </template>
                    Command Palette
                </t-menu-item>
            </t-menu>
        </t-aside>
        <t-layout>
            <t-content>
                <div class="layout">
                    <SettingContent />
                </div>
            </t-content>
            <t-footer>Copyright @ 2022-{{ new Date().getFullYear() }} TransMux. All Rights Reserved</t-footer>
        </t-layout>
    </t-layout>
</template>

<script setup lang="ts">
import SettingContent from './SettingContent.vue';
</script>

<style scoped>
.layout {
    padding: var(--td-comp-paddingTB-xl) var(--td-comp-paddingLR-xl);
}
</style>