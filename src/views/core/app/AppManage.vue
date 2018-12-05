<!-- 应用系统管理 -->
<template>
  <el-card type="box-card">
    <div class="search-bar">
      <el-form :inline="true" :model="formSearch" @submit.native.prevent>
        <el-button size="mini" @click="createApp(-1)">新增</el-button>

        <div class="fr">
          <el-input
            v-model="formSearch.name"
            @keyup.enter.native="loadApp"
            size="mini"
            placeholder="输入系统名称查询"
          >
            <el-button slot="append" icon="el-icon-search" @click="loadApp"></el-button>
          </el-input>
        </div>
      </el-form>
    </div>
    <!-- 搜索 END -->
    <el-table
      style="width: 100%"
      highlight-current-row
      v-loading="loading"
      @current-change="onCurrentChange"
      :data="treeData"
    >
      <el-table-column type="index" align="center" width="50" label="序号"></el-table-column>
      <el-table-column label="系统名称">
        <template slot-scope="scope">
          <span
            v-for="(space, levelIndex) in scope.row.level"
            class="ms-tree-space"
            :key="levelIndex"
          ></span>
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="系统编码" align="center" width="100"></el-table-column>
      <el-table-column label="状态" align="center" width="80">
        <template slot-scope="scope">{{scope.row.isEnable | format('isEnable')}}</template>
      </el-table-column>
      <el-table-column prop="deptName" label="所属机构" align="center" width="100"></el-table-column>
      <el-table-column prop="description" label="备注"></el-table-column>
      <el-table-column prop="sort" label="排序" align="center" width="80"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="editApp(scope.row)">编辑</el-button>
          <el-button type="text" @click="disableApp(scope.row)">{{scope.row.isEnable ? '禁用' : '启用'}}</el-button>

          <el-dropdown trigger="click" style="margin-left: 10px;" @command="handleBatchCommand">
            <el-button type="text" class="el-dropdown-link">
              更多
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="deleteApp">删除</el-dropdown-item>
              <el-dropdown-item command="createApp">创建子系统</el-dropdown-item>
              <el-dropdown-item command="manageAuth">管理员授权</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- tabs END -->
    <!-- 弹框 -->
    <app-edit
      v-bind="winEditApp"
      v-if="winEditApp.visible"
      @close="winEditApp.visible = false"
      @save="onAppSaved"
    ></app-edit>

    <app-admin-auth
      v-bind="winAdminAuth"
      v-if="winAdminAuth.visible"
      @close="winAdminAuth.visible = false"
    ></app-admin-auth>
  </el-card>
</template>

<script>
import * as Utils from '@/libs/utils';
import * as appApi from '@/api/app';
import { format } from '@/libs/codeTable';
import AppEdit from './AppEdit.vue';
import AppAdminAuth from './AppAdminAuth.vue';

export default {
  name: 'AppManage',

  components: { AppEdit, AppAdminAuth },
  filters: {
    format,
  },
  data() {
    return {
      loading: false,
      selection: {},
      formSearch: {
        name: '',
      },
      appList: [], // 系统列表
      winEditApp: {
        visible: false, // 编辑窗口是否可见
        app: {}, // 传入窗口的系统
      },
      winAdminAuth: {
        visible: false,
        appId: '',
      },
    };
  },
  computed: {
    treeData() {
      return Utils.data2treeGridArr(this.appList, 'id', 'pid', true);
    },
  },
  created() {
    this.loadApp();
  },

  methods: {
    // 加载系统集合
    loadApp() {
      this.loading = true;
      appApi
        .loadApps({
          name: this.formSearch.name,
        })
        .then(res => {
          this.loading = false;
          this.appList = res;
        })
        .catch(this.$errorHandler);
    },
    // 新增系统
    createApp(pid) {
      this.winEditApp = {
        visible: true,
        app: { pid },
      };
    },

    // 编辑系统
    editApp(app) {
      this.winEditApp = {
        visible: true,
        app,
      };
    },
    // 更新选中项
    onCurrentChange(selection) {
      this.selection = selection;
    },
    // 批量操作
    handleBatchCommand(command) {
      if (command === 'deleteApp') {
        this.$confirm(`确定删除【${this.selection.name}】?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
          .then(() => {
            this.loading = true;
            appApi.deleteApp(this.selection.id).then(() => {
              this.loading = false;
              // ! 删除父级引用
              const { parent } = this.selection;
              if (parent && parent.children && parent.children.length) {
                this.selection.parent.children = this.selection.parent.children.filter(
                  item => item.id !== this.selection.id
                );
              }

              for (let i = 0, len = this.appList.length; i < len; i += 1) {
                const item = this.appList[i];
                if (item.id === this.selection.id) {
                  this.appList.splice(i, 1);
                  break;
                }
              }

              this.$message({
                message: '删除成功',
                type: 'success',
              });
            });
          })
          .catch(() => {});
      } else if (command === 'createApp') {
        this.winEditApp = {
          visible: true,
          app: {
            pid: this.selection.id,
          },
        };
      } else if (command === 'manageAuth') {
        this.winAdminAuth = {
          visible: true,
          appId: this.selection.id,
        };
      }
    },

    // 系统保存回调方法
    onAppSaved(app) {
      if (this.winEditApp.app.id === undefined) {
        this.appList.unshift(app);
      } else {
        this.selection = Object.assign(this.selection, app);
      }
      this.$message('操作成功');
    },

    // 禁用系统
    disableApp(app) {
      const status = !app.isEnable;
      this.loading = true;
      // 后端接收 Y N
      appApi.toggleAppState(app.id, status ? 'Y' : 'N').then(() => {
        this.loading = false;
        app.isEnable = status;

        this.$message({
          message: `${status ? '启用' : '禁用'}成功。`,
          type: 'success',
        });
      });
    },
  },
};
</script>
<style lang='less' scoped>
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: 'Glyphicons Halflings';
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 18px;
  height: 14px;
}
.ms-tree-space::before {
  content: '';
}
.search-bar {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 15px;
  margin-bottom: 15px;
}
</style>
