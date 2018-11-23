import Vue from 'vue';
import Vuex from 'vuex';
import global from './modules/global';
import dept from './modules/dept';
import user from './modules/user';
import demo from './modules/demo';

Vue.use(Vuex);

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', // 非生产环境下启用严格模式
  state: {},
  mutations: {},
  actions: {},
  modules: {
    global,
    demo,
    dept,
    user,
  },
});
