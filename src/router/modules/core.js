export default [
  // 角色管理
  {
    path: '/core/role',
    component: () => import('@/views/core/role/RoleManage.vue'),
    meta: {
      type: 'private',
    },
  },
  // 应用系统管理
  {
    path: '/core/app',
    component: () => import('@/views/core/app/AppManage.vue'),
    meta: {
      type: 'private',
    },
  },
];
