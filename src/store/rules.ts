import { defineStore } from "pinia";
import { Plugin } from "siyuan";
import { Ref, UnwrapRef, inject, ref, unref, watch } from "vue";

interface displayRule {
  name: string; // 规则名

  rule: string; // 匹配属性名 | 匹配规则 | 正则
  matchMethod: string; // 匹配方法, 精确 | 通配符 | 正则
  // TODO: 路径等其他属性的匹配 / 高级匹配

  display: boolean; // 是否显示
  renderMethod?: string; // 渲染方法
  displayAs?: string; // 显示名
  editable?: boolean; // 是否可编辑

  order?: number; // 顺序
  icon?: string; // t-icon name 图标
}

const defaultdisplayRules: Array<displayRule> = [
  {
    name: "文档ID",
    rule: "id",
    matchMethod: "精确",
    display: true,
    displayAs: "块 ID",
    editable: false,
    renderMethod: "link", // TODO: 需要支持识别思源id
    order: 0,
    icon: "link",
  },
  {
    name: "阅读进度",
    rule: "scroll",
    matchMethod: "精确",
    display: false,
  },
  {
    name: "标题",
    rule: "title",
    matchMethod: "精确",
    display: false,
  },
  {
    name: "命名",
    rule: "name",
    matchMethod: "精确",
    display: true,
    displayAs: "命名",
    editable: false,
    renderMethod: "input",
  },
  {
    name: "别名",
    rule: "alias",
    matchMethod: "精确",
    display: true,
    displayAs: "命名",
    editable: false,
    renderMethod: "tag-input",
  },
  {
    name: "类型",
    rule: "type",
    matchMethod: "精确",
    display: false,
  },
  {
    name: "文档图标",
    rule: "icon",
    matchMethod: "精确",
    display: false,
  },
  {
    name: "更新日期",
    rule: "updated",
    matchMethod: "精确",
    display: true,
    displayAs: "命名",
    editable: false,
    renderMethod: "datetime",
    order: 10,
    icon: "calendar-event",
  },
  {
    name: "折叠状态",
    rule: "fold",
    matchMethod: "精确",
    display: false,
  },
  {
    name: "关联数据库", // TODO: 显示为 tag-input readonly
    rule: "custom-avs*",
    matchMethod: "通配符",
    display: false,
  },
];

const pluginKey = "mux-siyuan-plugin-attributes-panel";

export const useConfigStore = defineStore(pluginKey + "configurations", () => {
  const plugin = inject("$plugin") as Plugin;

  function useSiYuanStore<T>(key: string, defaultValue: T): Ref<UnwrapRef<T>> {
    const data = ref(defaultValue);
    const storageKey = `${pluginKey}-${key}`;

    async function load() {
      const config = await plugin.loadData(storageKey);
      console.log("### load", storageKey, config);
      if (!config) {
        await plugin.saveData(storageKey, unref(defaultValue));
        return defaultValue;
      }
      return config;
    }

    async function save() {
      console.log("### save", storageKey, unref(data));
      await plugin.saveData(storageKey, unref(data));
    }

    // Sync with SiYuan Settings
    setTimeout(async () => {
      data.value = await load();

      // Save when change
      watch(data, async () => {
        await save();
      });
    });

    return data;
  }

  // --- Setting Persist Storage ---
  const configurations = useSiYuanStore("configurations", {
    show: true,
    showSettings: {
      page: true,
      block: false,
    },
  });

  // 控制数据可见性，可编辑性
  const rules = useSiYuanStore("rules", defaultdisplayRules);

  return {
    configurations,
    rules,
  };
});
