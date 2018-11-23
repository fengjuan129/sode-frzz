import Vue from 'vue';
import Router from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import routes from './routes';
import { getToken } from '../libs/token';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
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
