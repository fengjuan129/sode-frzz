<!-- 菜单选择公共页面 -->
<template>
  <el-dialog :title='title' :visible='isVisible' width="300px" :before-close="close">

    <el-tree
      :props="defaultProps"
      :data='treeData'
      :show-checkbox='multiple'
      node-key="id"
      :default-checked-keys='selectedIds'
      :default-expand-all='selectedIds === undefined ? false : true'
      v-loading='loading'
      @check-change='onCheckChange'
      ref='menuTree'>
    </el-tree>

    <span slot='footer' class='dialog-footer'>
      <el-button @click='close'>取 消</el-button>
      <el-button type='primary' @click='sendSelect()'>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as Utils from '@/libs/utils';
import * as resApi from '@/api/resources';

export default {
  props: {
    title: {
      type: String,
      default: '菜单选择',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    selectedIds: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      loading: false,
      isVisible: true,
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      treeList: [],
    };
  },

  computed: {
    treeData() {
      return Utils.data2treeArr(this.treeList, 'id', 'pid');
    },
  },
  mounted() {
    this.getMenu();
  },

  methods: {
    getMenu() {
      this.loading = true;
      resApi.getMenuTree().then(res => {
        this.loading = false;
        this.treeList = res;
      });
    },
    onCheckChange() {
      const parents = this.$refs.menuTree.getHalfCheckedKeys();
      parents.forEach(item => {
        this.$refs.menuTree.setChecked(item, true, false);
      });
    },
    sendSelect() {
      const selected = this.$refs.menuTree[this.multiple ? 'getCheckedNodes' : 'getCurrentNode']();
      this.$emit('select', [...selected]);
      this.close('close');
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>
<style lang='less' scoped>
</style>
