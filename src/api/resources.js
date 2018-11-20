import request from '../libs/request';

/**
 * 获取菜单 Tree
 */
export function getMenuTree() {
  return request('/v1/core/res/menutree', {
    method: 'get',
  });
}

/**
 * 编辑菜单
 * @param {string} id 有ID为修改，反正为新增
 * @param {object} data 提交数据
 */
export function setMenu(id, data) {
  // 18/11/16 const url = id ? `/v1/core/res/menu/${id}` : '/v1/core/res/menu'; 后端实现接口 路径不需要ID
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
  return request(`/v1/core/res/menu/${id}`, {
    method: 'delete',
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
  // const url = data.id ? `/v1/core/res/apitype/${data.id}` : '/v1/core/res/apitype';
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
  return request(`/v1/core/res/apitype/${id}`, {
    mehtod: 'delete',
  });
}

/**
 * 查询服务列表
 * @param {object} options 搜索条件
 */
export function getApiListByOption(options) {
  return request('/v1/core/res/apis', {
    mehtod: 'get',
    params: options,
  });
}

/**
 * 新增服务
 * @param {object} data 提交、修改数据，有ID 修改，无ID 新增
 */
export function editApi(data) {
  console.log(data);
  // const url = data.id ? `/v1/core/res/api/${data.id}` : '/v1/core/res/api';
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
  return request(`/v1/core/res/api/${id}`, {
    method: 'delete',
  });
}
