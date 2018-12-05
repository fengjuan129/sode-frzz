// 资源分配管理接口
import request from '@/libs/request';

/**
 * 查询系统菜单授权记录
 * @param {string} appId 系统id
 */
export function loadAppMenuAuth(appId) {
  return request('/v1/core/auth/app/menus', {
    method: 'get',
    params: {
      appId,
    },
  });
}

/**
 * 查询系统服务授权记录
 * @param {string} appId 系统id
 */
export function loadAppApiAuth(appId) {
  return request('/v1/core/auth/app/apis', {
    method: 'get',
    params: {
      appId,
    },
  });
}

/**
 * 查询系统码表授权记录
 * @param {string} appId 系统id
 */
export function loadAppCodeitemAuth(appId) {
  return request('/v1/core/auth/app/codetables', {
    method: 'get',
    params: {
      appId,
    },
  });
}

/**
 * 系统资源授权
 * @param {string} appId 系统id
 * @param {string} resTypeCode 资源类型编码
 * @param {array} newResIds 新授权资源id集合
 * @param {array} removeAuthIds 移除授权的授权记录id集合
 */
function appAuthRes(appId, resTypeCode, newResIds, removeAuthIds) {
  return request('/v1/core/auth/app/menus', {
    method: 'put',
    data: {
      removeAuthIds,
      newAuthRecords: newResIds.map(resId => ({
        appId,
        resourceId: resId,
        resTypeCode,
      })),
    },
  });
}

/**
 * 系统菜单授权
 * @param {string} appId 系统id
 * @param {array} newMenuIds 新授权的菜单id数组
 * @param {array} removeAuthIds 移除授权的授权记录id数组
 */
export function appAuthMenu(appId, newMenuIds, removeAuthIds) {
  return appAuthRes(appId, 'menu', newMenuIds, removeAuthIds);
}

/**
 * 系统服务授权
 * @param {string} appId 系统id
 * @param {array} newApiIds 新授权的服务id数组
 * @param {array} removeAuthIds 移除授权的授权记录id数组
 */
export function appAuthApi(appId, newApiIds, removeAuthIds) {
  return appAuthRes(appId, 'api', newApiIds, removeAuthIds);
}

/**
 * 保存系统代码项（码表）授权
 * @param {string} appId 系统id
 * @param {array} newCodeItemIds 新授权码表项id集合
 * @param {array} removeAuthIds 移除授权的授权记录id集合
 */
export function appAuthCodeitem(appId, newCodeItemIds, removeAuthIds) {
  return request('/v1/core/auth/app/codetables', {
    method: 'put',
    params: {
      removeAuthIds,
      newAuthRecords: newCodeItemIds.map(codeItemId => ({
        appId,
        codeItemId,
      })),
    },
  });
}
