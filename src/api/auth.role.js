import request from '@/libs/request';

/**
 * 查询角色账号授权记录
 * @param {string} roleId 角色id
 */
export function loadRoleUsers(roleId) {
  return request(`/v1/core/auth/role/users`, {
    method: 'get',
    params: {
      roleId,
    },
  }).then(users => users || []);
}

/**
 * 查询角色菜单授权记录
 * @param {string} roleId 角色id
 */
export function loadRoleMenus(roleId) {
  return request(`/v1/core/auth/role/menus`, {
    method: 'get',
    params: {
      roleId,
    },
  }).then(menus => menus || []);
}

/**
 * 查询角色服务授权记录
 * @param {string} roleId 角色id
 */
export function loadRoleApis(roleId) {
  return request(`/v1/core/auth/role/apis`, {
    method: 'get',
    params: {
      roleId,
    },
  }).then(apis => apis || []);
}

/**
 * 角色账号授权
 * @param {string} roleId 角色id
 * @param {array} userIds 账号id数组
 */
export function roleAuthUser(roleId, newUserNames, removeAuthIds) {
  return request(`/v1/core/auth/role/users`, {
    method: 'put',
    data: {
      removeAuthIds,
      newAuthRecords: newUserNames.map(name => ({
        roleId,
        username: name,
      })),
    },
  });
}

/**
 * 角色资源授权
 * @param {string} roleId 角色id
 * @param {string} resTypeCode 资源类型编码
 * @param {array} newResIds 新授权资源id集合
 * @param {array} removeAuthIds 移除授权的授权记录id集合
 */
function roleAuthRes(roleId, resTypeCode, newResIds, removeAuthIds) {
  return request(`/v1/core/auth/role/res`, {
    method: 'put',
    data: {
      removeAuthIds,
      newAuthRecords: newResIds.map(resId => ({
        roleId,
        resourceId: resId,
        resTypeCode,
      })),
    },
  });
}

/**
 * 角色菜单授权
 * @param {string} roleId 角色id
 * @param {array} newMenuIds 新授权的菜单id数组
 * @param {array} removeAuthIds 移除授权的授权记录id数组
 */
export function roleAuthMenu(roleId, newMenuIds, removeAuthIds) {
  return roleAuthRes(roleId, 'menu', newMenuIds, removeAuthIds);
}

/**
 * 角色服务授权
 * @param {string} roleId 角色id
 * @param {array} newApiIds 新授权的服务id数组
 * @param {array} removeAuthIds 移除授权的授权记录id数组
 */
export function roleAuthApi(roleId, newApiIds, removeAuthIds) {
  return roleAuthRes(roleId, 'api', newApiIds, removeAuthIds);
}
