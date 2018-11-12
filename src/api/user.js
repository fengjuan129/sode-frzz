import request from '../libs/request';
import qs from 'qs';

export default {
  /**
   * 加载用户列表
   * @param {json} options 查询条件
   */
  loadUserList(options) {
    return request(`/v1/usercenter/account/users?${qs.stringify(options)}`, {
      method: 'get',
    });
  },

  /**
   * 加载用户详情
   */
  getUserMsg(id) {
    return request(`/v1/usercenter/account/user/${id}`, {
      method: 'get',
    });
  },
  /**
   * 修改用户信息
   * @param {json} user
   */
  userEdit(user) {
    return request('/v1/usercenter/account/user', {
      method: user.id ? 'put' : 'post',
      data: user,
    });
  },
  /**
   * 改变用户状态
   */
  updateUserState(userIds, state) {
    return request('/v1/usercenter/account/users/state', {
      method: 'put',
      params: {
        ids: userIds.join(','),
        state,
      },
    });
  },

  /**
   * 解锁
   */
  lockUser(userIds, isLocked) {
    return request('/v1/usercenter/account/users/unlock', {
      method: 'put',
      params: {
        ids: userIds.join(','),
        isLocked,
      },
    });
  },
  /**
   * 重置密码
   */
  resetPwd(userIds) {
    return request(`/v1/usercenter/account/user/${userIds.join(',')}/reset`, {
      method: 'put',
    });
  },

  /**
   * 密码强度规则
   */
  loadPwdRule() {
    return request('/v1/usercenter/account/pwdrule', { method: 'get' });
  },
  /**
   * 保存密码强度规则
   */
  savePwdRule(params) {
    return request('/v1/usercenter/account/pwdrule', {
      method: 'put',
      params,
    });
  },

  /**
   * 账号迁移
   */
  moveUsers(ids, deptCode) {
    return request('/v1/usercenter/account/users/transfer', {
      method: 'put',
      params: {
        ids: ids.join(','),
        deptCode,
      },
    });
  },

  /**
   * 删除账号
   */
  deleteUser(ids) {
    return request(`/v1/usercenter/account/user/${ids.join(',')}`, {
      method: 'delete',
    });
  },

  /**
   *  修改用户状态（启用禁用）
   */
  disableUser(ids, isEnabled) {
    return request('/v1/usercenter/account/users/state', {
      method: 'put',
      params: {
        ids: ids.join(','),
        isEnabled,
      },
    });
  },
};
