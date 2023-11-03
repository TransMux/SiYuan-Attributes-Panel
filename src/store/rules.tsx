import { defineStore } from "pinia";
// import { fetchPost } from "siyuan";
import dayjs from "dayjs";
import { Input, DatePicker, Link, Switch, TagInput } from "tdesign-vue-next";
import {
  CalendarEventIcon,
  LinkIcon,
  ViewListIcon,
  ComponentSwitchIcon,
  ViewAgendaIcon,
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
  display: CallableFunction; // 规则
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
  name: {
    key: "name",
    display: true,
    displayAs: "命名",
    editable: true,
    dataType: "文本",
    order: 0,
    icon: <ViewListIcon />,
  },
  alias: {
    key: "alias",
    display: true,
    displayAs: "别名",
    editable: true,
    dataType: "标签输入框",
    order: 0,
    icon: <ViewAgendaIcon />,
  },
  type: {
    key: "type",
    display: false,
    displayAs: "类型",
    editable: false,
    dataType: "文本",
    order: 0,
  },
  icon: {
    key: "icon",
    display: false,
    displayAs: "图标",
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
  fold: {
    key: "fold",
    display: true,
    displayAs: "折叠状态",
    editable: true,
    dataType: "开关",
    order: 30,
    icon: <ComponentSwitchIcon />,
  },
  "custom-avs": {
    key: "custom-avs",
    display: false,
    displayAs: "对应数据库",
    editable: false,
    dataType: undefined,
    order: 30,
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
        placeholder=""
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
  开关: (value: string, editable: boolean, submit: any) => {
    function customSubmit(value: boolean) {
      submit(value ? "1" : "0");
    }

    return (
      <Switch
        defaultValue={value === "1"}
        disabled={!editable}
        onChange={customSubmit}
      />
    );
  },
  标签输入框: (value: string, editable: boolean, submit: any) => {
    function customSubmit(value: Array<string>) {
      submit(value.join(","));
    }

    return (
      <TagInput
        defaultValue={value ? value.split(",") : []}
        disabled={!editable}
        borderless
        autoWidth={value && value !== ""}
        onBlur={customSubmit}
        placeholder=""
        excessTagsDisplayType="scroll"
      />
    );
  },
};

const defaultTemplates = {
  文档属性: {
    display: (allAttributes) => {
      return "title" in allAttributes;
    },
    attributes: ["name", "alias"], // 命名，别名
  },
};

// 持久化保存
export const useRuleStore = defineStore("rules", {
  state: () => ({
    // 控制数据可见性，可编辑性, key: displayRule
    displayRules: { ...defaultdisplayRules } as displayRulesType,
    // 用户自定义模板，用于快速填充
    userTemplates: { ...defaultTemplates } as UserTemplates,
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
