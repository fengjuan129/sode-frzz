// 账号权限相关接口
import request from '@/libs/request';

/**
 * 判断当前账号是否为运维管理员
 */
export function judgeIsAdmin() {
  return request('/v1/auth/user/admin', {
    method: 'get',
  });
}

export function test() {}
