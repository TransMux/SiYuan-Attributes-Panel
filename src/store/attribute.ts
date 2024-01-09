import { defineStore } from "pinia";
import { fetchPost } from "siyuan";
import { reactive, ref } from "vue";
import { displayRule, useConfigStore } from "./rules";

const pluginKey = "mux-siyuan-plugin-attributes-panel";

export interface innerAttribute extends displayRule {
  value: string;
}

// TODO: Database Data Type

export const useAttributesStore = defineStore(pluginKey + "attrs", () => {
  // Data Flow Model

  // SiYuan --> Inner Store --> UI
  // UI --> API --> SiYuan --> Flush(Based on message --> function) --> UI
  // UI --> Inner Store (UnReliable, based on components)

  // --- Attributes Data Storages ---
  const documentId = ""
  const builtInAttributes = ref([] as Array<innerAttribute>) // 内置数据库属性
  const dataBaseAttributes = reactive({}) // 当前文档所有数据库属性
  const pageBlockAttributes = reactive({}) // 当前块属性

  function fetchInnerAttributes() {
    fetchPost(
      "/api/attr/getBlockAttrs",
      {
        id: documentId,
      },
      ({ data }) => {
        // --- 根据规则过滤, 排序属性 ---
        for (const attributeName in data) {
          const attributeValue = data[attributeName];

          const rule = matchRules(attributeName);

          if (rule && rule.display === true) {
            builtInAttributes.value.push({ ...rule, value: attributeValue });
          }
        }
        // order
        builtInAttributes.value.sort((a, b) => {
          return a.order - b.order;
        })

        // attributes views check
        if ("custom-avs" in data) {
          fetchDBAttributes();
        }
      }
    );
  }

  function fetchDBAttributes() {
    fetchPost(
      "/api/av/getAttributeViewKeys",
      {
        id: documentId,
      },
      ({ data }) => {
        if (!data || data.length === 0) {
          return;
        }

        for (const av of data) {
          // 遍历所有的数据库，转换为关注的数据格式

          const database = { ...av, fields: [] };
          delete database.keyValues;

          database.fields = av.keyValues.flatMap(
            ({ key, values }) => {
              // TODO: Convert Attributes by rules and orders via dragging
              // 跳过主键
              if (key.type === "block") {
                return [];
              }
              const value = values[0];

              let cellValue = value[value.type];
              if (value.type === "select") {
                cellValue = value.mSelect;
              }

              if (value.type === "select" || value.type === "mSelect") {
                // change every cellValue {content: "aaa", color: "1"} -> index
                // 暂时屏蔽name和content的区别，暂时屏蔽对象，注意如果以后content不唯一，这里绝对会出问题
                cellValue = {
                  "content": cellValue.map((v) => {
                    return key.options.findIndex(
                      (option) => option.name === v.content
                    );
                  })
                }
              }

              return [
                {
                  name: key.name,
                  cellID: value.id,
                  keyID: value.keyID,
                  rowID: value.blockID,
                  type: value.type,
                  value: cellValue,
                  options: key.options,
                },
              ];
            }
          );

          this.dataBaseAttributes[av.avID] = database;
        }

        console.log("Converted Attribute Views", this.dataBaseAttributes);
      }
    );
  }

  return {
    documentId, builtInAttributes, dataBaseAttributes, pageBlockAttributes, // Inner States
    fetchInnerAttributes, fetchDBAttributes // Fetch Attribute Actions
  };
});

function matchRules(attributeName: string) {
  const configStore = useConfigStore();
  const rules = configStore.rules;

  return rules.find((rule) => {
    if (rule.matchMethod === '精确' && rule.rule === attributeName) {
      return true;
    }

    if (rule.matchMethod === '通配符' && matchWild(attributeName, rule.rule)) {
      return true;
    }

    if (rule.matchMethod === '正则' && matchRegex(attributeName, rule.rule)) {
      return true;
    }
  });
}

function matchRegex(attributeName: string, rule: string) {
  return false
}

function matchWild(attributeName: string, rule: string) {
  // Wanna imporve this? goto Leetcode #44
  return false
}
