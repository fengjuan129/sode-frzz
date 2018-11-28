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
    isEnable: [{ text: '启用', value: true }, { text: '禁用', value: false }],
  };
  // return syncRequest('/v1/core/sys/codetable', {
  //   method: 'get',
  //   params: {
  //     codes,
  //   },
  // });
}

export function tmp() {}
