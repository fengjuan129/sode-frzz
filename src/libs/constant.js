// 常量工具方法
import * as sysApi from '@/api/sys';

/** 常量缓存 */
let constants = {};

/**
 * 获取常量数据
 * @param {string | array} codes 常量代码字符串或数组
 * @description codes为字符串时返回[{text, value}]；codes为数组时返回{code1:[{text, value}], code2:[{text, value}]}
 * @returns {array | object} 常量数据数组或对象
 */
export function getConstants(codes) {
  // 缓存中不存在的常量代码
  const inexistence = [];
  // 将常量编码构造为数组
  const codesArr = Array.isArray(codes) ? codes : [codes];
  // 找出缓存中不存在的常量
  codesArr.forEach(code => {
    if (!constants[code]) {
      inexistence.push(code);
    }
  });
  if (inexistence.length > 0) {
    // 加载常量数据
    const res = sysApi.getConstants(inexistence);
    // 合并新加载的数据至缓存
    constants = {
      ...constants,
      ...res,
    };
  }
  // 返回常量数据
  if (Array.isArray(codes)) {
    return codes.reduce((ret, code) => {
      ret[code] = [...constants[code]];
      return ret;
    }, {});
  }
  return [...constants[codes]];
}

/**
 * 刷新常量数据
 */
export function refresh() {
  // 获取当前已缓存的常量项代码
  const codes = Object.keys(constants);
  // 清空常量缓存
  constants = {};
  // 重新加载常量
  getConstants(codes);
}
