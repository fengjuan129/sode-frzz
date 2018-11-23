export default [
  {
    // 用户管理
    path: '/org/user',
    component: () => import(/* webpackChunkName: "org.user" */ '@/views/org/user/UserManage.vue'),
    meta: {
      type: 'private',
    },
  },
  // 组织机构管理
  {
    path: '/org/dept',
    component: () => import(/* webpackChunkName: "org.dept" */ '@/views/org/dept/DeptManage.vue'),
    meta: {
      type: 'private',
    },
  },
];
