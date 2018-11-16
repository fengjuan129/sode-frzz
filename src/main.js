import 'normalize.css';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './plugins/element';
import './plugins/errorHandlePlugin';
import config from './config';

// 如果当前不是生产环境且启用了本地mock功能，加载本地mock配置
if (process.env.NODE_ENV !== 'production' && config.mock.enabled && config.mock.mode === 'local') {
  require('./mock'); // eslint-disable-line global-require
}

// 关闭生产环境的提示
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
