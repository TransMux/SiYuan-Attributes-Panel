import { defineStore } from "pinia";
// import { fetchPost } from "siyuan";
import dayjs from "dayjs";
import { Input, DatePicker, Link } from "tdesign-vue-next";
import {
  CalendarEventIcon,
  LinkIcon,
  ViewListIcon,
} from "tdesign-icons-vue-next";

interface displayRule {
  key: string; // 属性名
  display: boolean; // 是否显示
  displayAs: string; // 显示名
  editable: boolean; // 是否可编辑
  dataType: string; // 数据类型，控制渲染方法
  order: number; // 顺序
  icon?: any; // 图标
}

interface displayRulesType {
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
    dataType: "块ID跳转",
    order: 0, // 在外面处理
    icon: <LinkIcon />,
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
  source: {
    key: "source",
    display: true,
    displayAs: "源",
    editable: true,
    dataType: "文本",
    order: 20,
    icon: <ViewListIcon />,
  },
};

const defaultRenderMethods = {
  块ID跳转: (value: string, _editable: boolean, _submit: any) => {
    const url = `siyuan://blocks/${value}`;
    return (
      <Link theme="primary" hover="color" href={url}>
        {value}
      </Link>
    );
  },
  文本: (value: string, editable: boolean, submit: any) => {
    return (
      <Input
        defaultValue={value}
        disabled={!editable}
        borderless
        autoWidth={value !== ""}
        onEnter={submit}
      />
    );
  },
  日期时间: (value: string, editable: boolean, submit: any) => {
    // convert 20231102190552 to Date
    if (value.length === 14) {
      value = dayjs(value, "YYYYMMDDHHmmss").format("YYYY-MM-DD HH:mm:ss");
    } else if (value === "") {
      value = dayjs().format("YYYY-MM-DD HH:mm:ss");
    }

    return (
      <DatePicker
        defaultValue={value}
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
    displayRules: { ...defaultdisplayRules } as displayRulesType,
    // 用户自定义模板，用于快速填充
    userTemplates: {} as UserTemplates,
    // 渲染方法
    renderMethods: { ...defaultRenderMethods } as any,
  }),
  getters: {
    createOptions(): Array<displayRule> {
      return Object.values(this.displayRules).flatMap((rule: displayRule) => {
        if (!rule.display || !rule.editable) return [];

        return rule;
      });
    },
  },
  actions: {},
});
