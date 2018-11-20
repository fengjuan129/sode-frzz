import { parse, stringify } from 'qs';
import Vue from 'vue';

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
      const parentObj = treeMap[item[parentKey]];

      if (parentObj) {
        (parentObj.children || (parentObj.children = [])).push(item);
        item.isAdd = true; // 阻止重复添加
      } else {
        returnTree.push(item);
      }
    }
  }
  return returnTree;
}

/**
 * 将 Tree 数据结构 拼接为 treeGrid 数据结构
 * @param {array} data tree 结构数据
 * @param {object} parentObj 父级数据
 * @param {boolean} expandedAll 是否展开
 */
function createGridArr(data, parentObj, expandedAll = false) {
  let tmp = [];
  Array.from(data).forEach(record => {
    if (record.expanded === undefined) {
      Vue.set(record, 'expanded', expandedAll);
    }
    if (parentObj !== null && parentObj !== undefined) {
      Vue.set(record, 'parent', parentObj);
      Vue.set(record, 'level', parentObj.level + 1);
    } else {
      Vue.set(record, 'level', 0);
    }

    tmp.push(record);

    if (record.children && record.children.length > 0) {
      const children = createGridArr(record.children, record, expandedAll);
      tmp = [...tmp, ...children];
    }
  });
  return tmp;
}

/**
 * 将数据组装成 treeGrid 格式
 * @param {array} listArr 原始数据
 * @param {string} key 子父关联KEY
 * @param {string} parentKey 子父关联KEY
 * @param {boolean} expandedAll 是否展开
 * @return {array}
 */
export function data2treeGridArr(
  listArr = [],
  key = 'code',
  parentKey = 'parentCode',
  expandedAll = false
) {
  return createGridArr(data2treeArr(listArr, key, parentKey), null, expandedAll);
}
