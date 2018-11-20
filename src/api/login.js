import axios from 'axios';
import Qs from 'qs';
import request from '../libs/request';
import { getToken } from '../libs/token';
import config from '../config';

/**
 * 用户登录
 * @param {string} username 用户名
 * @param {string} password 密码
 * @returns {Promise}
 */
export function login(username, password) {
  return axios('/v1/sso/authentication/token', {
    method: 'post',
    data: Qs.stringify({
      username,
      password,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    },
  }).then(response => response.data);
}

/**
 * 重登陆（刷新token有效期）
 * @returns {Promise}
 */
export function relogin() {
  // eslint-disable-next-line camelcase
  const { refresh_token } = getToken();
  return axios('/v1/sso/oauth/token', {
    method: 'post',
    data: Qs.stringify({
      grant_type: 'refresh_token',
      refresh_token,
    }),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      Authorization: `Basic ${config.client_id}`,
    },
  }).then(response => response.data);
}

export function test() {
  return request('/v1/drip-client1/user', {
    method: 'post',
  });
}
