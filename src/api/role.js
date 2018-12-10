// 角色相关接口
import request from '@/libs/request';

/**
 * 加载角色列表
 * @param {string} appCode 应用系统编码
 * @param {string} type 角色类型（公共/public 私有/private）
 * @param {object} params 查询参数
 * @param {string} params.name 角色名称
 * @param {boolean} params.isEnable 是否启用
 */
export function loadRoles(appCode, type, params) {
  return request('/v1/core/base/roles', {
    method: 'get',
    params: {
      appCode,
      type,
      ...params,
    },
  }).then(res => (res.data ? res.data : res));
}

/**
 * 创建角色
 * @param {object} role 角色对象
 * @param {string} appCode 应用系统编码
 */
export function createRole(role, appCode) {
  return request('/v1/core/base/role', {
    method: 'post',
    data: {
      appCode,
      role,
    },
  });
}

/**
 * 修改角色
 * @param {object} role 角色对象
 */
export function editRole(role) {
  return request('/v1/core/base/role', {
    method: 'put',
    data: role,
  });
}

/**
 * 保存角色
 * @param {object} role 角色对象
 */
export function saveRole(role) {
  return request('/v1/core/base/role', {
    method: role.id ? 'put' : 'post',
    data: role,
  });
}

/**
 * 启用/禁用角色
 * @param {string} id 角色id
 * @param {boolean} isEnable 是否启用
 */
export function setRoleEnable(id, isEnable) {
  return request(`/v1/core/base/role/state`, {
    method: 'put',
    data: {
      id,
      isEnable,
    },
  });
}

/**
 * 批量启用/禁用角色
 * @param {array} roleIds 要改变状态的角色id数组
 * @param {boolean} isEnable 是否启用
 */
export function setRolesEnable(roleIds, isEnable) {
  return request('/v1/core/base/roles/state', {
    method: 'put',
    data: {
      roleIds,
      isEnable,
    },
  });
}

/**
 * 批量删除角色
 * @param {array} roleIds 待删除角色id数组
 */
export function deleteRoles(roleIds) {
  return request('/v1/core/base/roles', {
    method: 'delete',
    data: roleIds,
  });
}

/**
 * 删除角色
 * @param {string} roleId 角色id
 */
export function deleteRole(roleId) {
  return deleteRoles([roleId]);
  // return request(`/v1/core/base/role`, {
  //   method: 'delete',
  //   data: {
  //     roleId,
  //   },
  // });
}
