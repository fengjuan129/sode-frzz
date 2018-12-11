import request from '../libs/request';
/**
 * 加载用户列表
 * @param {json} options 查询条件
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
 * @param {json} user
 */
export function userEdit(user) {
  return request('/v1/core/account/user', {
    method: user.id ? 'put' : 'post',
    data: user,
  });
}
/**
 * 改变用户状态
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
 * 解锁
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
 */
export function savePwdRule(data) {
  return request('/v1/core/account/pwdrule', {
    method: 'put',
    data,
  });
}

/**
 * 账号迁移
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
