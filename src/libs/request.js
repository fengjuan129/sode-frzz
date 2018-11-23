// 数据请求工具

import axios from 'axios';
// import hash from 'hash.js';
import { relogin } from '../api/login';
import { getToken, setToken, clearToken } from './token';

// 判断是否启用了mock功能
if (process.env.VUE_APP_MOCK_ENABLED) {
  // 如果启用的是远程mock，设置url基础路径为远程mock地址
  if (process.env.VUE_APP_MOCK_MODE === 'remote') {
    axios.defaults.baseURL = `${process.env.VUE_APP_MOCK_URL}/api`;
  }
  // * 本地mock模式不再设置'/api'前缀，目的是为了写url时能够统一
} else {
  axios.defaults.baseURL = '/api';
}

// 如果当前不是生产环境，且返回数据中有约定的模拟状态码字段“__statusCode”，则用其替换http状态码（此功能仅用于本地mock模拟报错）
if (process.env.NODE_ENV !== 'production') {
  // 添加响应拦截器
  axios.interceptors.response.use(response => {
    const { data } = response;
    // eslint-disable-next-line no-underscore-dangle
    if (data && data.__statusCode !== undefined) {
      // eslint-disable-next-line no-underscore-dangle
      response.status = data.__statusCode;
      // eslint-disable-next-line prefer-promise-reject-errors
      return Promise.reject({ response });
    }
    return response;
  });
}

/**
 * 保存返回数据的缓存
 * @param {object} response 响应对象
 * @param {string} hashcode 请求数据哈希值
 */
// const saveCache = (response, hashcode) => {
//   // 克隆返回数据并将其存储在 sessionStorage 中
//   // 不支持缓存 json 格式外的数据
//   const contentType = response.headers.get('Content-Type');
//   if (contentType && contentType.match(/application\/json/i)) {
//     // 所有数据以文本形式存储
//     response
//       .clone()
//       .text()
//       .then(content => {
//         // hashcode 作为数据请求的唯一标识，timestamp 项用于表明其缓存时间
//         sessionStorage.setItem(hashcode, content);
//         sessionStorage.setItem(`${hashcode}:timestamp`, Date.now());
//       });
//   }
//   return response;
// };

/**
 * 构建请求头信息
 * @param {Object} options 请求头配置
 */
function buildOptions(options) {
  // eslint-disable-next-line camelcase
  const { access_token, token_type } = getToken() || {};
  return {
    method: 'get',
    ...options,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      // eslint-disable-next-line camelcase
      Authorization: `${token_type} ${access_token}`,
      ...options.headers,
    },
  };
}

/**
 * 数据请求
 * @param {string} url 访问路径
 * @param {object} options 要传递给 axios 的参数（参考[Axios API](https://www.kancloud.cn/yunye/axios/234845)）
 * @returns {Promise} 返回一个 Promise 对象
 */
export default function request(url, options) {
  /**
   * 根据 url 和参数对象生成请求指纹
   */
  // const fingerprint = url + JSON.stringify({ ...options.data, ...options.params });

  // /** 请求指纹的哈希值 */
  // const hashcode = hash
  //   .sha256()
  //   .update(fingerprint)
  //   .digest('hex');

  // // 数据缓存有效期（单位：秒）
  // const expirys = options.expirys || 60;
  // // options.expirys !== false, return the cache,
  // if (options.expirys !== false) {
  //   // 根据哈希值找到数据缓存及其时间戳
  //   const cached = sessionStorage.getItem(hashcode);
  //   const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
  //   if (cached !== null && whenCached !== null) {
  //     // 判断缓存是否已过期
  //     const age = (Date.now() - whenCached) / 1000;
  //     if (age < expirys) {
  //       // 缓存未过期时返回缓存数据
  //       const response = new Response(new Blob([cached]));
  //       return response.json();
  //     }
  //     // 缓存过期时清除哈希值对应的缓存及时间戳
  //     sessionStorage.removeItem(hashcode);
  //     sessionStorage.removeItem(`${hashcode}:timestamp`);
  //   }
  // }

  /** 要传递给 axios 的参数 */

  return (
    axios(url, buildOptions(options))
      .then(response => response.data)
      // .then(saveCache)
      .catch(error => {
        // TODO: 准确判断错误是否由token过期导致
        if (error.response && error.response.status === 401) {
          // 尝试刷新token
          relogin()
            .then(tokenData => {
              // token刷新成功后，重新设置token
              setToken(tokenData);
              // token刷新成功后重新执行原请求
              return axios(url, buildOptions(options)).then(response => response.data);
            })
            .catch(() => {
              // token刷新失败后，清除token
              clearToken();
              // 刷新token失败时抛出错误（注意这里抛出的是原始错误，而不是导致token刷新失败的错误）
              return Promise.reject(error);
            });
        }
        // 对于其他类型的错误，直接抛出，交给业务模块自行处理
        return Promise.reject(error);
      })
  );
}
