// 系统服务相关接口
import request from '@/libs/request';

/**
 * 获取码表数据
 * @param {array} codes 码表代码数组
 */
export function getCodeTable(codes) {
  return request('/v1/core/sys/codetable', {
    method: 'get',
    params: {
      codes,
    },
  });
}

export function tmp() {}
