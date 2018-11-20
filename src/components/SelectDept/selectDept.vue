<!-- 组织机构选择公共页面 -->
<template>
  <div>
    <el-dialog title='组织机构选择'
      :visible.sync='isOpen'
      :before-close="close"
      width='400px'>

      <div class="select-user-container">
        <el-tabs type="card" @tab-click='changeTab' v-model='activeTab'>
          <el-tab-pane v-for='item in tabData' :key='item.id' :label="item.typename" :code='item.code' :name="item.code"></el-tab-pane>

          <div class='select-user-search-bar'>
        <el-input v-model="keyword" placeholder="输入关键词" style='width: 70%' size='mini' @keydown.13.native="getTree"></el-input>
        <el-button type='primary' style='float: right;' size='mini ' @click='getTree'>查询</el-button>
      </div>
      <div class='select-user-tree'>
        <!-- 懒加载加载 不能使 v-IF -->
        <el-tree
          v-show='isLazy'
          :show-checkbox='multiple'
          lazy
          :load='loadTreeChild'
          node-key='id'
          :props="tree.defaultProps"
          highlight-current
          ref='lazyTree'
          v-if='tabData.length > 0'>
        </el-tree>

        <!-- 全加载 -->
        <el-tree
          v-show='!isLazy'
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
        <el-button type='primary' @click='submitUser("userEditForm")' :disabled="tabData.length > 0">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import DeptApi from '@/api/dept';
import { data2treeArr as data2TreeArr } from '@/libs/utils';

export default {
  /**
   * multiple: 是否允许多选。多选时显示checkbox
   * rootCode: 根节点的部门编码
   */
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    rootCode: {
      type: String,
    },
    selectedCodes: {
      type: Array,
    },
  },
  data() {
    return {
      isOpen: true,
      keyword: '',
      isLazy: true,
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
     * 加载组织机构
     */
    loadOrganization() {
      DeptApi.getDeptType()
        .then(res => {
          this.tabData = res;
          this.activeTab = this.rootCode || res[0].code;

          if (this.selectedCodes && this.selectedCodes.length) {
            this.isLazy = false;
            // TODO 暂未选中 传入目标ID
            this.searchTree();
          }
        })
        .catch(this.$errorHandle);
    },
    /**
     * 懒加载第一级
     */
    loadLazyTreeRoot(resolve) {
      DeptApi.getLazyTree(this.activeTab, -1).then(res => {
        if (resolve) resolve(res);
      });
    },
    /**
     * 加载子节点
     */
    loadLazyTreeChild(node, resolve) {
      DeptApi.getLazyTree(this.activeTab, node.data.code).then(res => {
        resolve(res);
      });
    },
    /**
     * 搜索全加载
     */
    searchTree(callback) {
      DeptApi.getTreeByKeywork(this.keyword, this.activeTab).then(res => {
        this.tree.organizationTree = data2TreeArr(res);
        if (typeof callback === 'function') {
          callback();
        }
      });
    },
    /**
     * elementUi Tree 组件不支持动态切换全加载、懒加载，使用两颗树处理
     */
    getTree() {
      if (this.keyword.trim() === '') {
        this.isLazy = true;
      } else {
        this.isLazy = false;
        this.searchTree();
      }
    },
    /**
     * 懒加载
     */
    loadTreeChild(node, resolve) {
      // console.log(node);
      if (node.level === 0) {
        this.loadLazyTreeRoot(resolve);
      }
      if (node.level >= 1) {
        this.loadLazyTreeChild(node, resolve);
      }
    },
    reloadLazyTree() {
      const children = this.$refs.lazyTree.root.childNodes;
      children.splice(0, children.length);
      DeptApi.getLazyTree(this.activeTab, -1).then(res => {
        this.$refs.lazyTree.root.doCreateChildren(res);
      });
    },

    changeTab(tab) {
      this.keyword = '';
      this.activeTab = tab.$attrs.code;
      this.reloadLazyTree();
      this.isLazy = true;
      this.tree.organizationTree = [];
    },
    submitUser() {
      const curUser = this.$refs[this.isLazy ? 'lazyTree' : 'searchTree'][
        this.multiple ? 'getCheckedNodes' : 'getCurrentNode'
      ]();
      if (curUser === null || curUser.length === 0) {
        this.$message({
          message: '请选择部门后再提交',
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
        this.$refs.lazyTree.setCheckedNodes([]);
        this.$refs.searchTree.setCheckedNodes([]);
      } else {
        this.$refs.lazyTree.setCurrentNode([]);
        this.$refs.searchTree.setCurrentNode([]);
      }
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
