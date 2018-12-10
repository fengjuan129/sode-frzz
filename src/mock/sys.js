// 模拟系统服务相关接口
import Mock from 'mockjs';

// 获取码表数据
Mock.mock(new RegExp('^/v1/core/sys/codetable'), 'get', () => ({
  isEnable: [{ text: '启用', value: true }, { text: '禁用', value: false }], // 是否启用
  isVisible: [{ text: '是', value: true }, { text: '否', value: false }], // 是否可见
  authType: [
    // 菜单授权方式
    { text: '公开', value: 'public' },
    { text: '公共', value: 'protected' },
    { text: '授权', value: 'private' },
  ],
  menuType: [
    // 菜单类型
    { text: '主页面', value: 'main' },
    { text: '内嵌页面', value: 'inner' },
    { text: '弹出窗口', value: 'popup' },
  ],
  isCorporation: [{ text: '是', value: true }, { text: '否', value: false }], // 是否法人
  securityLevel: [
    { text: '公开', value: '1' },
    { text: '内部', value: '2' },
    { text: '秘密', value: '3' },
    { text: '机密', value: '4' },
  ],
  requestMethod: [
    // 请求方法
    { text: 'POST', value: 'post' },
    { text: 'GET', value: 'get' },
    { text: 'PUT', value: 'put' },
    { text: 'DELETE', value: 'delete' },
  ],
}));

// 获取系统常量
Mock.mock(new RegExp('^/v1/core/sys/constant'), 'get', () => ({
  PWD_RULE: '', // 密码验证规则
}));
