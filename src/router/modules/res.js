export default [
  // 菜单管理
  {
    path: '/res/menu',
    component: () => import('@/views/res/menu/MenuManage.vue'),
    meta: {
      type: 'private',
    },
  },
  // 服务管理
  {
    path: '/res/api',
    component: () => import('@/views/res/api/ApiManage.vue'),
    meta: {
      type: 'private',
    },
  },
];
