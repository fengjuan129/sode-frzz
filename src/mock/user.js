import Mock from 'mockjs';

Mock.mock(new RegExp('^/v1/core/account/usertree'), 'get', () => {
  const userTree = [
    { id: 1, code: 1, name: '机构1' },
    { id: 2, code: 2, name: '机构2' },
    { id: 3, code: 3, name: '张三', parentCode: 1 },
    { id: 4, code: 4, name: '老李', parentCode: 2 },
    { id: 5, code: 5, name: '王二狗', parentCode: 2 },
  ];

  return userTree;
});
