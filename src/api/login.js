// import axios from 'axios';
import Qs from 'qs';
import request from '@/libs/request';
import { getToken } from '../libs/token';

/**
 * 用户登录
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Promise}
 */
export function login(username, password) {
  return request('/v1/sso/authentication/token', {
    method: 'post',
    data: Qs.stringify({
      username,
      password,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
  });
}

/**
 * 重登录（刷新token有效期）
 * @returns {Promise}
 */
export function relogin() {
  // eslint-disable-next-line camelcase
  const { refresh_token } = getToken();
  return request('/v1/sso/oauth/token', {
    method: 'post',
    data: Qs.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
  }).then(response => response.data);
}

/**
 * 退出登录
 */
export function logout() {
  // eslint-disable-next-line camelcase
  const { refresh_token } = getToken();
  return request('/v1/sso/authentication/logout', {
    method: 'post',
    data: Qs.stringify({
      refresh_token,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
  });
}
