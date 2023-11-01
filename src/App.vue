<template>
    <div class="Mux-Attribute-Panel">
        Hello
    </div>
</template>

<style scoped>
/* Make this vue component floating on the page */
.Mux-Attribute-Panel {
    position: absolute;
    bottom: 0;
    /* make it center */
    left: 50%;
    transform: translateX(-50%);
    width: 300px;
    height: 100px;
    background-color: #fff;
    border-left: 1px solid #ebeef5;
    z-index: 999;
}
</style>