// 账号权限相关接口
import request from '@/libs/request';

/**
 * 判断当前账号是否为运维管理员
 */
export function judgeIsAdmin() {
  return request('/v1/core/auth/user/admin', {
    method: 'get',
  });
}

/**
 * 判断当前账号是否为顶级系统三员
 */
export function judgeIsTopAdmin() {
  return request('/v1/core/auth/user/topadmin', {
    method: 'get',
  });
}
