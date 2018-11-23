export default [
  // 系统资源分配
  {
    path: '/auth/app',
    component: () => import(/* webpackChunkName: "auth.app" */ '@/views/auth/app/AppAuthRes.vue'),
    meta: {
      type: 'private',
    },
  },
  // 角色授权管理
  {
    path: '/auth/role',
    component: () =>
      import(/* webpackChunkName: "auth.role" */ '@/views/auth/role/RoleAuthManage.vue'),
    meta: {
      type: 'private',
    },
  },
];
