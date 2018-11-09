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
              routerLink: '/operation/role',
            },
          ],
        },

        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1',
                  routerLink: '/page1',
                },
              ],
            },
          ],
        },
        {
          label: '一级 2',
          children: [
            {
              label: '二级 2-1',
              children: [
                {
                  label: '三级 2-1-1',
                  routerLink: '/page2',
                },
              ],
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1',
                  routerLink: '/page3',
                },
              ],
            },
          ],
        },
        {
          label: '一级 3',
          children: [
            {
              label: '二级 3-1',
              children: [
                {
                  label: '三级 3-1-1',
                  routerLink: '/page4',
                },
              ],
            },
            {
              label: '二级 3-2',
              children: [
                {
                  label: '三级 3-2-1',
                  routerLink: '/page5',
                },
              ],
            },
          ],
        },
      ],
      defaultProps: {
        children: 'children',
        label: 'label',
      },
    };
  },
  methods: {
    /**
     * 将数据转为 tree 结构
     */
    // data2TreeData(data) {
    //   let treeMap = {},
    //     returnTree = [];

    //   for (let i = 0, len = data.length; i < len; i++) {
    //     let item = data[i];
    //     treeMap[item.id] = item;
    //   }

    //   for (let i = 0, len = data.length; i < len; i++) {
    //     let item = data.tree[i],
    //       parent = treeMap[item.pid];

    //     if (parent) {
    //       (parent.children || (parent.children = [])).push(item);
    //     } else {
    //       returnTree.push(item);
    //     }
    //   }
    //   return returnTree;
    // },
    handleNodeClick(data) {
      if (!data.routerLink) return;
      this.$router.push(`${data.routerLink}`);
    },
  },
};
</script>

