module.exports = {
  devServer: {
    proxy:
      // 如果当前运行环境启用本地mock模式，此时不启用代理（mock.js将拦截请求）
      // 如果不是本地mock模式，将 /api 开头的请求代理到远程服务器
      process.env.MOCK_ENABLED && process.env.MOCK_MODE === 'local'
        ? false
        : {
            '/api': {
              target: 'http://192.168.22.109:8080',
              secure: false,
            },
          },
  },
};
