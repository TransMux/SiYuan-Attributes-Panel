import { defineStore } from "pinia";
import { fetchPost } from "siyuan";
import { useRuleStore } from "@/store/rules";

export const useAttributesStore = defineStore("attributes", {
  state: () => ({
    inspectBlockId: "20231101144112-klqcrrt",
    attributes: {},
    content: "",
    docPath: "打开一个文档以获取文档信息...", // 当前文档人类可读路径，包括笔记本
    avs: [], // 当前文档所有数据库
  }),
  getters: {
    ordered() {
      const ruleStore = useRuleStore();

      const attributes = this.attributes;
      window.attributes = attributes
      const orderResult = {};
      Object.keys(attributes)
        .flatMap((key) => {
          const conrespondingRule = ruleStore.displayRules[key];
          if (conrespondingRule && !conrespondingRule.display) {
            // 不显示
            return [];
          }
          return [key];
        })
        .sort((key) => {
          const conrespondingRule = ruleStore.displayRules[key];
          if (conrespondingRule) {
            return conrespondingRule.order || 9999;
          }
          // 没有的排在最下面
          return 99999;
        })
        .forEach((key) => {
          orderResult[key] = attributes[key];
        });
      return orderResult;
    },
  },
  actions: {
    fetchAttributes() {
      fetchPost(
        "/api/attr/getBlockAttrs",
        {
          id: this.inspectBlockId,
        },
        (res: any) => {
          this.attributes = res.data;
          // doc check
          if ("title" in this.attributes && "scroll" in this.attributes) {
            const startId = JSON.parse(this.attributes.scroll).startId;
            if (!startId) {
              return;
            }

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
                        return [
                          {
                            name: key.name,
                            cellID: value.id,
                            keyID: value.keyID,
                            rowID: value.blockID,
                            type: value.type,
                            value: value[value.type],
                          },
                        ];
                      }
                    );

                    this.avs.push(database);
                  }
                }
              );
            }

            console.log("Converted Attribute Views", this.avs);

            // 通过获取第一个块的面包屑来获取文档路径和文档内容
            fetchPost(
              "/api/block/getBlockBreadcrumb",
              {
                id: startId,
              },
              (res: any) => {
                const breadcrumb = res.data;
                this.docPath = breadcrumb[0].name;
                this.setContent(breadcrumb[1].name);
                console.log("updated doc path", this.docPath, this.content);
              }
            );
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
