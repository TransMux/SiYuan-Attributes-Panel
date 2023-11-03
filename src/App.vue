<template>
    <Draggable>
        <div class="Mux-Attribute-Panel move-transition" :style="{ ...panelState }">
            <AttributePanel />
        </div>
    </Draggable>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, reactive, ref } from 'vue';
import AttributePanel from './views/AttributePanel.vue';
import { useAttributesStore } from '@/store/attribute';

const attributeStore = useAttributesStore();

const panelHeight = computed(() => {
    const rows = Object.keys(attributeStore.ordered).length;
    const rowsHeight = rows * 32 + (rows - 1) * 10;
    const cardHeight = 24 * 2 + rowsHeight;
    const containerHeight = 18 * 2 + cardHeight;
    return containerHeight;
});

function handleProtyleOpen({ detail }) {
    const openedProtyle = detail.protyle
    if (panelVisible.value) {
        attributeStore.inspectBlock(openedProtyle.block.id);
    }
}

function handleProtyleSwitch({ detail }) {
    const openedProtyle = detail.protyle
    if (panelVisible.value) {
        attributeStore.inspectBlock(openedProtyle.block.id);
    }
}

onMounted(() => {
    attributeStore.fetchAttributes();
    window.addEventListener('keydown', handleKeyDownEvent);
    const eventBus = inject("$EventBus");
    // @ts-ignore
    eventBus.on("loaded-protyle-static", handleProtyleOpen);
    // @ts-ignore
    eventBus.on("switch-protyle", handleProtyleSwitch)
});

// detect shift double click
let firstShift = undefined;
const panelVisible = ref(false);
const panelState = reactive({
    visibility: 'hidden',
    opacity: 0,
    top: "100px",
    left: "100px",
});

function handleKeyDownEvent(e: KeyboardEvent) {
    if (e.key === 'Shift' && !panelVisible.value) {
        if (firstShift === undefined) {
            firstShift = Date.now();
        } else {
            if (Date.now() - firstShift < 300) {
                showPanel();
                attributeStore.clearState();
            }
            firstShift = undefined;
        }
    } else if (e.key === 'Escape' && panelVisible.value) {
        hidePanel();
    }
}

let mouseMoveListener = undefined;

function showPanel() {
    panelVisible.value = true;
    setTimeout(() => {
        panelState.visibility = 'visible';
        panelState.opacity = 1;
    }, 0);
    // event listener: move panel to mouse position
    mouseMoveListener = (e: MouseEvent) => {
        // move only points element has is <span draggable="true"></span>
        if (e.target.tagName !== 'SPAN' || e.target.getAttribute('draggable') !== 'true') {
            return;
        }
        // get parent element button's data-node-id
        const button = e.target.parentElement;
        const nodeId = button.getAttribute('data-node-id');
        if (!nodeId || nodeId === attributeStore.inspectBlockId) {
            return;
        }
        attributeStore.inspectBlock(nodeId);

        // get target element center
        // const targetRect = button.getBoundingClientRect();
        // const targetCenterX = targetRect.left + targetRect.width / 2;
        // const targetCenterY = targetRect.top + targetRect.height / 2;

        // panelState.bottom = window.innerHeight - targetCenterY - panelHeight.value - 50 + 'px';
        // panelState.right = window.innerWidth - targetCenterX - 500 - 50 + 'px';
    };
    window.addEventListener('mousemove', mouseMoveListener);
    // event listener: hide panel when "esc"
    window.addEventListener('keydown', handleKeyDownEvent);
}

function hidePanel() {
    window.removeEventListener('mousemove', mouseMoveListener);
    panelState.visibility = 'hidden';
    panelState.opacity = 0;
    setTimeout(() => {
        panelVisible.value = false;
    }, 300);
}
</script>

<style scoped>
/* Make this vue component floating on the page */
.Mux-Attribute-Panel {
    position: absolute;
    /* make it center */
    width: 400px;
    border-left: 1px solid #ebeef5;
    z-index: 999;
    overflow-y: hidden;

    padding: 18px 18px;
    background-color: var(--b3-toolbar-background);
    border-radius: var(--td-radius-medium);

    /* Shadow */
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.move-transition {
    transition: all 0.05s;
}
</style>