// 码表工具方法
import * as sysApi from '@/api/sys';

/** 码表缓存 */
let codeTable = {};

/**
 * 获取码表数据
 * ! 同步方法
 * @param {string | array} codes 码表项代码字符串或数组
 * @description codes为字符串时返回[{text, value}]；codes为数组时返回{code1:[{text, value}], code2:[{text, value}]}
 * @returns {array | object} 码表数据数组或对象
 */
export function getCodeTable(codes) {
  // 缓存中不存在的码表代码
  const inexistence = [];
  // 将码表项编码构造为数组
  const codesArr = Array.isArray(codes) ? codes : [codes];
  // 找出缓存中不存在的码表项
  codesArr.forEach(code => {
    if (!codeTable[code]) {
      inexistence.push(code);
    }
  });
  if (inexistence.length > 0) {
    // 加载码表数据
    const res = sysApi.getCodeTable(inexistence);
    // 合并新加载的数据至缓存
    codeTable = {
      ...codeTable,
      ...res,
    };
  }
  // 返回码表数据
  if (Array.isArray(codes)) {
    return codes.reduce((ret, code) => {
      ret[code] = [...codeTable[code]];
      return ret;
    }, {});
  }
  return [...codeTable[codes]];
}

/**
 * 创建码表转码器
 * @param {string} code 码表项代码
 * @returns {function} 表格列formatter函数
 */
export function createFormatter(code) {
  // 加载尚未获取的码表数据
  if (!codeTable[code]) {
    getCodeTable(code);
  }
  // 返回数据转换方法
  return function formatter(row, column, value) {
    const codeItem = (codeTable[code] || []).find(item => item.value === value);
    return codeItem ? codeItem.text : value;
  };
}

/**
 * 码表文本转换
 * @param {string} value 码表项值
 * @param {string} code 码表项代码
 * @returns {string} 码表项文本
 */
export function format(value, code) {
  if (value === undefined || code === undefined) {
    return '';
  }
  // 加载尚未获取的码表数据
  if (!codeTable[code]) {
    getCodeTable(code);
  }
  const codeItem = (codeTable[code] || []).find(item => item.value === value);
  return codeItem ? codeItem.text : value;
}

/**
 * 刷新码表数据
 * ! 同步方法
 */
export function refresh() {
  // 获取当前已缓存的码表项代码
  const codes = Object.keys(codeTable);
  // 清空码表缓存
  codeTable = {};
  // 重新加载码表
  getCodeTable(codes);
}
