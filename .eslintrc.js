module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: ['plugin:vue/essential', '@vue/airbnb', 'plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'arrow-parens': 'off', // 关闭箭头函数的参数必须带括号的校验
    'linebreak-style': 'off', // 关闭换行符校验（windows和linux下换行符不同，由git自行处理）
  },
  parserOptions: {
    parser: 'babel-eslint',
  },
};
