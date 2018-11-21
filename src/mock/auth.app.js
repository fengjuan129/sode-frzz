// 模拟账号权限相关接口
import Mock from 'mockjs';
// import { getUrlParam } from '@/libs/utils';
import pathToRegexp from 'path-to-regexp';

const system = [
  {
    id: 1,
    name: '院人事信息管理系统',
    code: '@name',
    deptCode: '@name',
    appId: 'seshr',
  },
  {
    id: 2,
    name: '涉密电子会议系统',
    code: '@name',
    deptCode: '@name',
    appId: 'sems',
  },
  {
    id: 3,
    name: '电子公文系统',
    code: '@name',
    deptCode: '@name',
    appId: 'doc',
  },
  {
    id: 4,
    code: '@name',
    deptCode: '@name',
    name: 'tttt',
    pid: 1,
  },
  {
    id: 5,
    code: '@name',
    deptCode: '@name',
    name: 'asd',
    pid: 2,
  },
  {
    id: 6,
    code: '@name',
    deptCode: '@name',
    name: 'asd',
    pid: 5,
  },
];

// 获取系统列表
Mock.mock(new RegExp('^/api/v1/core/base/apps'), 'get', () => system);

// 根据系统ID 查询系统菜单
Mock.mock(pathToRegexp('/api/v1/auth/app/:id/menus'), 'get', () => [6]);

// 保存系统菜单
Mock.mock(pathToRegexp('/api/v1/auth/app/:id/menus'), 'put', () => {});

// 根据系统ID 查询系统服务
Mock.mock(pathToRegexp('/api/v1/auth/app/:id/apis'), 'get', () => [1]);

// 保存系统服务
Mock.mock(pathToRegexp('/api/v1/auth/app/:id/apis'), 'put', () => {});