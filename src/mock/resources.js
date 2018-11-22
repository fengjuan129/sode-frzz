import Mock from 'mockjs';

/**
 * 服务列表
 */
Mock.mock(new RegExp('^/v1/core/res/apis'), 'get', () => {
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

/**
 * 菜单查询
 */
Mock.mock('/v1/core/res/menutree', 'get', () => {
  const menuList = [
    {
      id: 1,
      name: '1-1',
    },
    {
      id: 2,
      name: '2-1',
    },
    {
      id: 3,
      name: '3-1',
    },
    {
      id: 4,
      name: '1-2',
      pid: 1,
    },
    {
      id: 5,
      name: '1-3',
      pid: 1,
    },
  ];
  return menuList;
});
