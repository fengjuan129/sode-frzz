export default [
  {
    // 用户管理
    path: '/org/user',
    component: () => import('@/views/org/user/UserManage.vue'),
    meta: {
      type: 'private',
    },
  },
  // 组织机构管理
  {
    path: '/org/dept',
    component: () => import('@/views/org/dept/DeptManage.vue'),
    meta: {
      type: 'private',
    },
  },
];
