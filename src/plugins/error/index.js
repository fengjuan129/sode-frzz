import Vue from 'vue';
import { Message } from 'element-ui';
import router from '../../router';

/**
 * 错误处理插件
 */
const errorHandlePlugin = {
  install() {
    Vue.prototype.$errorHandler = function errorHandler(e = {}) {
      // 如果当前是开发环境，在控制台输出错误
      if (process.env.NODE_ENV === 'development') {
        console.error(e);
      }
      const { response } = e; // 从错误对象中获取响应对象
      const { status, data, statusText } = response || {}; // 获取HTTP状态码及返回数据
      let { msg } = data || {}; // 从返回数据中获取错误码及错误提示信息
      // 如果response不存在，表示错误不是由后端返回，此时错误信息直接从错误对象获取
      if (!response) {
        msg = e.message;
      }
      if (status === 401) {
        // 未授权时跳转至登录界面并显示提示信息（request.js中已经尝试刷新token，错误到达这里说明未能成功刷新token）
        // * 提示信息优先级为：服务器返回的业务错误提示 > HTTP默认状态码提示
        Message.error({
          message: msg || `${status} ${statusText}`,
        });
        // TODO: 跳转到登录页面（保留redirect）
        router.push({ name: 'login' });
        return;
      }
      if (status === 403) {
        router.push({ name: '403' });
        return;
      }
      if (status <= 504 && status >= 500) {
        router.push({ name: '500' });
        return;
      }
      if (status >= 404 && status < 422) {
        router.push({ name: '404' });
        return;
      }
      // 其他类型的错误显示提示信息
      Message.error({
        // 根据错误码匹配错误提示信息
        message: msg || `${status} ${statusText}`,
      });
    };
  },
};

Vue.use(errorHandlePlugin);
