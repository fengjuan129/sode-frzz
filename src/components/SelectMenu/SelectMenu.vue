<!-- 菜单选择公共页面 -->
<template>
  <el-dialog
    :title='title'
    :visible='isVisible'
    width="300px"
    :close-on-click-modal='false'
    :before-close="close">

    <el-tree
      :props="defaultProps"
      :data='treeData'
      :show-checkbox='multiple'
      node-key="id"
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
import * as resApi from '@/api/res';

export default {
  props: {
    // 弹框标题
    title: {
      type: String,
      default: '菜单选择',
    },
    // 是否对选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 是否自动选中父节点
    autoCheckParent: {
      type: Boolean,
      default: false,
    },
    // 勾选对应ID
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
      return Utils.data2treeArr(this.treeList, 'id', 'parentId');
    },
  },
  mounted() {
    this.getMenu();
  },

  methods: {
    /**
     * 获取菜单数据
     */
    getMenu() {
      this.loading = true;
      resApi.getMenuTree({ isEnable: true }).then(res => {
        this.loading = false;
        this.treeList = res;

        if (this.selectedIds && this.selectedIds.length) {
          this.$nextTick(() => {
            this.selectedIds.forEach(item => {
              this.$refs.menuTree.setChecked(item, true, false);
            });
          });
        }
      });
    },

    /**
     * checkBox 变化时，是否选中父节点
     */
    onCheckChange() {
      if (this.autoCheckParent === false) return;
      const parents = this.$refs.menuTree.getHalfCheckedKeys();
      parents.forEach(item => {
        this.$refs.menuTree.setChecked(item, true, false);
      });
    },

    /**
     * 向父组件发送选中项
     */
    sendSelect() {
      const selected = this.$refs.menuTree[this.multiple ? 'getCheckedNodes' : 'getCurrentNode']();
      this.$emit('select', selected);
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
