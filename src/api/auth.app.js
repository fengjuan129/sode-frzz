// 资源分配管理接口
import request from '@/libs/request';

/**
 * 获取应用系统列表
 * @param {string} name 关键词
 */
export function getSystemList(params) {
  return request('/v1/core/base/apps', {
    method: 'get',
    params,
  });
}

/**
 * 查询授权给某系统的菜单
 * @param {string} id 系统ID
 */
export function getAuthMenusBySystemId(id) {
  return request('/v1/core/auth/app/menus', {
    method: 'get',
    params: {
      id,
    },
  });
}

/**
 * 保存系统菜单授权、保存系统服务授权
 * @param {object} data 保存对象，菜单、权限 选中集合
 * @param {Array} deleteIds 删除的选项
 * ! 后端接收方式有问题，不能正常拿到 Array ，修改为 路径放 ID
 */
export function saveAppAuth(data, deleteIds) {
  return request('/v1/core/auth/app/menus', {
    method: 'put',
    data: {
      ids: deleteIds,
      appReses: data,
    },
  });
}

/**
 * 查询授权给某系统的服务
 * @param {string} id 系统id
 */
export function getSystemAuth(id) {
  return request('/v1/core/auth/app/apis', {
    method: 'get',
    params: {
      id,
    },
  });
}

/**
 * 查询授权给某系统的代码项（码表）
 * @param {string} id 系统ID
 */
export function getSystemCodeTables(id) {
  return request('/v1/core/auth/app/codetables', {
    method: 'get',
    params: {
      id,
    },
  });
}

/**
 * 保存系统代码项（码表）授权
 * @param {object} data 系统ID,码表ID集合
 */
export function saveSystemCodeTables(data) {
  return request('/v1/core/auth/app/codetables', {
    method: 'put',
    params: data,
  });
}
