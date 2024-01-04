import {
    Plugin,
} from "siyuan";
import "@/index.scss";

// Vue
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import 'tdesign-vue-next/es/style/index.css';
import { DraggablePlugin } from '@braks/revue-draggable';

export default class PluginSample extends Plugin {
    onLayoutReady() {
        this.eventBus.on("loaded-protyle-static", this.initPagePanel);
    }

    async onunload() {
        // remove #mux-attribute-panel element
        this.eventBus.off("loaded-protyle-static", this.initPagePanel);
        document.querySelector('#mux-attribute-panel')?.remove()
    }

    private initPagePanel({ detail }) {
        const openedProtyle = detail.protyle

        // Step 1: Find the element with the specific data-node-id and class
        const parentNode = document.querySelector(`div[data-node-id="${openedProtyle.block.id}"].protyle-title`);

        if (parentNode) {
            // Step 2: Find the child div with class 'protyle-attr'
            const targetNode = parentNode.querySelector('div.protyle-attr');

            if (targetNode) {
                // if has mux-attribute-panel, return
                // 刷新文档会重复插入属性面板
                // https://github.com/InEase/SiYuan-Attributes-Panel/issues/1
                if (openedProtyle.element.getElementsByClassName("mux-attribute-panel").length > 0) return

                // Step 3: Insert a new div element with class 'mux-attribute-panel' after the target node
                const newDiv = document.createElement('div');
                newDiv.className = 'mux-attribute-panel';
                targetNode.after(newDiv);

                // Step 4: Initialize Vue on the new div element
                const app = createApp(App)
                const pinia = createPinia()
                // Mount
                app.use(pinia)
                app.use(DraggablePlugin); // Use the required plugins
                app.provide("$EventBus", this.eventBus); // Replace 'new Vue()' with your EventBus instance
                app.provide("$blockId", openedProtyle.block.id); // Replace 'new Vue()' with your EventBus instance
                app.mount(newDiv);
            } else {
                console.error('Target child div not found');
            }
        } else {
            console.error('Parent node not found');
        }
    }
}
