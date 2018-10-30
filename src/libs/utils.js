import { parse, stringify } from 'qs';

/**
 * 获取当前url中的查询参数并转换为对象
 * @returns {object}
 */
export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

/**
 * 将查询参数拼装到url中
 * @param {string} path 路径
 * @param {object} query 查询参数对象
 */
export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}
