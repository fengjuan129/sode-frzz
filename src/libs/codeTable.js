// 码表工具方法
import * as sysApi from '@/api/sys';

/** 码表缓存 */
let codeTable = {};

/**
 * 获取码表数据
 * @param {array} codes 码表代码数组或单个代码字符串
 * @returns {promise}
 */
export function get(codes) {
  // 缓存中不存在的码表代码
  const inexistence = [];
  codes = Array.isArray(codes) ? codes : [codes];
  // 找出缓存中不存在的码表项
  codes.forEach(code => {
    if (!codeTable[code]) {
      inexistence.push(code);
    }
  });
  if (inexistence.length > 0) {
    // 加载码表数据
    return sysApi.getCodeTable(inexistence).then(res => {
      // 合并新加载的数据至缓存
      codeTable = {
        ...codeTable,
        ...res,
      };
      // 返回码表数据
      return codes.reduce((ret, code) => {
        ret[code] = [...codeTable[code]]; // 返回新的码表数据，避免业务模块内部对其修改影响缓存
        return ret;
      }, {});
    });
  }
  // 要加载的码表已有缓存时，直接返回缓存数据
  return Promise.resolve(
    codes.reduce((ret, code) => {
      ret[code] = [...codeTable[code]];
      return ret;
    }, {})
  );
}

/**
 * 码表转换
 * @param {string} code 码表代码
 * @param {string} value 码表项的值
 */
export function format(code, value) {
  const codeItem = (codeTable[code] || []).find(item => item.value === value);
  return codeItem ? codeItem.text : value;
}

/**
 * 创建码表转换器
 * @param {string} code 码表代码
 */
export function createFormatter(code) {
  // 加载尚未获取的码表数据
  if (!codeTable[code]) {
    get(code);
  }
  // 返回数据转换方法
  return function formatter(row, column, value) {
    return format(code, value);
  };
}

/**
 * 刷新码表数据
 */
export function refresh() {
  codeTable = {};
}
