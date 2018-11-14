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

/**
 * 将数据拼装为 tree 结构
 * @param {array} listArr 原始数据
 * @param {string} key 子父关联KEY
 * @param {string} parentKey 子父关联KEY
 * @return {array}
 */
export function data2treeArr(listArr = [], key = 'code', parentKey = 'parentCode') {
  if (!(listArr instanceof Array) || !listArr.length) return [];

  const [treeMap, returnTree] = [{}, []];

  for (let i = 0, len = listArr.length; i < len; i += 1) {
    treeMap[listArr[i][key]] = listArr[i];
  }

  for (let i = 0, len = listArr.length; i < len; i += 1) {
    if (listArr[i].isAdd === undefined) {
      const item = listArr[i];
      const parent = treeMap[item[parentKey]];

      if (parent) {
        (parent.children || (parent.children = [])).push(item);
        item.isAdd = true;
      } else {
        returnTree.push(item);
      }
    }
  }
  return returnTree;
}
