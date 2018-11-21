<template>
  <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
</template>

<script>
export default {
  name: 'MenuTree',
  data() {
    return {
      data: [
        {
          label: '系统管理',
          children: [
            {
              label: '账号管理',
              routerLink: '/org/user',
            },
            {
              label: '组织机构管理',
              routerLink: '/org/dept',
            },
          ],
        },
        {
          label: '运维管理',
          children: [
            {
              label: '角色管理',
              routerLink: '/core/role',
            },
            {
              label: '菜单管理',
              routerLink: '/operation/res/menu',
            },
            {
              label: '服务管理',
              routerLink: '/operation/res/api',
            },
            {
              label: '系统资源分配',
              routerLink: '/auth/app',
            },
            {
              label: '应用系统管理',
              routerLink: '/core/app',
            },
            // {
            //   label: '自定义资源管理',
            //   routerLink: '/operation/res/custom',
            // },
          ],
        },
        {
          label: '安全管理',
          children: [
            {
              label: '角色授权管理',
              routerLink: '/auth/role',
            },
          ],
        },
        {
          label: 'vuex模块化示例',
          routerLink: '/demo',
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    };
  },
  methods: {
    handleNodeClick(data) {
      if (!data.routerLink) return;
      this.$router.push(`${data.routerLink}`);
    },
  },
};
</script>
