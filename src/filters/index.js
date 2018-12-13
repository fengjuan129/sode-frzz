import Vue from 'vue';
import { format } from '@/libs/codeTable';

/**
 * 码表转换filter
 * @param {any} value 码表项的值
 * @param {string} code 码表项代码
 */
Vue.filter('code2text', (value, code) => format(value, code));

/**
 * 文件大小转换filter
 * @param {number} size 文件字节数
 */
Vue.filter('fileSize', size => {
  let sizeText = '';
  if (size < 1024) {
    sizeText = `${size} byte`;
  } else if (size < 1024 * 1024) {
    sizeText = `${(size / 1024).toFixed(2)} KB`;
  } else if (size < 1024 * 1024 * 1024) {
    sizeText = `${(size / (1024 * 1024)).toFixed(2)} MB`;
  } else if (size < 1024 * 1024 * 1024 * 1024) {
    sizeText = `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
  return sizeText;
});
