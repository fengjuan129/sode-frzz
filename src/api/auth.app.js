// 资源分配管理接口
import request from '@/libs/request';

/**
 * 获取应用系统列表
 * @param {string} name 关键词
 */
export function getSystemList(name) {
  return request('/v1/core/base/apps', {
    method: 'get',
    params: {
      name,
    },
  });
}

/**
 * 查询授权给某系统的菜单
 * @param {string} id 系统ID
 */
export function getAuthMenusBySystemId(id) {
  return request(`/v1/auth/app/${id}/menus`, {
    method: 'get',
  });
}

/**
 * 保存系统菜单授权
 * @param {object} data 保存对象，ID, 菜单 ids
 */
export function saveMenuAuth(data) {
  return request(`/v1/auth/app/${data.id}/menus`, {
    method: 'put',
    data,
  });
}

/**
 * 查询授权给某系统的服务
 * @param {string} id 系统id
 */
export function getSystemAuth(id) {
  return request(`/v1/auth/app/${id}/apis`, {
    method: 'get',
  });
}

/**
 * 保存系统服务授权
 * @param {object} data 保存数据，系统 id , 权限ID集合
 */
export function saveSystemAuth(data) {
  return request(`/v1/auth/app/${data.id}/apis`, {
    method: 'put',
    data,
  });
}

/**
 * 查询授权给某系统的代码项（码表）
 * @param {string} id 系统ID
 */
export function getSystemCodeTables(id) {
  return request(`/v1/auth/app/${id}/codetables`, {
    method: 'get',
  });
}

/**
 * 保存系统代码项（码表）授权
 * @param {object} data 系统ID,码表ID集合
 */
export function saveSystemCodeTables(data) {
  return request(`/v1/auth/app/${data.id}/codetables`, {
    method: 'put',
    data,
  });
}
