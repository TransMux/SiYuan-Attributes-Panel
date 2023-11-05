import { defineStore } from 'pinia'
import { fetchPost } from "siyuan";
import { useRuleStore } from '@/store/rules';

export const useAttributesStore = defineStore('attributes', {
    state: () => ({
        inspectBlockId: "20231101144112-klqcrrt",
        attributes: {},
        content: "",
        docPath: "打开一个文档以获取文档信息...", // 当前文档人类可读路径，包括笔记本
    }),
    getters: {
        ordered() {
            const ruleStore = useRuleStore();

            const attributes = this.attributes;
            const orderResult = {};
            Object.keys(attributes).flatMap(key => {
                const conrespondingRule = ruleStore.displayRules[key];
                if (conrespondingRule && !conrespondingRule.display) {
                    // 不显示
                    return []
                }
                return [key];
            }).sort(key => {
                const conrespondingRule = ruleStore.displayRules[key];
                if (conrespondingRule) {
                    return conrespondingRule.order || 9999;
                }
                // 没有的排在最下面
                return 99999;
            }).forEach(key => {
                orderResult[key] = attributes[key];
            });
            return orderResult;
        }
    },
    actions: {
        fetchAttributes() {
            fetchPost('/api/attr/getBlockAttrs', {
                id: this.inspectBlockId,
            }, (res: any) => {
                this.attributes = res.data;
                // doc check
                if ("title" in this.attributes && "scroll" in this.attributes) {
                    const startId = JSON.parse(this.attributes.scroll).startId;
                    if (!startId) {
                        return;
                    }

                    // 通过获取第一个块的面包屑来获取文档路径和文档内容
                    fetchPost('/api/block/getBlockBreadcrumb', {
                        id: startId
                    }, (res: any) => {
                        const breadcrumb = res.data;
                        this.docPath = breadcrumb[0].name;
                        this.setContent(breadcrumb[1].name);
                        console.log("updated doc path", this.docPath, this.content)
                    });
                }
            });
        },
        inspectBlock(blockId: string) {
            this.inspectBlockId = blockId;
            this.fetchAttributes();
        },
        setAttribute(
            attribute: string,
            value: string,
            callback?: any
        ) {
            fetchPost(
                "/api/attr/setBlockAttrs",
                {
                    id: this.inspectBlockId,
                    attrs: {
                        [attribute]: value,
                    },
                },
                callback
            );
            // update
            this.attributes[attribute] = value;
        },
        clearState() {
            this.inspectBlockId = "";
            this.attributes = {};
        },
        setContent(content: string) {
            if (content.length > 30) {
                this.content = content.slice(0, 30) + "...";
            } else {
                this.content = content;
            }
        }
    },
})