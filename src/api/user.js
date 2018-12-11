import request from '../libs/request';
/**
 * 加载用户列表
 * @param {object} options 查询条件
 * @param {string} options.deptCode 部门code
 * @param {string} options.realName 用户姓名
 * @param {string} options.userName 账号
 * @param {boolean} options.status 账号状态
 */
export function loadUserList(options) {
  return request('/v1/core/account/users', {
    method: 'get',
    params: {
      ...options,
    },
  });
}

/**
 * 加载用户详情
 * @param {string} id 账号id
 */
export function getUserMsg(id) {
  return request('/v1/core/account/user', {
    method: 'get',
    params: {
      id,
    },
  });
}
/**
 * 修改用户信息
 * @param {object} user 账号对象
 */
export function userEdit(user) {
  return request('/v1/core/account/user', {
    method: user.id ? 'put' : 'post',
    data: user,
  });
}
/**
 * 改变账号状态
 * @param {array} userIds 要改变状态的账号id数组
 * @param {boolean} state 账号状态
 */
export function updateUserState(userIds, state) {
  return request('/v1/core/account/users/state', {
    method: 'put',
    data: {
      ids: userIds,
      state,
    },
  });
}

/**
 * 账号解锁
 * @param {array} userIds 要解锁状态的账号id数组
 * @param {boolean} isLocked 是否解锁
 */
export function lockUser(userIds, isLocked) {
  return request('/v1/core/account/users/unlock', {
    method: 'put',
    data: {
      ids: userIds,
      isLocked,
    },
  });
}
/**
 * 重置密码
 * @param {array} userIds 要重置密码的账号id数组
 */
export function resetPwd(userIds) {
  return request('/v1/core/account/user/reset', {
    method: 'put',
    data: {
      id: userIds,
    },
  });
}

/**
 * 密码强度规则
 */
export function loadPwdRule() {
  return request('/v1/core/account/pwdrule', { method: 'get' });
}
/**
 * 保存密码强度规则
 * @param {string} data 密码规则
 */
export function savePwdRule(data) {
  return request('/v1/core/account/pwdrule', {
    method: 'put',
    data,
  });
}

/**
 * 账号迁移
 * @param {array} userIds 要迁移的账号id数组
 * @param {string} deptCode 部门编码
 */
export function moveUsers(ids, deptCode) {
  return request('/v1/core/account/users/transfer', {
    method: 'put',
    data: {
      ids,
      deptCode,
    },
  });
}

/**
 * 删除账号
 * @param {array} ids 要删除的账号id数组
 */
export function deleteUser(ids) {
  return request('/v1/core/account/user', {
    method: 'delete',
    data: {
      ids,
    },
  });
}

/**
 *  修改用户状态（启用禁用）
 * @param {array} userIds 要改变状态的账号id数组
 * @param {boolean} isEnabled 账号状态
 */
export function disableUser(ids, isEnabled) {
  return request('/v1/core/account/users/state', {
    method: 'put',
    data: {
      ids,
      isEnabled,
    },
  });
}
/**
 * 获取人员所在机构树
 * @param {string} typeCode 机构类别code
 * @param {string} name 人员姓名
 */
export function getUserByDeptType(typeCode, name) {
  return request('/v1/core/account/usertree', {
    method: 'get',
    params: {
      name,
      typeCode,
    },
  });
}
