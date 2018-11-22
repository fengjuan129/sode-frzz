import Mock from 'mockjs';
import { parse } from 'qs';

// 模拟用户数据
const userDB = [
  {
    username: 'admin',
    password: 'admin',
  },
  {
    username: '测试加密',
    password: '123456',
  },
  {
    username: 'user1',
    password: 'user1',
  },
  {
    username: 'user2',
    password: 'user2',
  },
];

// 模拟用户登录接口
Mock.mock('/v1/sso/authentication/token', 'post', ({ body }) => {
  const { username, password } = parse(body);
  const loginUser = userDB.find(user => user.username === username && user.password === password);
  if (loginUser) {
    return {
      access_token: '@guid',
    };
  }
  return {
    error: 'login_error',
    code: 1001,
    msg: '账号或密码错误',
    __statusCode: 400,
  };
});

// 退出登录
Mock.mock('/v1/sso/authentication/logout', 'post', () => true);
