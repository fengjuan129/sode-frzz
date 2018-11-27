export default [
  {
    path: '/exception/403',
    name: '403',
    component: () => import('@/components/Exception'),
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
    component: () => import('@/components/Exception'),
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
    component: () => import('@/components/Exception'),
    props: {
      type: 500,
    },
    meta: {
      type: 'protected',
    },
  },
];
