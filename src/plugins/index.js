// 导入所有插件（require.context 可用于获取目录上下文，这里只将各目录下得index.js作为插件入口）
const context = require.context('./', true, /index.js/);
context
  .keys()
  .filter(item => item !== './index.js') // 过滤掉当前的 index.js，只保留插件目录中的 js
  .map(context);
