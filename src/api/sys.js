// 系统服务相关接口
// import { syncRequest } from '@/libs/request';

/**
 * 获取码表数据
 * ! 同步方法
 * @param {array} codes 码表代码数组
 * @param {object} 码表数据对象
 */
export function getCodeTable() {
  // TODO: 后端未实现，暂改为本地模拟
  return {
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
  };
  // return syncRequest('/v1/core/sys/codetable', {
  //   method: 'get',
  //   params: {
  //     codes,
  //   },
  // });
}

/**
 * 获取常量数据
 * ! 同步方法
 * @param {array} codes 常量编码数组
 * @param {object} 常量数据对象
 */
export function getConstants() {
  // TODO: 后端未实现，暂改为本地模拟
  return {
    PWD_RULE: '', // 密码验证规则
    MULTIPLE_ORG: false, // 是否启用多维组织机构
  };
  // return syncRequest('/v1/core/sys/constant', {
  //   method: 'get',
  //   params: {
  //     codes,
  //   },
  // });
}
