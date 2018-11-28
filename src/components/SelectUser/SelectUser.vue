<!-- 账号选择公共页面 -->
<template>
  <el-dialog title='账号选择'
    :visible='isVisible'
    :before-close="close"
    :close-on-click-modal='false'
    width='400px'>

    <div class="select-user-container" v-loading='loading'>
      <el-tabs @tab-click='changeTab' v-model='activeTab'>
        <el-tab-pane v-for='item in tabData'
          :key='item.id'
          :label="item.typename"
          :code='item.code'
          :name="item.code"></el-tab-pane>

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
      </el-tabs>
    </div>

    <span slot='footer' class='dialog-footer'>
      <el-button @click='close'>取 消</el-button>
      <el-button type='primary' @click='submitUser("userEditForm")'>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import UserApi from '@/api/user';
import DeptApi from '@/api/dept';
import { data2treeArr } from '@/libs/utils';

export default {
  /**
   * multiple: 是否允许多选。多选时显示checkbox
   * rootCode: 根节点的部门编码
   * selectedIds: 已选账号id数组，此参数不为空时要在界面上勾选或选中对应数据
   */
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    rootCode: {
      type: String,
    },
    selectedIds: {
      type: Array,
    },
  },
  data() {
    return {
      isVisible: true,
      loading: false,
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
  created() {
    this.loadOrganization();
  },
  methods: {
    /**
     * 加装组织机构
     */
    loadOrganization() {
      this.loading = true;
      DeptApi.getDeptType().then(res => {
        this.loading = false;
        this.tabData = res;
        this.activeTab = this.rootCode || res[0].code;
        this.getTree();
      });
    },

    getTree() {
      this.loading = true;
      UserApi.getUserByDeptType(this.activeTab, this.keyword).then(res => {
        this.loading = false;
        /**
         * 11/27 后端返回参数 账户关联字段为 deptCode ，机构类型 关联字段为 parentCode，统一使用 parentCode
         */
        res.forEach(item => {
          if (item.username !== undefined && item.deptCode) {
            item.parentCode = item.deptCode;
            item.name = item.realName; // 添加显示项
            item.code = item.username;
          }
        });
        console.log(res);
        console.log(data2treeArr(res, 'code', 'parentCode', true));
        this.tree.organizationTree = data2treeArr(res, 'code', 'parentCode', true);
      });
    },

    changeTab(tab) {
      this.keyword = '';
      this.activeTab = tab.$attrs.code;
      this.tree.organizationTree = [];
      this.getTree();
    },
    submitUser() {
      const curUser = this.$refs.searchTree[this.multiple ? 'getCheckedNodes' : 'getCurrentNode']();

      if (!curUser || curUser.length === 0 || curUser.children) {
        this.$message({
          message: '请选择用户后再提交',
          type: 'warning',
        });
        return;
      }

      this.$emit('select', curUser);
      this.close();
    },
    close() {
      this.$emit('close');
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
