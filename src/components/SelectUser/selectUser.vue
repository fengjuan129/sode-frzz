<!-- 账号选择公共页面 -->
<template>
  <div>
    <el-dialog title='账号选择'
      :visible.sync='isOpen'
      :before-close="close"
      width='400px'>

      <div class="select-user-container">
        <el-tabs type="card" @tab-click='changeTab' v-model='activeTab'>
        <el-tab-pane v-for='item in tabData'
          :key='item.id'
          :label="item.typename"
          :code='item.code'
          :name="item.code"></el-tab-pane>
      </el-tabs>
      <div class='select-user-search-bar'>
        <el-input v-model="keyword" placeholder="输入关键词" style='width: 70%' size='mini' @keydown.13.native="getTree"></el-input>
        <el-button type='primary' style='float: right;' size='mini ' @click='getTree'>查询</el-button>
      </div>
      <div class='select-user-tree'>
        <!-- 全加载 -->
        <el-tree
          node-key='id'
          :data='tree.organizationTree'
          :props="tree.defaultProps"
          :show-checkbox='multiple'
          default-expand-all
          highlight-current
          ref='searchTree'>
        </el-tree>
      </div>
      </div>

      <span slot='footer' class='dialog-footer'>
        <el-button @click='close'>取 消</el-button>
        <el-button type='primary' @click='submitUser("userEditForm")'>确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UserApi from '@/api/user';
import DeptApi from '@/api/dept';
import { data2treeArr } from '@/libs/utils';

export default {
  /**
   * multiple: 是否允许多选。多选时显示checkbox
   * rootCode: 根节点的部门编码
   */
  props: ['multiple', 'rootCode', 'isOpen'],
  data() {
    return {
      keyword: '',
      tree: {
        organizationTree: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
      },
      tabData: [],
      activeTab: '',
      checkedUser: '', // 保存选中人员
    };
  },
  mounted() {
    this.loadOrganization();
  },
  methods: {
    /**
     * 加装组织机构
     */
    loadOrganization() {
      DeptApi.getDeptType().then(res => {
        this.tabData = res;
        this.activeTab = res[0].code;
      });
    },

    getTree() {
      // TODO 后端接口未定
      UserApi.getUserByDeptType(this.activeTab, this.keyword).then(res => {
        this.tree.organizationTree = data2treeArr(res);
      });
    },

    changeTab(tab) {
      this.keyword = '';
      this.activeTab = tab.$attrs.code;
      this.tree.organizationTree = [];
    },
    submitUser() {
      const curUser = this.$refs.searchTree[this.multiple ? 'getCheckedNodes' : 'getCurrentNode']();
      if (curUser.length === 0) {
        this.$message({
          message: '请选择后再提交',
          type: 'warning',
        });
        return;
      }
      this.$emit('select', curUser);
      this.close();
    },
    close() {
      this.$emit('close');
      /**
       * !使用 setCheckedNodes、setCurrentNode 树节点必须设置 node-key
       */
      if (this.multiple) {
        this.$refs.searchTree.setCheckedNodes([]);
      } else {
        this.$refs.searchTree.setCurrentNode([]);
      }
    },
  },

  watch: {
    activeTab() {
      this.getTree();
    },
  },
};
</script>
<style lang='scss' scoped>
.select-user-tree {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e9e9e9;
}
.select-user-container {
  min-height: 400px;
}
</style>
