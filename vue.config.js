module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.28.169:9001',
        secure: false,
      },
    },
  },
};
