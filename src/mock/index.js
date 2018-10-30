import Mock from 'mockjs';

// 导入所有的模拟接口（require.context 可用于获取目录上下文）
const context = require.context('./', true, /\.js$/);
context
  .keys()
  .filter(item => item !== './index.js') // 过滤掉 index.js，只保留业务相关的 js
  .map(context);

// 设置全局延时 没有延时的话有时候会检测不到数据变化 建议保留
Mock.setup({
  timeout: '300-600',
});
