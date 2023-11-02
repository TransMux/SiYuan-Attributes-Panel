import { defineStore } from 'pinia'
import { fetchPost } from "siyuan";

export const useAttributesStore = defineStore('attributes', {
    state: () => ({
        inspectBlockId: "20231101144112-klqcrrt",
        attributes: [],
    }),
    getters: {
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
        }
    },
})