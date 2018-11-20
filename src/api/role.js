// 角色相关接口
import request from '@/libs/request';

/**
 * 加载角色列表
 * @param {String} appId 应用系统id
 * @param {String} roleType 角色类型（公共/public 私有/private）
 */
export function loadRoles(appId, roleType) {
  return request('/v1/core/base/roles', {
    method: 'get',
    params: {
      appId,
      roleType,
    },
  });
}

export function createRole() {}
