// 模拟角色相关接口
import Mock from 'mockjs';
import { getUrlParam } from '@/libs/utils';

// 查询角色列表
Mock.mock(new RegExp('^/api/v1/core/base/roles'), 'get', ({ url }) => {
  const appId = getUrlParam(url, 'appId');
  const roleType = getUrlParam(url, 'roleType');

  // console.log(`mock appId is ${appId}-, roleType is ${roleType}`);

  if (appId === 'seshr') {
    return [
      {
        name: '超级管理员',
        roleCode: `${appId}-superadmin`,
        isEnable: false,
        sort: '1',
        description: '最大权限',
      },
      {
        name: '系统管理员',
        roleCode: `${appId}-sysadmin`,
        isEnable: true,
        sort: '2',
        description: '管理系统配置',
      },
      {
        name: '安全管理员',
        roleCode: `${appId}-authadmin`,
        isEnable: true,
        sort: '3',
        description: '管理授权相关',
      },
    ];
  } else if (appId === 'sems') {
    return [
      {
        name: '系统管理员',
        roleCode: `${appId}-sysadmin`,
        isEnable: true,
        sort: '2',
        description: '管理系统配置',
      },
      {
        name: '安全管理员',
        roleCode: `${appId}-authadmin`,
        isEnable: true,
        sort: '3',
        description: '管理授权相关',
      },
    ];
  } else if (appId === 'doc') {
    return [
      {
        name: '超级管理员',
        roleCode: `${appId}-superadmin`,
        isEnable: false,
        sort: '1',
        description: '最大权限',
      },
    ];
  } else if (roleType === 'public') {
    return [
      {
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
      name: '超级管理员',
      roleCode: 'superadmin',
      isEnable: false,
      sort: '1',
      description: '最大权限',
    },
    {
      name: '系统管理员',
      roleCode: 'sysadmin',
      isEnable: true,
      sort: '2',
      description: '管理系统配置',
    },
  ];
});
