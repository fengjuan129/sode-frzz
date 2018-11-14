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
  const url = id ? `/v1/core/res/menu/${id}` : '/v1/core/res/menu';
  return request(url, {
    method: id ? 'put' : 'post',
    params: data,
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
