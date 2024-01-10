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
        this.eventBus.on("loaded-protyle-static", this.createInitEventHandler(this));
    }

    async onunload() {
        // remove #mux-attribute-panel element
        this.eventBus.off("loaded-protyle-static", this.createInitEventHandler(this));
        document.querySelector('#mux-attribute-panel')?.remove()
    }

    private createInitEventHandler(plugin) {
        return ({ detail }) => {
            const openedProtyle = detail.protyle

            // 本来想限制只有id开头为20才是完整id, 后来想了想还是为能够活到2100的人提供支持吧嘿嘿
            if (!openedProtyle.block.id || !openedProtyle.block.id.startsWith("2")) return

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

                    app.provide("$plugin", plugin);
                    app.provide("$EventBus", plugin.eventBus);
                    app.provide("$docId", openedProtyle.block.id);

                    app.use(pinia)
                    app.use(DraggablePlugin);

                    app.mount(newDiv);
                } else {
                    console.log('Target child div not found');
                }
            } else {
                console.log('Parent node not found');
            }
        }
    }
}
