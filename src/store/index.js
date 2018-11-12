import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /**
     * 组装 Tree 数据，后端只返回 list集合
     * @param {arr} list tree列表
     * 18/11/12 weid 修改 子、父关联参数 code 、parentCode
     */
    createTerrData(list) {
      if (!list.length) return [];

      const [treeMap, returnTree] = [{}, []];

      for (let i = 0, len = list.length; i < len; i += 1) {
        treeMap[list[i].code] = list[i];
      }

      for (let i = 0, len = list.length; i < len; i += 1) {
        const item = list[i];
        const parent = treeMap[item.parentCode];

        if (parent) {
          (parent.children || (parent.children = [])).push(item);
        } else {
          returnTree.push(item);
        }
      }
      return returnTree;
    },
  },
  mutations: {},
  actions: {},
});
