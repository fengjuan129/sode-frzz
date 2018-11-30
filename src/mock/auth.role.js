// 模拟角色授权相关接口
import Mock from 'mockjs';

// 查询角色账号授权记录
Mock.mock(new RegExp('^/v1/core/auth/role/users'), 'get', () => []);

// 查询角色菜单授权记录
Mock.mock(new RegExp('^/v1/core/auth/role/menus'), 'get', () => []);

// 查询角色服务授权记录
Mock.mock(new RegExp('^/v1/core/auth/role/apis'), 'get', () => []);

// 角色服务授权
Mock.mock('/v1/core/auth/role/res', 'put', () => true);
