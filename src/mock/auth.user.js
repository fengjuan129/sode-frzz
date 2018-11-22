// 模拟账号权限相关接口
import Mock from 'mockjs';

// 判断当前账号是否为运维管理员
Mock.mock('/v1/auth/user/admin', 'get', () => true);
