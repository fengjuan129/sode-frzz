<!-- 角色管理页面 -->
<template>
  <el-tabs v-model="activeTabKey" @tab-click="onTabClick" type="border-card">

    <!-- tab标签栏 -->
    <el-tab-pane v-for="tab in tabs" :label="tab.name" :name="tab.key" :key="tab.key"></el-tab-pane>

    <!-- 按钮栏（公共角色不能编辑，此时不显示按钮栏） -->
    <div v-if="activeTabKey !== 'public'" class="btn-container">
      <el-button size="mini">新增</el-button>
      <el-dropdown trigger="click" style="margin: 0 10px;">
        <el-button size="mini">批量操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item>删除</el-dropdown-item>
          <el-dropdown-item>启用</el-dropdown-item>
          <el-dropdown-item>禁用</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 查询栏 -->
    <el-form :inline="true" :model="searchCondition" size="mini">
      <el-form-item label="角色名称：">
        <el-input v-model="searchCondition.name"></el-input>
      </el-form-item>
      <el-form-item v-if="isAdmin" label="状态：">
        <el-select v-model="searchCondition.isEnable">
          <el-option
            v-for="item in isEnableCodeTable"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type='primary'>查询</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 角色列表 -->
    <el-table :data="roles" v-loading="loading" stripe highlight-current-row>
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="角色名称"></el-table-column>
      <el-table-column prop="roleCode" label="角色编码"></el-table-column>
      <el-table-column prop="isEnable" label="状态" :formatter="formatState"></el-table-column>
      <el-table-column prop="sort" label="排序"></el-table-column>
      <el-table-column prop="description" label="备注"></el-table-column>
      <!-- 公共角色不允许编辑，此时不显示操作列 -->
      <el-table-column v-if="activeTabKey !== 'public'" label="操作">
        <template slot-scope="scope">
          <el-button type='text' @click="editRole(scope.row)">编辑</el-button>
          <el-button type='text' @click="toggleRoleState(scope.row)">{{scope.row.isEnable === true ? '禁用' : '启用'}}</el-button>
          <el-button type='text' @click="deleteRole(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

  </el-tabs>
</template>

<script>
import * as appApi from '@/api/app';
import * as roleApi from '@/api/role';
import * as authApi from '@/api/auth.user';

export default {
  name: 'RoleManage',
  data() {
    return {
      activeTabKey: '', // 当前选中标签页对应的应用id
      loading: true, // 是否正在加载
      isAdmin: false, // 当前账号是否为运维管理员
      apps: [], // 应用系统
      searchCondition: { name: '', isEnable: '' }, // 查询条件
      isEnableCodeTable: [{ text: '启用', value: true }, { text: '禁用', value: false }], // TODO: 是否启用码表
      roles: [],
    };
  },
  computed: {
    // 界面中显示的标签页
    tabs() {
      // 如果当前账号是运维管理员，标签页显示为应用系统
      if (this.isAdmin) {
        return this.apps.map(app => ({ name: app.name, key: app.appId }));
      }
      // 否则标签页固定显示为公共角色和私有角色（此时为系统管理员使用）
      return [{ name: '公共角色', key: 'public' }, { name: '私有角色', key: 'private' }];
    },
  },
  mounted() {
    // 判断当前账号是否为运维管理员
    this.judgeIsAdmin().then(isAdmin => {
      // 如果是运维管理员
      if (isAdmin) {
        // 加载应用系统
        this.loadApps().then(apps => {
          // 标记选中的tab标签页
          this.activeTabKey = apps[0].appId;
          // 加载角色列表
          this.loadRoles(this.activeTabKey);
        });
      } else {
        // 标记选中的tab标签页
        this.activeTabKey = 'public';
        // 直接加载公共角色列表
        this.loadRoles(null, 'public');
      }
    });
  },
  methods: {
    /**
     * 判断当前账号是否为运维管理员
     */
    judgeIsAdmin() {
      return authApi.judgeIsAdmin().then(isAdmin => {
        this.isAdmin = isAdmin;
        return isAdmin;
      });
    },
    /**
     * 加载应用系统
     */
    loadApps() {
      return appApi.loadApps().then(apps => {
        this.apps = apps;
        return apps;
      });
    },
    /**
     * 加载角色列表
     * @param {String} appId 应用系统id
     * @param {String} roleType 角色类型（public/公开角色 private/私有角色）
     */
    loadRoles(appId, roleType) {
      return roleApi.loadRoles(appId, roleType).then(roles => {
        this.roles = roles;
        this.loading = false;
        return roles;
      });
    },
    /**
     * 状态列格式化
     * @param {Object} role 角色
     */
    formatState(role) {
      return this.isEnableCodeTable.find(item => item.value === role.isEnable).text;
    },
    /**
     * 点击标签页事件
     */
    onTabClick() {
      // 显示加载效果
      this.loading = true;
      // 根据当前账号是否是运维管理员，执行不同的加载角色列表操作
      if (this.isAdmin) {
        this.loadRoles(this.activeTabKey);
      } else {
        this.loadRoles(null, this.activeTabKey);
      }
    },
    /**
     * 编辑角色
     * @param {Object} role 角色
     */
    editRole(role) {
      console.log('edit', role.name);
    },
    /**
     * 切换角色启用状态
     * @param {Object} role 角色
     * @param {Boolean} state 目标状态
     */
    toggleRoleState(role) {
      console.log('toggle', role.name);
    },
    /**
     * 删除角色
     * @param {Object} role 角色
     */
    deleteRole(role) {
      console.log('delete', role.name);
    },
  },
};
</script>

<style scoped>
.btn-container {
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #e9e9ee;
}
</style>
