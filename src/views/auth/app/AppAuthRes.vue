<!-- 系统资源分配页面 -->
<template>
  <el-card class="box-card">
    <!-- 查询栏 -->
    <el-form :inline="true" @submit.native.prevent slot="header">
      <el-form-item label="应用系统名称">
        <el-input v-model.trim="keyword" size="mini" @keydown.enter.native="loadApps"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="loadApps">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button size="mini" @click="keyword = '',loadApps()">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 应用系统列表 -->
    <el-table :data="appTreeData" highlight-current-row v-loading="loading">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column label="系统名称" prop="name">
        <template slot-scope="scope">
          <!-- 构造系统名称前部的缩进层级 -->
          <span class="ms-tree-space" v-for="(item, index) in scope.row.level" :key="index"></span>
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column label="所属机构" prop="deptCode"></el-table-column>
      <el-table-column label="备注" prop="description"></el-table-column>
      <el-table-column label="分配操作">
        <template slot-scope="{ row: app}">
          <el-button type="text" @click="loadAppMenuAuth(app)">[菜单]</el-button>
          <el-button type="text" @click="loadAppApiAuth(app)">[服务]</el-button>
          <el-button type="text" @click="loadAppCodeitemAuth(app)">[码表]</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 菜单选择组件 -->
    <select-menu
      v-bind="winMenu"
      v-if="winMenu.visible"
      @close="winMenu.visible = false"
      @select="onMenuSelect"
    ></select-menu>

    <!-- 服务选择组件 -->
    <select-api
      v-bind="winApi"
      v-if="winApi.visible"
      @close="winApi.visible = false"
      @select="onApiSelect"
    ></select-api>
  </el-card>
</template>

<script>
import * as utils from '@/libs/utils';
import * as appAuthApi from '@/api/auth.app';
import * as appApi from '@/api/app';
import SelectMenu from '@/components/SelectMenu';
import SelectApi from '@/components/SelectApi';
// TODO: 代码项：@/components/SelectCodeItem.vue（暂缺）

export default {
  name: 'AppAuthRes',
  components: {
    SelectMenu,
    SelectApi,
  },
  data() {
    return {
      keyword: '', // 查询关键字（应用系统名称）
      loading: true, // 是否正在加载
      apps: [], // 应用系统列表
      curApp: {}, // 当前选中的应用系统
      // 菜单选择窗口相关配置及数据
      winMenu: {
        visible: false, // 是否可见
        multiple: true, // 是否多选
        autoCheckParent: true, // 勾选子节点时是否自动勾选父节点
        selectedIds: [], // 已选菜单id数组
      },
      // 服务选择窗口相关配置及数据
      winApi: {
        visible: false, // 是否可见
        multiple: true, // 是否多选
        selectedIds: [], // 已选服务id数组
      },
      // 系统菜单授权记录（临时数据，用于选择后对比差异项）
      appMenuAuthRecords: [],
      // 系统服务授权记录（临时数据，用于选择后对比差异项）
      appApiAuthRecords: [],
    };
  },
  computed: {
    // 应用系统树形结构数据
    appTreeData() {
      return utils.data2treeGridArr(this.apps, 'id', 'pid', true);
    },
  },

  created() {
    this.loadApps();
  },

  methods: {
    /**
     * 加载应用系统列表
     */
    loadApps() {
      this.loading = true;
      // 只加载启用的应用系统
      appApi
        .loadApps({ name: this.keyword, isEnable: true })
        .then(apps => {
          this.apps = apps;
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 获取系统菜单授权记录
     * @param {object} app 应用系统
     */
    loadAppMenuAuth(app) {
      // 记录当前选中的系统
      this.curApp = app;
      // 加载系统菜单授权记录
      appAuthApi
        .loadAppMenuAuth(app.id)
        .then(records => {
          // 缓存授权记录
          this.appMenuAuthRecords = records;
          // 设置初始勾选菜单信息，打开菜单选择页面
          this.winMenu.selectedIds = records.map(record => record.resourceId);
          this.winMenu.visible = true;
        })
        .catch(this.$errorHandler);
    },

    /**
     * 获取系统服务授权记录
     * @param {object} app 应用系统
     */
    loadAppApiAuth(app) {
      // 记录当前选中的系统
      this.curApp = app;
      // 加载系统服务授权记录
      appAuthApi
        .loadAppApiAuth(app.id)
        .then(records => {
          // 缓存授权记录
          this.appApiAuthRecords = records;
          // 设置初始勾选菜单信息，打开菜单选择页面
          this.winApi.selectedIds = records.map(record => record.resourceId);
          this.winApi.visible = true;
        })
        .catch(this.$errorHandler);
    },

    /**
     * 菜单选择完成后，为当前系统分配菜单权限
     * @param {array} menus 选择的菜单
     */
    onMenuSelect(menus, added, removed) {
      // 获取新授权的菜单id集合
      const addedMenuIds = added.map(menu => menu.id);
      // 遍历查找要删除的授权记录id集合
      const removeAuthIds = removed.map(removedMenu => {
        // 查找移除的菜单此前是否已有授权记录
        const authItem = this.appMenuAuthRecords.find(
          authRecord => authRecord.resourceId === removedMenu.id
        );
        return authItem.id;
      });
      // 保存系统菜单授权
      appAuthApi
        .appAuthMenu(this.curApp.id, addedMenuIds, removeAuthIds)
        .then(() => {
          this.$message.success('授权成功');
        })
        .catch(this.$errorHandler);
    },

    /**
     * 服务选择完成后，为当前系统分配选择的服务
     * @param {array} apis 选择的服务
     */
    onApiSelect(apis, added, removed) {
      // 获取新授权的服务id集合
      const addedApiIds = added.map(api => api.id);
      // 遍历查找要删除的授权记录id集合
      const removeAuthIds = removed.map(removedApi => {
        // 查找移除的服务此前是否已有授权记录
        const authItem = this.appApiAuthRecords.find(
          authRecord => authRecord.resourceId === removedApi.id
        );
        return authItem.id;
      });
      // 保存角色服务授权
      appAuthApi
        .appAuthApi(this.curApp.id, addedApiIds, removeAuthIds)
        .then(() => {
          this.$message.success('授权成功');
        })
        .catch(this.$errorHandler);
    },

    /**
     * 获取系统码表
     * @param {object} app 应用系统
     */
    loadAppCodeitemAuth(app) {
      // 记录当前选中的系统
      this.curApp = app;
      // TODO: 暂无选中码表公共组件
    },

    /**
     * 系统码表授权
     */
    saveSystemCodeTable(selectCodeTable) {
      // TODO: 暂无选中码表公共组件
      console.log(selectCodeTable);
    },
  },
};
</script>

<style lang='less' scoped>
.el-form-item {
  margin-bottom: 0;
}
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
</style>
