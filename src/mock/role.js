// 模拟角色相关接口
import Mock, { Random } from 'mockjs';
import { getUrlParam } from '@/libs/utils';

// 查询角色列表
Mock.mock(new RegExp('^/api/v1/core/base/roles'), 'get', ({ url }) => {
  const appId = getUrlParam(url, 'appId');
  const roleType = getUrlParam(url, 'roleType');
  const name = getUrlParam(url, 'name');
  const isEnable = getUrlParam(url, 'isEnable');

  if (name || isEnable !== '') {
    if (roleType === 'public') {
      return [
        {
          id: Random.guid(),
          name: '某某公共角色',
          roleCode: 'public-role',
          isEnable: true,
          sort: '',
          description: '这条是查询结果',
        },
      ];
    } else if (roleType === 'private') {
      return [
        {
          id: Random.guid(),
          name: '某某私有角色',
          roleCode: 'private-role',
          isEnable: true,
          sort: '',
          description: '这条是查询结果',
        },
      ];
    }
    return [
      {
        id: 'id-1',
        name: '固定id的角色01',
        roleCode: 'id-1',
        isEnable: true,
        sort: '',
        description: '这条是查询结果',
      },
      {
        id: 'id-2',
        name: '固定id的角色02',
        roleCode: 'id-2',
        isEnable: true,
        sort: '',
        description: '这条是查询结果',
      },
    ];
  }

  if (appId === 'seshr') {
    return [
      {
        id: Random.guid(),
        name: '超级管理员',
        roleCode: `superadmin`,
        isEnable: false,
        sort: '1',
        description: '最大权限',
      },
      {
        id: Random.guid(),
        name: '系统管理员',
        roleCode: `sysadmin`,
        isEnable: true,
        sort: '2',
        description: '管理系统配置',
      },
      {
        id: Random.guid(),
        name: '安全管理员',
        roleCode: `authadmin`,
        isEnable: true,
        sort: '3',
        description: '管理授权相关',
      },
    ];
  } else if (appId === 'sems') {
    return [
      {
        id: Random.guid(),
        name: '系统管理员',
        roleCode: `sysadmin`,
        isEnable: true,
        sort: '2',
        description: '管理系统配置',
      },
      {
        id: Random.guid(),
        name: '安全管理员',
        roleCode: `authadmin`,
        isEnable: true,
        sort: '3',
        description: '管理授权相关',
      },
    ];
  } else if (appId === 'doc') {
    return [
      {
        id: Random.guid(),
        name: '超级管理员',
        roleCode: `superadmin`,
        isEnable: false,
        sort: '1',
        description: '最大权限',
      },
    ];
  } else if (roleType === 'public') {
    return [
      {
        id: Random.guid(),
        name: '安全管理员',
        roleCode: 'authadmin',
        isEnable: true,
        sort: '3',
        description: '管理授权相关',
      },
    ];
  }
  return [
    {
      id: Random.guid(),
      name: '超级管理员',
      roleCode: 'superadmin',
      isEnable: false,
      sort: '1',
      description: '最大权限',
    },
    {
      id: Random.guid(),
      name: '系统管理员',
      roleCode: 'sysadmin',
      isEnable: true,
      sort: '2',
      description: '管理系统配置',
    },
  ];
});

// 新增角色
Mock.mock('/api/v1/core/base/role', 'post', ({ body }) => {
  const role = JSON.parse(body);
  return {
    id: Random.guid(),
    ...role,
  };
});

// 修改角色
Mock.mock('/api/v1/core/base/role', 'put', ({ body }) => {
  const role = JSON.parse(body);
  return role;
});

// 启用/禁用角色
Mock.mock('/api/v1/core/base/role/state', 'put', () => true);

// 删除角色
Mock.mock('/api/v1/core/base/role', 'delete', () => true);

// 批量启用/禁用角色
Mock.mock('/api/v1/core/base/roles/state', 'put', () => true);

// 批量删除角色
Mock.mock('/api/v1/core/base/roles', 'delete', () => true);
