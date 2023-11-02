import { defineStore } from 'pinia'
import { fetchPost } from "siyuan";
import { useRuleStore } from '@/store/rules';

export const useAttributesStore = defineStore('attributes', {
    state: () => ({
        inspectBlockId: "20231101144112-klqcrrt",
        attributes: [],
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
                console.log("###Mux Fetched Attributes for", this.inspectBlockId, res);
                this.attributes = res.data;
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
        }
    },
})