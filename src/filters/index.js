import Vue from 'vue';

/**
 * 码表
 * TODO: 从后端加载码表，并且需缓存
 * */
const codeTable = {
  isEnable: [{ text: '启用', value: true }, { text: '禁用', value: false }],
};

/**
 * 码表转换（编码->文本）
 */
Vue.filter('code2text', (value, code) => {
  const matched = codeTable[code];
  if (matched) {
    return matched.find(item => item.value === value).text;
  }
  return '';
});
