// 组织机构相关数据
import Mock, { id } from 'mockjs';

// 获取 组织机构类型
Mock.mock('/v1/core/org/types', 'get', () => {
  const deptType = [
    { id: 1, typename: '机构1', code: 'jg01' },
    { id: 2, typename: '机构2', code: 'jg02' },
    { id: 3, typename: '机构3', code: 'jg03' },
  ];

  return deptType;
});

// 全加载树
Mock.mock(new RegExp('^/v1/core/org/tree'), 'get', () => {
  const tree = [
    { id: 1, code: 1, parentCode: -1, name: '1-1' },
    { id: 2, code: 2, parentCode: 1, name: '1-2' },
    { id: 3, code: 3, parentCode: 1, name: '1-3' },
    { id: 4, code: 4, parentCode: 2, name: '2-1' },
  ];

  return tree;
});

// 懒加载组织机构
Mock.mock(new RegExp('^/v1/core/org/lazytree'), 'get', () => {
  const tree = [
    {
      id: '1',
      name: '机构01',
      code: 'jg001',
      parentCode: '-1',
      isCorporation: false,
      orgCode: '001',
      isEnable: true,
      description: '描述',
      sort: 1,
    },
    {
      id: '2',
      name: '机构02',
      code: 'jg002',
      parentCode: 'jg001',
      isCorporation: false,
      orgCode: '001',
      isEnable: true,
      description: '描述',
      sort: 1,
    },
    {
      id: '3',
      name: '机构03',
      code: 'jg003',
      parentCode: 'jg002',
      isCorporation: false,
      orgCode: '001',
      isEnable: true,
      description: '描述',
      sort: 1,
    },
    {
      id: '4',
      name: '机构04',
      code: 'jg004',
      parentCode: 'jg001',
      isCorporation: false,
      orgCode: '001',
      isEnable: true,
      description: '描述',
      sort: 1,
    },
  ];

  return tree;
});
