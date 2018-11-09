import request from '../libs/request';
import qs from 'qs';

export default {
  /**
   * 获取组织机构列表
   */
  loadOrganization() {
    return request('/orgcenter/org/types', {
      method: 'get',
    });
  },
  /**
   * 全加载组织机构数
   * @param {string} keyWord 关键词
   */
  loadOrgTree(keyWord, deptCode) {
    return request(`/orgcenter/org/tree?${qs.stringify({ keyWord, deptCode })}`, {
      method: 'get',
    });
  },
  /**
   * 懒加载 组织机构 tree
   * @param {string} parentCode 组织机构编码
   */
  loadLazyTree(parentCode) {
    return request(`/orgcenter/org/lazytree?${qs.stringify({ parentCode })}`, {
      method: 'get',
    });
  },

  /**
   * 加载用户列表
   * @param {json} options 查询条件
   */
  loadUserList(options) {
    console.log(qs.stringify(options));
    return request(`/orgcenter/account/users?${qs.stringify(options)}`, {
      method: 'get',
    });
  },

  /**
   * 加载用户详情
   */
  getUserMsg(id) {
    return request(`//orgcenter/account/user/${id}`, {
      method: 'get',
    });
  },
  /**
   * 修改用户信息
   * @param {json} user
   */
  userEdit(user) {
    const url = user.id ? `/orgcenter/account/user/${user.id}` : '/orgcenter/account/user';
    return request(url, {
      method: user.id ? 'put' : 'post',
      params: user,
    });
  },
  /**
   * 改变用户状态
   */
  updateUserState(userIds, state) {
    return request('/orgcenter/account/users/state', {
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
    return request('/orgcenter/account/users/unlock', {
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
    return request(`/orgcenter/account/user/${userIds.join(',')}/reset`, {
      methos: 'put',
    });
  },

  /**
   * 密码强度规则
   */
  loadPwdRule() {
    return request('/orgcenter/account/pwdrule', { method: 'get' });
  },
  /**
   * 保存密码强度规则
   */
  savePwdRule(params) {
    return request('/orgcenter/account/pwdrule', {
      method: 'put',
      params,
    });
  },

  /**
   * 账号迁移
   */
  moveUsers(ids, deptCode) {
    return request('//orgcenter/account/users/transfer', {
      method: 'put',
      params: {
        userId: ids.join(','),
        deptCode,
      },
    });
  },

  /**
   * 删除账号
   */
  deleteUser(ids) {
    return request(`//orgcenter/account/user/${ids.join(',')}`, {
      method: 'delete',
    });
  },

  /**
   *  修改用户状态（启用禁用）
   */
  disableUser(ids, isEnabled) {
    return request('/orgcenter/account/users/state', {
      method: 'put',
      params: {
        ids: ids.join(','),
        isEnabled,
      },
    });
  },
};
