import request from '../libs/request';

export default {
  /**
   * 加载用户列表
   * @param {json} options 查询条件
   */
  loadUserList(options) {
    return request('/v1/core/account/users', {
      method: 'get',
      params: {
        ...options,
      },
    });
  },

  /**
   * 加载用户详情
   */
  getUserMsg(id) {
    return request('/v1/core/account/user', {
      method: 'get',
      params: {
        id,
      },
    });
  },
  /**
   * 修改用户信息
   * @param {json} user
   */
  userEdit(user) {
    return request('/v1/core/account/user', {
      method: user.id ? 'put' : 'post',
      data: user,
    });
  },
  /**
   * 改变用户状态
   */
  updateUserState(userIds, state) {
    return request('/v1/core/account/users/state', {
      method: 'put',
      data: {
        ids: userIds,
        state,
      },
    });
  },

  /**
   * 解锁
   */
  lockUser(userIds, isLocked) {
    return request('/v1/core/account/users/unlock', {
      method: 'put',
      data: {
        ids: userIds,
        isLocked,
      },
    });
  },
  /**
   * 重置密码
   */
  resetPwd(userIds) {
    return request('/v1/core/account/user/reset', {
      method: 'put',
      data: {
        id: userIds,
      },
    });
  },

  /**
   * 密码强度规则
   */
  loadPwdRule() {
    return request('/v1/core/account/pwdrule', { method: 'get' });
  },
  /**
   * 保存密码强度规则
   */
  savePwdRule(data) {
    return request('/v1/core/account/pwdrule', {
      method: 'put',
      data,
    });
  },

  /**
   * 账号迁移
   */
  moveUsers(ids, deptCode) {
    return request('/v1/core/account/users/transfer', {
      method: 'put',
      data: {
        ids,
        deptCode,
      },
    });
  },

  /**
   * 删除账号
   */
  deleteUser(ids) {
    return request('/v1/core/account/user', {
      method: 'delete',
      data: {
        ids,
      },
    });
  },

  /**
   *  修改用户状态（启用禁用）
   */
  disableUser(ids, isEnabled) {
    return request('/v1/core/account/users/state', {
      method: 'put',
      data: {
        ids,
        isEnabled,
      },
    });
  },
  /**
   * 获取人员所在机构树
   */
  getUserByDeptType(typeCode, name) {
    return request('/v1/core/account/usertree', {
      method: 'get',
      params: {
        name,
        typeCode,
      },
    });
  },
};
