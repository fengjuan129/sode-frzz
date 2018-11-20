// 角色相关接口
import request from '@/libs/request';

/**
 * 加载角色列表
 * @param {string} appId 应用系统id
 * @param {string} roleType 角色类型（公共/public 私有/private）
 * @param {object} params 查询参数
 * @param {string} params.name 角色名称
 * @param {boolean} params.isEnable 是否启用
 */
export function loadRoles(appId, roleType, params) {
  return request('/v1/core/base/roles', {
    method: 'get',
    params: {
      appId,
      roleType,
      ...params,
    },
  });
}

/**
 * 保存角色
 * @param {object} role 角色对象
 */
export function saveRole(role) {
  const url = role.id ? `/v1/core/base/role/${role.id}` : '/v1/core/base/role';
  const method = role.id ? 'put' : 'post';
  return request(url, {
    method,
    data: role,
  });
}

/**
 * 启用/禁用角色
 * @param {string} roleId 角色id
 * @param {boolean} isEnable 是否启用
 */
export function setRoleEnable(roleId, isEnable) {
  return request(`/v1/core/base/role/${roleId}/state`, {
    method: 'put',
    data: {
      isEnable,
    },
  });
}

/**
 * 删除角色
 * @param {string} roleId 角色id
 */
export function deleteRole(roleId) {
  return request(`/v1/core/base/role/${roleId}`, {
    method: 'delete',
  });
}