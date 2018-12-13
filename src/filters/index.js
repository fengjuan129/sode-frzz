import Vue from 'vue';

// TODO: 添加码表转换filter

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
