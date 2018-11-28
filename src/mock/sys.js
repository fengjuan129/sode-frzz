// 模拟系统服务相关接口
import Mock from 'mockjs';

Mock.mock(new RegExp('^/v1/core/sys/codetable'), 'get', () => ({
  isEnable: [{ text: '启用', value: true }, { text: '禁用', value: false }],
}));
