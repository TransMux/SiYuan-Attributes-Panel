import { defineStore } from "pinia";
// import { fetchPost } from "siyuan";
import dayjs from "dayjs";
import { Input, DatePicker } from "tdesign-vue-next";
import { CalendarEventIcon, ViewListIcon } from "tdesign-icons-vue-next";

interface displayRule {
  key: string; // 属性名
  display: boolean; // 是否显示
  displayAs: string; // 显示名
  editable: boolean; // 是否可编辑
  dataType: string; // 数据类型，控制渲染方法
  order: number; // 顺序
  icon?: any; // 图标
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
  id: {
    key: "id",
    display: true, // 在外面处理
    displayAs: "块 ID",
    editable: false,
    dataType: "文本",
    order: 0, // 在外面处理
    icon: <ViewListIcon />,
  },
  scroll: {
    key: "scroll",
    display: false,
    displayAs: "滚动进度",
    editable: false,
    dataType: "文本",
    order: 0,
  },
  title: {
    key: "title",
    display: false,
    displayAs: "标题",
    editable: false,
    dataType: "文本",
    order: 0,
  },
  updated: {
    key: "updated",
    display: true,
    displayAs: "更新日期",
    editable: false,
    dataType: "日期时间",
    order: 10,
    icon: <CalendarEventIcon />,
  },
};

const defaultRenderMethods = {
  文本: (value: string, editable: boolean) => {
    return <Input v-model={value} disabled={!editable} borderless="true" />;
  },
  日期时间: (value: string, editable: boolean) => {
    // convert 20231102190552 to Date
    const date = dayjs(value, "YYYYMMDDHHmmss").toDate();

    return (
      <DatePicker
        v-model={date}
        enable-time-picker
        disabled={!editable}
        clearable
        borderless="true"
      />
    );
  },
};

// 持久化保存
export const useRuleStore = defineStore("rules", {
  state: () => ({
    // 控制数据可见性，可编辑性, key: displayRule
    displayRules: { ...defaultdisplayRules } as displayRules,
    // 用户自定义模板，用于快速填充
    userTemplates: {} as UserTemplates,
    // 渲染方法
    renderMethods: { ...defaultRenderMethods } as any,
  }),
  getters: {},
  actions: {},
});
