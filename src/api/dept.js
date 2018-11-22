import request from '../libs/request';

export default {
  /**
   * 懒加载组织机构
   * @param {string} parentCode 父组织机构编码
   */
  getLazyTree(typeCode, parentCode) {
    return request('/v1/core/org/lazytree', {
      method: 'get',
      params: {
        typeCode,
        parentCode,
      },
    });
  },

  /**
   * 加载组织机构类别
   */
  getDeptType() {
    return request('/v1/core/org/types', {
      method: 'get',
    });
  },
  /**
   * 全加载树，搜索使用
   * @param {string} name 关键词
   * @param {string} typeCode 机构类型
   */
  getTreeByKeyword(name, typeCode) {
    return request('/v1/core/org/tree', {
      method: 'get',
      params: {
        name,
        typeCode,
      },
    });
  },
  /**
   * 获取组织机构类别详情
   * @param { string } id 机构类别 ID
   */
  getDeptTypeInfo(id) {
    return request(`/v1/core/org/type/${id}`, {
      method: 'get',
    });
  },
  /**
   * 新增组织机构类型
   * @param {Object} params 名称，编码，备注
   * 修改提交发放为 PUT  新增为 POST
   */
  editDeptType(params) {
    const { id } = params;
    return request('/v1/core/org/type', {
      method: id ? 'put' : 'post',
      data: params,
    });
  },
  /**
   * 删除组织机构类型
   * @param {string} id 组织机构ID
   */
  deleteDeptType(id) {
    return request(`/v1/core/org/type/${id}`, {
      method: 'delete',
    });
  },
  /**
   * 加载组织机构详情
   */
  loadDeptInfo(id) {
    return request(`/v1/core/org/dept/${id}`, {
      method: 'get',
    });
  },

  /**
   * 更新组织机构状态
   */
  setDeptDisable(id, state) {
    return request(`/v1/core/org/dept/${id}/${state}`, {
      method: 'put',
    });
  },
  /**
   * 编辑组织机构
   */
  editDept(dept) {
    const { id } = dept;
    return request('/v1/core/org/dept', {
      method: id ? 'put' : 'post',
      data: dept,
    });
  },
  /**
   * 删除组织机构
   * @param {string} id 机构ID
   */
  deleteDept(id) {
    return request(`/v1/core/org/dept/${id}`, {
      method: 'delete',
    });
  },
};
