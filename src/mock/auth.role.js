// 模拟角色授权相关接口
import Mock from 'mockjs';

// 加载授权给某角色的账号
Mock.mock(new RegExp('^/api/v1/auth/role/users'), 'get', () => []);

// 加载授权给某角色的菜单
Mock.mock(new RegExp('^/api/v1/auth/role/menus'), 'get', () => []);

// 加载授权给某角色的服务
Mock.mock(new RegExp('^/api/v1/auth/role/apis'), 'get', () => []);

// 角色账号授权
Mock.mock('/api/v1/auth/role/users', 'put', () => true);

// 角色菜单授权
Mock.mock('/api/v1/auth/role/menus', 'put', () => true);

// 角色服务授权
Mock.mock('/api/v1/auth/role/apis', 'put', () => true);
