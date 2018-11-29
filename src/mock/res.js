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
    {
      id: 6,
      name: '1-2-1',
      code: '大大',
      url: '爱的撒旦、阿打算',
      pid: 124124,
    },
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
      isEnable: true,
      isVisible: false,
      authType: 'public',
      menuType: 'main',
    },
    {
      id: 2,
      name: '2-1',
      isEnable: true,
      isVisible: false,
      authType: 'public',
      menuType: 'main',
    },
    {
      id: 3,
      name: '3-1',
      isEnable: true,
      isVisible: false,
      authType: 'public',
      menuType: 'main',
    },
    {
      id: 4,
      name: '1-2',
      isEnable: true,
      isVisible: false,
      authType: 'public',
      menuType: 'main',
      pid: 1,
    },
    {
      id: 5,
      name: '1-3',
      isEnable: true,
      isVisible: false,
      authType: 'public',
      menuType: 'main',
      pid: 1,
    },
    {
      id: 6,
      name: '1-2-1',
      isEnable: true,
      isVisible: false,
      authType: 'public',
      menuType: 'main',
      pid: 4,
    },
  ];
  return menuList;
});
