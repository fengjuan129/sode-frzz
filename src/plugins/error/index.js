import Vue from 'vue';
import { Message } from 'element-ui';
import router from '../../router';

/**
 * 错误处理插件
 */
const errorHandlePlugin = {
  install() {
    Vue.prototype.$errorHandler = function errorHandler(e) {
      const { response } = e; // 从错误对象中获取响应对象
      const { status, data, statusText } = response; // 获取HTTP状态码及返回数据
      const { msg } = data; // 从返回数据中获取错误码及错误提示信息
      if (status === 401) {
        // 未授权时跳转至登录界面并显示提示信息（request.js中已经尝试刷新token，错误到达这里说明未能成功刷新token）
        // * 提示信息优先级为：服务器返回的业务错误提示 > HTTP默认状态码提示
        Message.error({
          title: '操作失败',
          message: msg || `${status} ${statusText}`,
        });
        // TODO: 跳转到登录页面（保留redirect）
        router.push({ name: 'login' });
        return;
      }
      // environment should not be used
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
        title: '操作失败',
        // 根据错误码匹配错误提示信息
        message: msg || `${status} ${statusText}`,
      });
    };
  },
};

Vue.use(errorHandlePlugin);
