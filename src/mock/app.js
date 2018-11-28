// 模拟应用系统相关接口
import Mock from 'mockjs';

// 加载全部应用系统
Mock.mock('/v1/core/base/apps', 'get', () => [
  {
    id: 1,
    name: '院人事信息管理系统',
    appId: 'seshr',
    code: 'sdaa',
    isEnable: false,
    deptCode: 122,
    deptName: 'dddd',
    description: '爱神的箭爱神的箭as阿萨德',
    sort: 1,
    pid: -1,
  },
  {
    id: 2,
    name: '涉密电子会议系统',
    appId: 'seshr2',
    code: 'sdaa',
    isEnable: false,
    deptCode: 122,
    deptName: 'dddd',
    description: '爱神的箭爱神的箭as阿萨德',
    sort: 2,
    pid: -1,
  },
  {
    id: 3,
    name: '电子公文系统',
    appId: 'doc',
    code: 'sdwqaa',
    isEnable: true,
    deptCode: 1232,
    deptName: 'dddd',
    description: '爱神的箭爱神的箭as阿萨德',
    sort: 4,
    pid: 2,
  },
  {
    id: 4,
    name: '内容管理系统',
    appId: 'doc1',
    code: 'sdwqaa',
    isEnable: true,
    deptCode: 1232,
    deptName: 'dddd',
    description: '爱神的箭爱神的箭as阿萨德',
    sort: 4,
    pid: 1,
  },
]);

// 修改系统
Mock.mock('/v1/core/base/app', 'put', () => {});

// 新增系统
Mock.mock('/v1/core/base/app', 'post', () => {});

// 禁用
Mock.mock('/v1/core/base/app/state', 'put', () => {});

// 删除
Mock.mock('/v1/core/base/app', 'delete', () => {});

// 查询应用系统管理员授权信息
Mock.mock(new RegExp('^/v1/core/base/app/admins'), 'get', () => {
  const list = [
    { id: 1, name: '系统管理员', userName: '张三', userId: 3 },
    { id: 2, name: '安全管理员', userName: '李四', userId: 4 },
    { id: 3, name: '审计管理员', userName: '', userId: '' },
  ];

  return list;
});
