import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins';
import './filters';

// 如果当前不是生产环境且启用了本地mock功能，加载本地mock配置
if (
  process.env.NODE_ENV !== 'production' &&
  process.env.VUE_APP_MOCK_ENABLED &&
  process.env.VUE_APP_MOCK_MODE === 'local'
) {
  require('./mock'); // eslint-disable-line global-require
}

// 关闭生产环境的提示
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
