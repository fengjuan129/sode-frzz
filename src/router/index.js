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
          // vuex模块化示例
          path: '/demo',
          component: asyncLoader(() => import('../views/demo')),
          meta: {
            type: 'private',
          },
        },
        {
          // 用户管理
          path: '/org/user',
          component: asyncLoader(() =>
            import(/* webpackChunkName: "org.user" */ '../views/org/user/UserManage.vue')
          ),
          meta: {
            type: 'private',
          },
        },
        // 组织机构管理
        {
          path: '/org/dept',
          component: asyncLoader(() =>
            import(/* webpackChunkName: "org.dept" */ '../views/org/dept/DeptManage.vue')
          ),
          meta: {
            type: 'private',
          },
        },
        // 角色管理
        {
          path: '/core/role',
          component: asyncLoader(() =>
            import(/* webpackChunkName: "core.role" */ '../views/core/role/RoleManage.vue')
          ),
          meta: {
            type: 'private',
          },
        },

        // 菜单管理
        {
          path: '/res/menu',
          component: asyncLoader(() =>
            import(/* webpackChunkName: "res.menu" */ '../views/res/menu/MenuManage.vue')
          ),
          meta: {
            type: 'private',
          },
        },
        // 服务管理
        {
          path: '/res/api',
          component: asyncLoader(() =>
            import(/* webpackChunkName: "res.api" */ '../views/res/api/ApiManage.vue')
          ),
          meta: {
            type: 'private',
          },
        },
        // 系统资源分配
        {
          path: '/auth/app',
          component: asyncLoader(() =>
            import(/* webpackChunkName: "auth.app" */ '../views/auth/app/AppAuthRes.vue')
          ),
          meta: {
            type: 'private',
          },
        },
        // 应用系统管理
        {
          path: '/core/app',
          component: asyncLoader(() =>
            import(/* webpackChunkName: "core.app" */ '../views/core/app/AppManage.vue')
          ),
          meta: {
            type: 'private',
          },
        },
        // 角色授权管理
        {
          path: '/auth/role',
          component: asyncLoader(() =>
            import(/* webpackChunkName: "auth.role" */ '../views/auth/role/RoleAuthManage.vue')
          ),
          meta: {
            type: 'private',
          },
        },
        // 配置发生异常时的路由
        {
          path: '/exception/403',
          name: '403',
          component: Exception,
          props: {
            // 为路由组件传参
            type: 403,
          },
          meta: {
            type: 'protected', // 配置为需登录才能访问
          },
        },
        {
          path: '/exception/404',
          name: '404',
          component: Exception,
          props: {
            type: 404,
          },
          meta: {
            type: 'protected',
          },
        },
        {
          path: '/exception/500',
          name: '500',
          component: Exception,
          props: {
            type: 500,
          },
          meta: {
            type: 'protected',
          },
        },
        // 未匹配到任何路由时，默认返回404
        // !此路由只能配置在路由表最后，顺序不可改变
        {
          path: '*',
          component: Exception,
          props: {
            type: 404,
          },
          meta: {
            type: 'protected',
          },
        },
      ],
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
