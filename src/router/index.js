/* eslint-disable */
// TODO: 修复放开上一行注释后eslint无法校验通过的问题
import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import Exception from '../components/Exception';
import asyncLoader from '../libs/asyncLoader';
import { getToken } from '../libs/token';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'login',
      component: asyncLoader(() => import(/* webpackChunkName: "login" */ '../views/login')),
      meta: {
        // 路由类型分为：公开(public)、受保护(protected)、授权(private)
        // 公开路由无需登录即可访问；受保护路由需要登录才能访问；授权路由除了登录还需要有相应授权才能访问
        type: 'public',
      },
    },
    {
      path: '/',
      name: 'index',
      component: asyncLoader(() =>
        import(/* webpackChunkName: "basic-layout" */ '../layouts/BasicLayout.vue')
      ),
      meta: {
        type: 'protected',
      },
      children: [
        {
          path: 'hello',
          component: asyncLoader(() =>
            import(/* webpackChunkName: "hello" */ '../components/HelloWorld')
          ),
        },
      ],
    },
    // 配置404路由
    // !此路由只能配置在路由表最后，顺序不可改变
    {
      path: '*',
      component: Exception,
      props: {
        // 为路由组件传参
        type: 404,
      },
      meta: {
        type: 'protected', // 404页面配置为需登录才能访问
      },
    },
  ],
});

// 路由变更前
router.beforeEach((to, from, next) => {
  const { meta } = to;
  const { type: routeType } = meta;
  // 显示页面加载进度条
  NProgress.start();
  // 如果目标路由为公开路由或用户已登录
  // TODO: 判断路由是否为授权路由，如果是，判断其是否有权限
  if (routeType === 'public' || getToken()) {
    // 访问目标路由
    next();
  } else {
    // 跳转至登录页面
    // TODO: 跳转时在路径中带上原先准备访问的路径，便于登录后直接跳转至该页面
    next('/login');
  }
});

// 路由变更完成后
router.afterEach(() => {
  // 隐藏页面加载进度条
  NProgress.done();
});

export default router;
