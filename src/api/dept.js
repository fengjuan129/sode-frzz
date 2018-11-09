import request from '../libs/request';
import qs from 'qs';

export default {
  /**
   * 懒加载组织机构
   * @param {string} parentCode 父组织机构编码
   */
  getLazyTree(parentCode) {
    return request(`/v1/orgcenter/org/lazytree?${qs.stringify({ parentCode })}`, {
      method: 'get',
    });
  },

  /**
   * 加载组织机构类别
   */
  getDeptType() {
    return request('/v1/orgcenter/org/types', {
      method: 'get',
    });
  },
  /**
   * 全加载树，搜索使用
   */
  getTreeByKeywork(parentCode, keyword) {
    return request(`//v1/orgcenter/org/tree?${qs.stringify({ parentCode, keyword })}`, {
      method: 'get',
    });
  },
  /**
   * 获取组织机构类别详情
   * @param { string } id 机构类别 ID
   */
  getDeptTypeInfo(id) {
    return request(`//v1/orgcenter/org/type/${id}`, {
      method: 'get',
    });
  },
  /**
   * 新增组织机构类型
   * @param {Object} params 名称，编码，备注
   */
  addDeptType(params) {
    return request('/v1/orgcenter/org/type', {
      method: 'post',
      params,
    });
  },
  /**
   * 删除组织机构类型
   * @param {string} id 组织机构ID
   */
  deleteDeptType(id) {
    return request(`//v1/orgcenter/org/type/${id}`, {
      method: 'delete',
    });
  },
  /**
   * 加载组织机构详情
   */
  loadDeptInfo(id) {
    return request(`/v1/orgcenter/org/dept/${id}`, {
      method: 'get',
    });
  },

  /**
   * 更新组织机构状态
   */
  setDeptDisable(id, state) {
    return request(`//v1/orgcenter/org/dept/${id}/state`, {
      method: 'put',
      params: {
        state,
      },
    });
  },
};
