import request from '@/libs/request';

/**
 * 加载授权给某角色的账号
 * @param {string} roleId 角色id
 */
export function loadRoleUsers(roleId) {
  return request(`/v1/auth/role/users`, {
    method: 'get',
    params: {
      roleId,
    },
  });
}

/**
 * 加载授权给某角色的菜单
 * @param {string} roleId 角色id
 */
export function loadRoleMenus(roleId) {
  return request(`/v1/auth/role/menus`, {
    method: 'get',
    params: {
      roleId,
    },
  });
}

/**
 * 加载授权给某角色的服务
 * @param {string} roleId 角色id
 */
export function loadRoleApis(roleId) {
  return request(`/v1/auth/role/apis`, {
    method: 'get',
    params: {
      roleId,
    },
  });
}

/**
 * 角色账号授权
 * @param {string} roleId 角色id
 * @param {array} userIds 账号id数组
 */
export function roleAuthUser(roleId, userIds) {
  return request(`/v1/auth/role/users`, {
    method: 'put',
    data: {
      userIds,
      roleId,
    },
  });
}

/**
 * 角色菜单授权
 * @param {string} roleId 角色id
 * @param {array} menuIds 菜单id数组
 */
export function roleAuthMenu(roleId, menuIds) {
  return request(`/v1/auth/role/menus`, {
    method: 'put',
    data: {
      menuIds,
      roleId,
    },
  });
}

/**
 * 角色服务授权
 * @param {string} roleId 角色id
 * @param {array} apiIds 服务id数组
 */
export function roleAuthApi(roleId, apiIds) {
  return request(`/v1/auth/role/apis`, {
    method: 'put',
    data: {
      apiIds,
      roleId,
    },
  });
}
