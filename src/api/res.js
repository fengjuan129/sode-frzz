import request from '../libs/request';

/**
 * 加载授权给当前账号的菜单列表
 * @returns {Promise} 菜单列表
 */
export function loadCurUserMenus() {
  return request('/v1/core/res/menus/own', {
    method: 'get',
  }).then(menus => menus || []);
}

/**
 * 获取菜单 Tree
 */
export function getMenuTree(params) {
  return request('/v1/core/res/menutree', {
    method: 'get',
    params,
  });
}

/**
 * 编辑菜单
 * @param {string} id 有ID为修改，反正为新增
 * @param {object} data 提交数据
 */
export function setMenu(id, data) {
  return request('/v1/core/res/menu', {
    method: id ? 'put' : 'post',
    data,
  });
}

/**
 * 删除菜单
 * @param {string} id 删除目标ID
 */
export function deleteMenu(id) {
  return request('/v1/core/res/menu', {
    method: 'delete',
    data: {
      id,
    },
  });
}

/**
 * 加载服务分类树
 */
export function getApiTypeTree() {
  return request('/v1/core/res/apitypes', {
    mehtod: 'get',
  });
}

/**
 * 新增、修改服务类
 * @param {object} data 提交数据，有 ID 新增，无ID修改
 */
export function editApiType(data) {
  return request('/v1/core/res/apitype', {
    method: data.id ? 'put' : 'post',
    data,
  });
}

/**
 * 删除服务分类
 * @param {string} id 删除类型ID
 */
export function deleteApiType(id) {
  return request('/v1/core/res/apitype', {
    method: 'delete',
    data: {
      id,
    },
  });
}

/**
 * 查询服务列表
 * @param {object} params 搜索条件
 */
export function getApiListByOption(params) {
  return request('/v1/core/res/apis', {
    method: 'get',
    params,
  });
}

/**
 * 查询服务列表 + 类型 树（全加载）
 */
export function getApisTree(params) {
  return request('/v1/core/res/apisTree', {
    method: 'get',
    params,
  });
}

/**
 * 新增服务
 * @param {object} data 提交、修改数据，有ID 修改，无ID 新增
 */
export function editApi(data) {
  return request('/v1/core/res/api', {
    method: data.id ? 'put' : 'post',
    data,
  });
}

/**
 * 删除服务
 * @param {string} id 删除服务ID
 */
export function deleteApi(id) {
  return request('/v1/core/res/api', {
    method: 'delete',
    data: {
      id,
    },
  });
}
