import { defineStore } from 'pinia'
// import { fetchPost } from "siyuan";

interface displayRule {
    key: string; // 属性名
    display: boolean; // 是否显示
    displayAs: string; // 显示名
    editable: boolean; // 是否可编辑
    dataType: string; // 数据类型，控制渲染方法
    order: number; // 顺序
}

interface displayRules {
    [key: string]: displayRule;
}

interface UserTemplate {
    rules: CallableFunction; // 规则
    attributes: Array<string>; // 包含的属性名
}

interface UserTemplates {
    [key: string]: UserTemplate;
}

const defaultdisplayRules = {
    "id": {
        key: "id",
        display: true, // 在外面处理
        displayAs: "块 ID",
        editable: false,
        dataType: "文本",
        order: 0, // 在外面处理
    },
}

const defaultRenderMethods = {
    "文本": (value: string, editable: boolean) => {
        return (
            <t-input
                v-model={value}
                disabled={!editable}
                borderless="true"
            />
        );
    }
}

// 持久化保存
export const useRuleStore = defineStore('rules', {
    state: () => ({
        // 控制数据可见性，可编辑性, key: displayRule
        displayRules: {...defaultdisplayRules} as displayRules,
        // 用户自定义模板，用于快速填充
        userTemplates: {} as UserTemplates,
        // 渲染方法
        renderMethods: {...defaultRenderMethods} as any,
    }),
    getters: {
    },
    actions: {
    },
})