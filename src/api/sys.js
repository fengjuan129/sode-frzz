// 系统服务相关接口
// import { syncRequest } from '@/libs/request';

/**
 * 获取码表数据
 * ! 同步方法
 * @param {array} codes 码表代码数组
 * @param {object} 码表数据对象
 */
export function getCodeTable() {
  // TODO: 改为接口实现
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
  };
  // return syncRequest('/v1/core/sys/codetable', {
  //   method: 'get',
  //   params: {
  //     codes,
  //   },
  // });
}

export function tmp() {}
