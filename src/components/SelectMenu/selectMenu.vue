<!-- 菜单选择公共页面 -->
<template>
  <el-dialog :title='title' :visible.sync='isOpen' width="25%" :before-close="close">

    <el-tree
      :props="defaultProps"
      :data='treeList'
      :show-checkbox='multiple'
      node-key="id"
      :default-checked-keys='selectedIds'
      :default-expand-all='selectedIds === undefined ? false : true'
      ref='menuTree'>
    </el-tree>

    <span slot='footer' class='dialog-footer'>
      <el-button @click='close'>取 消</el-button>
      <el-button type='primary' @click='sendSelect()'>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { data2treeArr } from '@/libs/utils';

export default {
  props: ['title', 'multiple', 'selectedIds'],
  data() {
    return {
      isOpen: true,
      defaultProps: {
        children: 'children',
        label: 'label',
      },
      treeList: [
        {
          label: '一级 1',
          children: [
            {
              label: '二级 1-1',
              children: [
                {
                  label: '三级 1-1-1',
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
                },
              ],
            },
            {
              label: '二级 2-2',
              children: [
                {
                  label: '三级 2-2-1',
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
                },
              ],
            },
            {
              label: '二级 3-2',
              children: [
                {
                  label: '三级 3-2-1',
                },
              ],
            },
          ],
        },
      ],
      activeOpt: [],
    };
  },

  mounted() {
    // this.getMenu();
  },

  methods: {
    getMenu() {
      // TODO 为调用接口
      this.treeList = data2treeArr();
    },
    sendSelect() {
      const selected = this.$refs.menuTree[this.multiple ? 'getCheckedNodes' : 'getCurrentNode']();
      this.$emit('select', selected);
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>
<style lang='less' scoped>
</style>
