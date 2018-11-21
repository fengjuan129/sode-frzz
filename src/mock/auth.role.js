// 模拟角色授权相关接口
import Mock from 'mockjs';
import pathToRegexp from 'path-to-regexp';

// 加载授权给某角色的账号
Mock.mock(pathToRegexp('/api/v1/auth/role/:id/users'), 'get', () => []);

// 加载授权给某角色的菜单
Mock.mock(pathToRegexp('/api/v1/auth/role/:id/menus'), 'get', () => []);

// 加载授权给某角色的服务
Mock.mock(pathToRegexp('/api/v1/auth/role/:id/apis'), 'get', () => []);

// 角色账号授权
Mock.mock(pathToRegexp('/api/v1/auth/role/:id/users'), 'put', () => true);

// 角色菜单授权
Mock.mock(pathToRegexp('/api/v1/auth/role/:id/menus'), 'put', () => true);

// 角色服务授权
Mock.mock(pathToRegexp('/api/v1/auth/role/:id/apis'), 'put', () => true);
