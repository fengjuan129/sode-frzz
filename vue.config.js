module.exports = {
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.22.109:8080',
        secure: false,
      },
    },
  },
};
