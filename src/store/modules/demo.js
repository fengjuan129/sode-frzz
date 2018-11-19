export default {
  namespaced: true,
  state: {
    count: 0,
  },
  mutations: {
    increament(state) {
      state.count += 1;
    },
  },
  actions: {
    asyncIncreament({ commit }) {
      setTimeout(() => {
        commit('increament');
      }, 1000);
    },
  },
  getters: {
    doubleCount(state) {
      return state.count * 2;
    },
  },
};
