import Mock from 'mockjs';

Mock.mock(new RegExp('^/api/v1/core/res/apis'), 'get', () => {
  const apis = [
    { id: 1, name: 'a1', code: 'weqwe', url: '/a/v/c' },
    { id: 2, name: 'q2', code: 'czx', url: '/a/v/c' },
    { id: 3, name: 'a3', code: '23ds', url: '/a/v/c' },
    { id: 124124, name: 'a4', code: '23ds', url: '/a/v/c', pid: 2 },
    { id: 2312, name: 'a5', code: '23ds', url: '/a/v/c', pid: 3 },
    { id: 10000, name: 'a6', code: '23ds', url: '/a/v/c', pid: 2 },
  ];

  return apis;
});
