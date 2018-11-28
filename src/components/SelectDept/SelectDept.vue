<!-- 组织机构选择公共页面 -->
<template>
<el-dialog title='组织机构选择'
  visible
  :before-close="close"
  :close-on-click-modal='false'
  width='400px'>

  <div class="select-user-container">
    <el-tabs @tab-click='onTabClick' v-model='activeTabCode'>
      <el-tab-pane
        v-for='item in deptTypeList'
        :key='item.code'
        :name='item.code'
        :label="item.typename"
        v-if='deptTypeList.length > 1'></el-tab-pane>

      <div class='select-user-search-bar'>
        <el-input v-model="keyword" placeholder="输入关键词" style='width: 70%' size='mini' @keydown.13.native="loadDept"></el-input>
        <el-button type='primary' style='float: right;' size='mini ' @click='checkedKeys = [],loadDept()'>查询</el-button>
      </div>
      <div class='select-user-tree'>
        <!-- 全加载 -->
        <el-tree
          v-loading='loading'
          v-if='deptTypeList.length > 0'
          node-key='id'
          :data='treeData'
          :props="defaultProps"
          :show-checkbox='multiple'
          :default-expand-all='true'
          highlight-current
          :default-checked-keys="checkedKeys"
          ref='deptTree'>
        </el-tree>
      </div>

        </el-tabs>
      </div>

      <span slot='footer' class='dialog-footer'>
      <el-button @click='close'>取 消</el-button>
    <el-button type='primary' @click='sendSelectDept'>确 定</el-button>
  </span>
</el-dialog>
</template>

<script>
import DeptApi from '@/api/dept';
import * as Utils from '@/libs/utils';

export default {
  name: 'SelectDept',
  /**
   * multiple: 是否允许多选。多选时显示checkbox
   * rootCode: 根节点的部门编码
   * selectedCodes: 默认选中
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
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      keyword: '',
      loading: false,
      deptTypeList: [], // 组织机构类型
      deptList: [], // 组织机构
      activeTabCode: '',
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      checkedKeys: [],
    };
  },
  computed: {
    treeData() {
      return Utils.data2treeArr(this.deptList, 'code', 'parentCode', true);
    },
  },
  mounted() {
    this.checkedKeys = this.selectedCodes;
    this.loadDeptType();
  },
  methods: {
    // 获取机构类型
    loadDeptType() {
      this.loading = true;
      DeptApi.getDeptType()
        .then(res => {
          this.loading = false;
          this.deptTypeList = res.map(item => {
            const returnData = {
              ...item,
              name: item.typeName,
            };

            return returnData;
          });

          this.activeTabCode = this.rootCode || this.deptTypeList[0].code;
          this.loadDept();
        })
        .catch(this.$errorHandle);
    },
    // 获取机构
    loadDept() {
      this.loading = true;
      DeptApi.getTreeByKeyword(this.keyword, this.activeTabCode, true).then(res => {
        this.loading = false;
        this.deptList = res;
      });
    },
    // tabs 点击
    onTabClick(tab) {
      this.checkedKeys = [];
      this.keyword = '';
      this.activeTabCode = tab.name;
      this.loadDept();
    },
    // 提交选中项
    sendSelectDept() {
      const curUser = this.$refs.deptTree[this.multiple ? 'getCheckedNodes' : 'getCurrentNode']();
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
