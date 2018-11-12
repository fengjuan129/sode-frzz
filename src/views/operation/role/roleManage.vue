<!-- 角色管理页面 -->
<template>
  <div>
    <el-row :gutter="30">
      <el-col :span='4'>
        <div class="t-dept-container">
          <el-row type="flex" class="row-bg" justify="space-between">
              <el-col :span="16">
                <el-input size='mini'></el-input>
              </el-col>
              <el-col :span="6">
                <el-button size='mini'>查询</el-button>
              </el-col>
            </el-row>

            <div class="t-tree-container">
              TREE
            </div>
        </div>
      </el-col>
      <!-- tree END -->

      <el-col :span='20'>
        <!-- Tab -->
        <el-tabs type='border-card' :before-leave='stopTabChange' @tab-click='tabChange'>
          <el-tab-pane label='全部' name='all'></el-tab-pane>
          <el-tab-pane v-for='item in tabs.tabData' 
            :key='item.id' 
            :name='item.code' 
            :data-info='item'>
            <span slot='label'>
              {{item.typename}} 
              <i class='el-icon-edit' v-show='item.id === tabs.activeTab.id'></i>
            </span>
          </el-tab-pane>
          <el-tab-pane name='addDeptBtn'>
            <span slot='label' @click='() => {}'>
              <i class='el-icon-circle-plus'></i>
            </span>
          </el-tab-pane>

          <el-row class="tool-bar">
            <el-col :span='20'>
              <el-button size='small'>新增</el-button>
            </el-col>

            <el-col :span='4'>
              <el-input placeholder="请输入内容" size='small' suffix-icon="el-icon-search"></el-input>
            </el-col>
          </el-row>
          <!-- toolBar END -->

          <el-table style="width: 100%;" :data='roleList' border>
            <el-table-column v-for='(column,index) in columns' :key='index'
              :label='column.label'
              :width='column.width'
              :align='column.align'
              :prop='column.key'>
              <template scope="scope">
                {{scope.row[column[index]]}}
              </template>
            </el-table-column>

            <el-table-column label="操作" align='center'>
              <template scope="scope">
                <a href="javascript: void(0)" @click='editRole(scope.row,scope.$index)'>编辑</a>
                <a href="javascript: void(0)" @click='deleteRole(scope.row,scope.$index)'>删除</a>
                <a href="javascript: void(0)" @click='disableRole(scope.row,scope.$index)'>禁用</a>
              </template>  
            </el-table-column>
          </el-table>
        </el-tabs>
        <!-- Tab END -->
      </el-col>
    </el-row>

    <!-- 角色类型 -->
    <RoleTypeEdit/>
    <RoleEdit/>
  </div>
</template>
<script>
import RoleTypeEdit from './roleTypeEdit.vue';
import RoleEdit from './roleEdit.vue';

// 接口
import DeptApi from '@/api/dept';
export default {
  data() {
    return {
      tabs: {
        activeTab: '', // 保存当前选中项
        tabData: [
          { id: 1, code: '失敬失敬', typename: '大大' },
          { id: 2, code: '失敬失敬1', typename: '大大' },
        ],
      },
      columns: [
        {
          label: '角色名称',
          key: 'name',
          width: 150,
        },
        {
          label: '角色编码',
          key: 'code',
          width: 100,
        },
        {
          label: '角色类型',
          key: 'type',
          width: 100,
        },
        {
          label: '所属机构',
          key: 'deptNmae',
        },
        {
          label: '状态',
          key: 'state',
          width: 100,
        },
        {
          label: '排序',
          key: 'sort',
          width: 50,
        },
        {
          label: '备注',
          key: 'description',
        },
      ],
      roleList: [],
    };
  },

  components: {
    RoleTypeEdit,
    RoleEdit,
  },

  computed: {},

  mounted() {},

  methods: {
    /**
     * Tab切换时,点击添加按钮时阻止选中
     */
    stopTabChange(activeName) {
      if (activeName === 'addDeptBtn') return false;
      return true;
    },
    tabChange(tab) {
      if (tab.name === 'addDeptBtn') return;
      this.tabs.activeTab = tab.name === 'all' ? false : tab.$attrs['data-info'];
    },
    editRole() {},
    deleteRole() {},
    disableRole() {},
  },
};
</script>
<style lang='less' scoped>
.t-tree-container {
  overflow: hidden;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e9e9e9;
}
.tool-bar {
  overflow: hidden;
  margin-bottom: 15px;
}
</style>
