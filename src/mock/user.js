import Mock, { Random } from 'mockjs';

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

// 加载用户列表
Mock.mock(new RegExp('^/v1/core/account/users'), 'get', () => {
  const users = [
    {
      id: Random.guid(),
      code: 1,
      realName: Random.cname(),
      securityLevel: '1',
      username: '1',
      isEnabled: true,
    },
    {
      id: Random.guid(),
      code: 2,
      realName: Random.cname(),
      securityLevel: '1',
      username: '1',
      isEnabled: true,
    },
    {
      id: Random.guid(),
      code: 3,
      realName: Random.cname(),
      securityLevel: '1',
      username: '1',
      isEnabled: true,
    },
    {
      id: Random.guid(),
      code: 4,
      realName: Random.cname(),
      securityLevel: '1',
      username: '1',
      isEnabled: true,
    },
    {
      id: Random.guid(),
      code: 5,
      realName: Random.cname(),
      securityLevel: '1',
      username: '1',
      isEnabled: true,
    },
    {
      id: Random.guid(),
      code: 1,
      realName: Random.cname(),
      securityLevel: '1',
      username: '1',
      isEnabled: true,
    },
    {
      id: Random.guid(),
      code: 2,
      realName: Random.cname(),
      securityLevel: '1',
      username: '1',
      isEnabled: true,
    },
    {
      id: Random.guid(),
      code: 3,
      realName: Random.cname(),
      securityLevel: '1',
      username: '1',
      isEnabled: true,
    },
    {
      id: Random.guid(),
      code: 4,
      realName: Random.cname(),
      securityLevel: '1',
      username: '1',
      isEnabled: true,
    },
    {
      id: Random.guid(),
      code: 5,
      realName: Random.cname(),
      securityLevel: '1',
      username: '1',
      isEnabled: true,
    },
  ];

  return { users, current: 1, pageSize: 5, total: 10 };
});
