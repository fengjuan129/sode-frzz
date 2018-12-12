export default [
  // 系统资源分配
  {
    path: '/auth/app',
    component: () => import('@/views/auth/app/AppAuthRes.vue'),
    meta: {
      type: 'private',
    },
  },
  // 角色授权管理
  {
    path: '/auth/role',
    component: () => import('@/views/auth/role/RoleAuthManage.vue'),
    meta: {
      type: 'private',
    },
  },
  // 模板三员授权管理
  {
    path: '/auth/template',
    component: () => import('@/views/auth/template/TemplateAuthManage.vue'),
    meta: {
      type: 'private',
    },
  },
];
