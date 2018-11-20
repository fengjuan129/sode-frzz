<!-- 角色管理页面 -->
<template>
  <div>
    <el-tabs v-model="activeTabKey" @tab-click="onTabClick" type="border-card">

      <!-- tab标签栏 -->
      <el-tab-pane v-for="tab in tabs" :label="tab.name" :name="tab.key" :key="tab.key"></el-tab-pane>

      <!-- 按钮栏（公共角色不能编辑，此时不显示按钮栏） -->
      <div v-if="activeTabKey !== 'public'" class="btn-container">
        <el-button size="mini" @click="createRole">新增</el-button>
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
      <el-form :inline="true" :model="formSearch" size="mini">
        <el-form-item label="角色名称：">
          <el-input v-model="formSearch.name"></el-input>
        </el-form-item>
        <el-form-item v-if="isAdmin" label="状态：">
          <el-select v-model="formSearch.isEnable">
            <el-option
              v-for="item in isEnableCodeTable"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click="searchRoles">查询</el-button>
          <el-button @click="resetCondition">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 角色列表 -->
      <el-table :data="roles" v-loading="loading" highlight-current-row @selection-change="onSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="roleCode" label="角色编码"></el-table-column>
        <el-table-column prop="isEnable" label="状态">
          <template slot-scope="scope">
            {{ scope.row.isEnable | code2text('isEnable') }}
          </template>
        </el-table-column>
        <el-table-column prop="sort" label="排序"></el-table-column>
        <el-table-column prop="description" label="备注"></el-table-column>
        <el-table-column label="操作">
          <!-- 公共角色不允许编辑，此时不显示各类操作 -->
          <template v-if="activeTabKey !== 'public'" slot-scope="scope">
            <el-button type='text' @click="editRole(scope.row)">编辑</el-button>
            <el-button type='text' @click="toggleRoleState(scope.row)">{{scope.row.isEnable === true ? '禁用' : '启用'}}</el-button>
            <el-popover
              style="margin-left: 10px;"
              placement="top"
              v-model="scope.row.showDelPopOver">
              <p>确定删除此角色？</p>
              <div style="text-align: right;">
                <el-button size="mini" type="text" @click="scope.row.showDelPopOver = false">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteRole(scope.row)">确定</el-button>
              </div>
              <el-button type="text" slot="reference">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>

    </el-tabs>

    <!-- 角色编辑弹出窗口 -->
    <role-edit
      v-bind="winEditRole"
      v-if="winEditRole.visible"
      @close="winEditRole.visible=false"
      @save="onRoleSaved">
    </role-edit>

  </div>
</template>

<script>
import * as appApi from '@/api/app';
import * as roleApi from '@/api/role';
import * as authApi from '@/api/auth.user';
import RoleEdit from './RoleEdit.vue';

export default {
  name: 'RoleManage',
  components: { RoleEdit },
  data() {
    return {
      activeTabKey: '', // 当前选中标签页对应的应用id
      loading: true, // 是否正在加载
      isAdmin: true, // 当前账号是否为运维管理员
      apps: [], // 应用系统
      formSearch: { name: '', isEnable: '' }, // 查询条件
      isEnableCodeTable: [{ text: '启用', value: true }, { text: '禁用', value: false }], // TODO: 是否启用码表
      roles: [], // 角色数据
      // 编辑窗口相关配置及数据
      winEditRole: {
        visible: false, // 编辑窗口是否可见
        role: null, // 传入编辑窗口的角色
      },
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
  created() {
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
      this.loading = true;
      return roleApi.loadRoles(appId, roleType, this.formSearch).then(roles => {
        this.roles = roles.map(role => ({
          ...role,
          showDelPopOver: false, // 为每行数据添加是否显示确认删除框的标识
        }));
        this.loading = false;
        return roles;
      });
    },
    /**
     * 查询角色列表
     */
    searchRoles() {
      // 如果当前账号是运维管理员，按appId查询
      if (this.isAdmin) {
        this.loadRoles(this.activeTabKey);
      } else {
        // 如果不是，按角色类型查询
        this.loadRoles(null, this.activeTabKey);
      }
    },
    /**
     * 重置查询条件
     */
    resetCondition() {
      this.formSearch = { name: '', isEnable: '' };
      this.searchRoles();
    },
    /**
     * 点击标签页事件
     */
    onTabClick() {
      // 查询角色列表
      this.searchRoles();
    },
    /**
     * 新增角色
     */
    createRole() {
      this.winEditRole = {
        visible: true,
      };
    },
    /**
     * 编辑角色
     * @param {Object} role 角色
     */
    editRole(role) {
      this.winEditRole = {
        visible: true,
        role,
      };
    },
    /**
     * 角色保存成功回调方法
     * @param {object} role 保存后的角色
     */
    onRoleSaved(role) {
      // 关闭编辑窗口，显示提示信息
      this.winEditRole.visible = false;
      this.$message.success('保存成功');
      // 如果打开编辑窗口时传入了角色对象（表明此时为修改模式）
      if (this.winEditRole.role) {
        // 更新角色列表
        this.roles = this.roles.map(roleItem => {
          if (roleItem.id === role.id) {
            return role;
          }
          return roleItem;
        });
      } else {
        // 新增模式下将角色添加到列表中
        this.roles = [...this.roles, role];
      }
    },
    /**
     * 切换角色启用状态
     * @param {Object} role 角色
     * @param {Boolean} state 目标状态
     */
    toggleRoleState(role) {
      roleApi.setRoleEnable(role.id, !role.isEnable).then(() => {
        // 显示提示
        this.$message.success(`${role.isEnable ? '禁用' : '启用'}成功`);
        // 更新角色状态
        this.roles.forEach(roleItem => {
          if (roleItem.id === role.id) {
            roleItem.isEnable = !roleItem.isEnable;
          }
        });
      });
    },
    /**
     * 删除角色
     * @param {Object} role 角色
     */
    deleteRole(role) {
      // 隐藏确认删除提示
      role.showDelPopOver = false;
      roleApi.deleteRole(role.id).then(() => {
        // 显示提示
        this.$message.success('删除成功');
        // 将删除的角色从列表移除
        this.roles = this.roles.filter(roleItem => roleItem.id !== role.id);
      });
    },
    /**
     * 勾选项改变事件
     * @param {array} selection 选中角色列表
     */
    onSelectionChange(selection) {
      console.log('onSelectionChange', selection);
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
