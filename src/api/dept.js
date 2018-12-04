import request from '../libs/request';

/**
 * 懒加载组织机构
 * @param {string} typeCode 组织机构类型编码
 * @param {string} parentCode 父组织机构编码
 * @param {blooean} isEnable 是否启用
 */
export function getLazyTree(typeCode, parentCode, isEnable) {
  return request('/v1/core/org/lazytree', {
    method: 'get',
    params: {
      typeCode,
      parentCode,
      isEnable,
    },
  });
}

/**
 * 加载组织机构类别列表
 */
export function getDeptTypes() {
  return request('/v1/core/org/types', {
    method: 'get',
  });
}

/**
 * 全加载树，搜索使用
 * @param {string} name 组织机构名称
 * @param {string} typeCode 机构类型
 * @param {boolean} isEnable 是否启用
 */
export function getTreeByKeyword(name, typeCode, isEnable) {
  return request('/v1/core/org/tree', {
    method: 'get',
    params: {
      name,
      typeCode,
      isEnable,
    },
  });
}

/**
 * 获取组织机构类别详情
 * @param {string} id 组织机构类别id
 */
export function getDeptTypeInfo(id) {
  return request(`/v1/core/org/type`, {
    method: 'get',
    params: {
      id,
    },
  });
}

/**
 * 编辑组织机构类型
 * @param {object} deptType 组织机构类型对象
 */
export function editDeptType(deptType) {
  // 有id为修改，没有为新增
  const { id } = deptType;
  return request('/v1/core/org/type', {
    method: id ? 'put' : 'post',
    data: deptType,
  });
}

/**
 * 删除组织机构类型
 * @param {string} id 组织机构类型id
 */
export function deleteDeptType(id) {
  return request('/v1/core/org/type', {
    method: 'delete',
    data: {
      id,
    },
  });
}

/**
 * 加载组织机构详情
 * @param {string} id 组织机构id
 */
export function loadDeptInfo(id) {
  return request('/v1/core/org/dept', {
    method: 'get',
    params: {
      id,
    },
  });
}

/**
 * 切换组织机构状态
 * @param {string} id 组织机构id
 * @param {boolean} state 是否启用
 */
export function setDeptEnable(id, state) {
  return request('/v1/core/org/dept/state', {
    method: 'put',
    data: {
      id,
      state,
    },
  });
}

/**
 * 编辑组织机构
 * @param {object} dept 组织机构对象
 */
export function editDept(dept) {
  const { id } = dept;
  return request('/v1/core/org/dept', {
    method: id ? 'put' : 'post',
    data: dept,
  });
}

/**
 * 删除组织机构
 * @param {string} id 机构id
 */
export function deleteDept(id) {
  return request('/v1/core/org/dept', {
    method: 'delete',
    data: {
      id,
    },
  });
}
