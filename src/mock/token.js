import Mock from 'mockjs';
import { parse } from 'qs';

// 模拟用户数据
const userDB = [
  {
    username: 'admin',
    password: 'admin',
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
Mock.mock('/api/v1/sso/authentication/token', 'post', ({ body }) => {
  const bodyObj = parse(body);
  const loginUser = userDB.find(user => {
    // TODO: 解决 userDB.find(user => user.username === bodyObj.username
    // && user.password === bodyObj.password) 写法无法通过eslint语法校验的问题
    const nameMatched = user.username === bodyObj.username;
    const passwordMatched = user.password === bodyObj.password;
    return nameMatched && passwordMatched;
  });
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
