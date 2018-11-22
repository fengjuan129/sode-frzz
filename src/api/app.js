// 应用系统相关接口
import request from '@/libs/request';

/**
 * 加载所有应用系统
 */
export function loadApps() {
  return request('/v1/core/base/apps', {
    method: 'get',
  });
}

/**
 * 编辑应用系统
 * @param {Object} app 应用系统
 */
export function editApp(app) {
  const method = app.id ? 'put' : 'post';
  return request('/v1/core/base/app', {
    method,
    data: app,
  });
}

/**
 * 删除应用系统
 * @param {string} id 系统id
 */
export function deleteApp(id) {
  return request(`/v1/core/base/app`, {
    method: 'delete',
    data: {
      id,
    },
  });
}

/**
 * 切换系统状态
 * @param {string} id 系统ID
 * @param {string} state 状态
 */
export function toggleAppState(id, state) {
  return request('/v1/core/base/app/state', {
    method: 'put',
    data: {
      id,
      state,
    },
  });
}

/**
 * 查询应用系统管理员授权信息
 * @param {string} id 系统ID
 */
export function searchAdminAuth(id) {
  return request('/v1/core/base/app/admins', {
    mehtod: 'get',
    params: {
      id,
    },
  });
}

/**
 * 管理员授权
 * @param {string} adminId 管理类型ID
 * @param {string} userId 用户ID
 */
export function saveAdminAuth(adminId, userId) {
  return request('/v1/core/base/app/admins', {
    mehtod: 'put',
    data: {
      adminId,
      userId,
    },
  });
}
