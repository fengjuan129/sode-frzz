/**
 * 路由表
 */
import core from './modules/core';
import org from './modules/org';
import res from './modules/res';
import auth from './modules/auth';
import error from './modules/error';

export default [
  // 登录页面
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/login'),
    meta: {
      // 路由类型分为：公开(public)、受保护(protected)、授权(private)
      // 公开路由无需登录即可访问；受保护路由需要登录才能访问；授权路由除了登录还需要有相应授权才能访问
      type: 'public',
    },
  },
  // 主框架页面
  {
    path: '/',
    name: 'index',
    component: () => import('../views/index/index.vue'),
    meta: {
      type: 'protected',
    },
    // 各模块子路由
    children: [
      ...core,
      ...org,
      ...res,
      ...auth,
      ...error,
      // 未匹配到任何路由时，默认返回404
      // !此路由只能配置在路由表最后，顺序不可改变
      {
        path: '*',
        component: () => import('@/components/Exception'),
        props: {
          type: 404,
        },
        meta: {
          type: 'protected',
        },
      },
    ],
  },
];
