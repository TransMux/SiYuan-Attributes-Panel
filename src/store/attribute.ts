import { defineStore } from "pinia";
import { fetchPost } from "siyuan";
import { reactive } from "vue";
import { Plugin } from "siyuan";
import { Ref, UnwrapRef, computed, inject, ref, unref, watch } from "vue";

const pluginKey = "mux-siyuan-plugin-attributes-panel";

export const useAttributesStore = defineStore(pluginKey, () => {
  // Defining a Store using Setup | Pinia
  // https://pinia.vuejs.org/core-concepts/#Setup-Stores
  const plugin = inject("$plugin") as Plugin;

  function useSiYuanStore<T>(key: string, defaultValue: T): Ref<UnwrapRef<T>> {
    const data = ref(defaultValue);
    const storageKey = `${pluginKey}-${key}`

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
  const configuration = useSiYuanStore("configuration", {
    show: true,
    showSettings: {
      "page": true,
      "block": false,
    }
  });

  // --- Attributes Data Storages ---
  const inspectBlockId = ""
  const bulitInAttributes = reactive({}) // 内置数据库属性
  const dataBaseAttributes = reactive({}) // 当前文档所有数据库属性
  const pageBlockAttributes = reactive({}) // 当前块属性

  function fetchAttributes(blockId: string) {
    fetchPost(
      "/api/attr/getBlockAttrs",
      {
        id: blockId,
      },
      (res: any) => {
        this.attributes = res.data;
        // doc check
        if ("title" in this.attributes) {
          // attributes views check
          if ("custom-avs" in this.attributes) {
            fetchPost(
              "/api/av/getAttributeViewKeys",
              {
                id: blockId,
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

                  this.avs[av.avID] = database;
                }
              }
            );
          }

          console.log("Converted Attribute Views", this.avs);
        }
      }
    );
  }

  return { configuration, inspectBlockId, bulitInAttributes, dataBaseAttributes, pageBlockAttributes };
});





export const useAttributesStore = defineStore("attributes", {
  actions: {
    fetchAttributes() {
      fetchPost(
        "/api/attr/getBlockAttrs",
        {
          id: blockId,
        },
        (res: any) => {
          this.attributes = res.data;
          // doc check
          if ("title" in this.attributes) {
            // attributes views check
            if ("custom-avs" in this.attributes) {
              // TODO: Unstable API
              fetchPost(
                "/api/av/getAttributeViewKeys",
                {
                  id: this.inspectBlockId,
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

                    this.avs[av.avID] = database;
                  }
                }
              );
            }

            console.log("Converted Attribute Views", this.avs);
          }
        }
      );
    },
    inspectBlock(blockId: string) {
      this.inspectBlockId = blockId;
      this.fetchAttributes();
    },
    setAttribute(attribute: string, value: string, callback?: any) {
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
    },
  },
});
