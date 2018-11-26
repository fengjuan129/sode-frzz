<!-- 角色授权管理页面 -->
<template>
  <div>
    <el-tabs v-model="activeTabKey" @tab-click="loadRoles" type="border-card">

      <!-- tab标签栏 -->
      <el-tab-pane v-for="tab in tabs" :label="tab.name" :name="tab.key" :key="tab.key"></el-tab-pane>

      <!-- 查询栏 -->
      <el-form :inline="true" :model="formSearch" size="mini">
        <el-form-item label="角色名称">
          <el-input v-model="formSearch.name"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type='primary' @click="loadRoles">查询</el-button>
          <el-button @click="resetCondition">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 角色列表 -->
      <el-table :data="roles" v-loading="loading" highlight-current-row>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="name" label="角色名称"></el-table-column>
        <el-table-column prop="description" label="备注"></el-table-column>
        <el-table-column label="授权操作">
          <template slot-scope="scope">
            <el-button type='text' @click="roleAuthUser(scope.row)">[账号]</el-button>
            <!-- 资源授权操作需满足一定条件 -->
            <el-button type='text' @click="roleAuthMenu(scope.row)" v-show="canRoleAuthRes">[菜单]</el-button>
            <el-button type='text' @click="roleAuthApi(scope.row)" v-show="canRoleAuthRes">[服务]</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 用户选择组件 -->
      <select-user
        v-bind="winUser"
        v-if="winUser.visible"
        @select="onUserSelect"
        @close="winUser.visible = false">
      </select-user>

      <!-- 菜单选择组件 -->
      <select-menu
        v-bind="winMenu"
        v-if="winMenu.visible"
        @select="onMenuSelect"
        @close="winMenu.visible = false">
      </select-menu>

      <!-- 服务选择组件 -->
      <select-api
        v-bind="winApi"
        v-if="winApi.visible"
        @select="onApiSelect"
        @close="winApi.visible = false">
      </select-api>

    </el-tabs>
  </div>
</template>

<script>
import * as roleApi from '@/api/role';
import * as roleAuthApi from '@/api/auth.role';
import * as userAuthApi from '@/api/auth.user';
import SelectUser from '@/components/SelectUser';
import SelectMenu from '@/components/SelectMenu';
import SelectApi from '@/components/SelectApi';

export default {
  name: 'RoleAuthManage',
  components: { SelectUser, SelectMenu, SelectApi },
  data() {
    return {
      isTopAdmin: true, // 当前账号是否为顶级系统三员
      loading: true, // 是否正在加载
      activeTabKey: '', // 当前选中标签页
      formSearch: { name: '' }, // 查询条件
      roles: [], // 角色列表
      curRole: {}, // 当前角色
      // 账号选择窗口相关配置及数据
      winUser: {
        visible: false, // 是否可见
        multiple: true, // 是否多选
        selectedIds: [], // 已选账号id数组
      },
      // 账号选择窗口相关配置及数据
      winMenu: {
        visible: false, // 是否可见
        multiple: true, // 是否多选
        selectedIds: [], // 已选菜单id数组
      },
      // 服务选择窗口相关配置及数据
      winApi: {
        visible: false, // 是否可见
        multiple: true, // 是否多选
        selectedIds: [], // 已选服务id数组
      },
    };
  },
  computed: {
    // 界面中显示的标签页
    tabs() {
      // 如果当前账号是顶级系统三员，此时不显示标签页
      return this.isTopAdmin
        ? []
        : [{ name: '公共角色', key: 'public' }, { name: '私有角色', key: 'private' }];
    },
    // 是否能将资源授权给角色
    canRoleAuthRes() {
      // 下级小三员不能对继承自上级系统的角色进行资源授权操作，但可以将账号授权为这些角色
      // 当前账号是顶级系统三员 或 （当前账号不是顶级系统三员且选中角色类型为私有角色） 时，可以对页面中的角色进行授权操作
      return this.isTopAdmin || (!this.isTopAdmin && this.activeTabKey === 'private');
    },
  },
  created() {
    this.judgeIsTopAdmin().then(isTopAdmin => {
      this.activeTabKey = isTopAdmin ? '' : 'public';
      this.loadRoles();
    });
  },
  methods: {
    /**
     * 判断当前账号是否为顶级系统三员
     */
    judgeIsTopAdmin() {
      return userAuthApi
        .judgeIsTopAdmin()
        .then(isTopAdmin => {
          this.isTopAdmin = isTopAdmin;
          return isTopAdmin;
        })
        .catch(this.$errorHandler);
    },
    /**
     * 加载角色列表
     */
    loadRoles() {
      console.log(this.activeTabKey);
      this.loading = true;
      // 根据查询条件，查询启用的角色
      roleApi
        .loadRoles(null, this.activeTabKey, {
          name: this.formSearch.name,
          isEnable: true,
        })
        .then(roles => {
          this.roles = roles;
          this.loading = false;
        })
        .catch(this.$errorHandler);
    },
    /**
     * 重置查询条件
     */
    resetCondition() {
      this.formSearch.name = '';
      this.loadRoles();
    },
    /**
     * 角色账号授权
     * @param {object} role 要授权的角色
     */
    roleAuthUser(role) {
      this.curRole = role;
      // 加载已授权给角色的账号
      roleAuthApi
        .loadRoleUsers(role.id)
        .then(users => {
          console.log('获取到账号列表', users);
          // 设置初始勾选账号信息，打开账号选择页面
          this.winUser.selectedIds = users.map(user => user.id);
          this.winUser.visible = true;
        })
        .catch(this.$errorHandler);
    },
    /**
     * 角色菜单授权
     * @param {object} role 要授权的角色
     */
    roleAuthMenu(role) {
      this.curRole = role;
      // 加载已授权给角色的菜单
      roleAuthApi
        .loadRoleMenus(role.id)
        .then(menus => {
          console.log('获取到菜单列表', menus);
          // 设置初始勾选菜单信息，打开菜单选择页面
          this.winMenu.selectedIds = menus.map(menu => menu.id);
          this.winMenu.visible = true;
        })
        .catch(this.$errorHandler);
    },
    /**
     * 角色服务授权
     * @param {object} role 要授权的角色
     */
    roleAuthApi(role) {
      this.curRole = role;
      // 加载已授权给角色的服务
      roleAuthApi
        .loadRoleApis(role.id)
        .then(apis => {
          console.log('获取到服务列表', apis);
          // 设置初始勾选服务信息，打开服务选择页面
          this.winApi.selectedIds = apis.map(api => api.id);
          this.winApi.visible = true;
        })
        .catch(this.$errorHandler);
    },
    /**
     * 账号选择完成后，将当前角色授予选择的账号
     * @param {array} users 选择的账号
     */
    onUserSelect(users) {
      console.log('选择了账号', users);
      // 保存角色账号授权
      roleAuthApi
        .roleAuthUser(this.curRole.id, users.map(user => user.id))
        .then(() => {
          this.$message.success('授权成功');
        })
        .catch(this.$errorHandler);
    },
    /**
     * 菜单选择完成后，为当前角色授予菜单权限
     * @param {array} menus 选择的菜单
     */
    onMenuSelect(menus) {
      console.log('选择了菜单', menus);
      // 保存角色菜单授权
      roleAuthApi
        .roleAuthMenu(this.curRole.id, menus.map(menu => menu.id))
        .then(() => {
          this.$message.success('授权成功');
        })
        .catch(this.$errorHandler);
    },
    /**
     * 服务选择完成后，将当前角色授予选择的服务
     * @param {array} apis 选择的服务
     */
    onApiSelect(apis) {
      console.log('选择了服务', apis);
      // 保存角色服务授权
      roleAuthApi
        .roleAuthApi(this.curRole.id, apis.map(api => api.id))
        .then(() => {
          this.$message.success('授权成功');
        })
        .catch(this.$errorHandler);
    },
  },
};
</script>
