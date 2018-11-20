// 应用系统相关接口
import request from '@/libs/request';

/**
 * 加载所有应用系统
 */
export function loadApps() {
  return request('/v1/core/base/apps', {
    method: 'get',
  });
}

/**
 * 创建应用系统
 * @param {Object} app 应用系统
 */
export function createApp(app) {
  return request('/v1/core/base/app', {
    method: 'post',
    data: app,
  });
}
