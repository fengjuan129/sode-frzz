// 账号状态管理
import Vue from 'vue';
import * as resApi from '@/api/res';
import { data2treeArr } from '@/libs/utils';

export default {
  namespaced: true,
  state: {
    // 当前账号
    currentUser: {},
    // 当前账号的菜单
    menus: [],
  },
  mutations: {
    /**
     * 设置当前账号菜单
     * @param {object} state 状态数据
     * @param {array} menus 菜单数组
     */
    setCurUserMenus(state, menus) {
      state.menus = menus;
    },
  },
  actions: {
    /**
     * 加载当前账号的菜单
     */
    loadCurUserMenus({ commit }) {
      resApi
        .loadCurUserMenus()
        .then(menus => {
          commit('setCurUserMenus', menus);
        })
        // 调用Vue原型中的错误处理器（因为这里不是组件，所以不能使用this.$errorHandler的写法）
        .catch(Vue.prototype.$errorHandler);
    },
  },
  getters: {
    // 树形结构菜单数组
    menuData(state) {
      return data2treeArr(state.menus, 'id', 'parentId');
    },
  },
};
