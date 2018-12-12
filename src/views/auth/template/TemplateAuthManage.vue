<template>
  <div>
    <el-table :data="templateList" highlight-current-row>
      <el-table-column width='50' type='index' label="序号"></el-table-column>
      <el-table-column label="角色名称" prop="name"></el-table-column>
      <el-table-column label="备注" prop="description"></el-table-column>
      <el-table-column label="授权操作" prop="">
        <template slot-scope="scope">
          <el-button type="text" @click="tRoleAuthMenu(scope.row)">[菜单]</el-button>
          <el-button type="text" @click="tRoleAuthApi(scope.row)">[服务]</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- 菜单选择组件 -->
    <select-menu
      v-if='winMenu.visible'
      v-bind ='winMenu'
      @select="onMenuSelect"
      @close="winMenu.visible = false"
    />
    <!-- 服务选择组件 -->
    <select-api
      v-bind="winApi"
      v-if="winApi.visible"
      @select="onApiSelect"
      @close="winApi.visible=false"
    />
  </div>
</template>
<script>
import * as templateApi from '@/api/auth.template';
import * as roleAuthApi from '@/api/auth.role';
import SelectMenu from '@/components/SelectMenu';
import SelectApi from '@/components/SelectApi';

export default {
  name: 'TemplateAuthManage',
  data() {
    return {
      templateList: [],
      selectRole: {}, // 选中的角色
      // 菜单选择窗口相关配置及数据
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
      // 角色菜单授权记录（临时数据，用于获取删除授权记录的授权id集合）
      roleMenuAuthRecords: [],
      // 角色服务授权记录（临时数据用于获取删除授权记录的授权id集合）
      roleApiAuthRecords: [],
    };
  },
  components: {
    SelectMenu,
    SelectApi,
  },
  created() {
    this.getTemplaterolesList();
  },
  methods: {
    /**
     * 加载模板三员列表
     */
    getTemplaterolesList() {
      templateApi
        .loadPemplateroles()
        .then(res => {
          this.templateList = res;
        })
        .catch(this.$errorHandler);
    },
    /**
     *角色菜单授权
     *params {Object} role 授权的角色
     */
    tRoleAuthMenu(role) {
      this.selectRole = role;
      roleAuthApi
        .loadRoleMenus(this.selectRole.id)
        .then(records => {
          // 设置初始勾选菜单信息，打开菜单选择页面
          this.roleMenuAuthRecords = records;
          this.winMenu.selectedIds = records.map(record => record.resourceId);
          this.winMenu.visible = true;
        })
        .catch(this.$errorHandler);
    },
    /**
     * 菜单选择完成后，为当前角色授予菜单权限
     * @param {array} menus 选择的菜单
     */
    onMenuSelect(menus, added, removed) {
      // 获取新授权的菜单id集合
      const addedMenuIds = added.map(menu => menu.id);
      // 遍历查找要删除的授权记录id集合
      const removeAuthIds = removed.map(removedMenu => {
        const authItem = this.roleMenuAuthRecords.find(
          authRecord => authRecord.resourceId === removedMenu.id
        );
        return authItem.id;
      });
      // 保存角色菜单授权
      roleAuthApi
        .roleAuthMenu(this.selectRole.id, addedMenuIds, removeAuthIds)
        .then(() => {
          this.$message.success('授权成功');
        })
        .catch(this.$errorHandler);
    },
    /**
     * 角色服务授权
     * params {Object} role
     */
    tRoleAuthApi(role) {
      this.selectRole = role;
      roleAuthApi
        .loadRoleApis(this.selectRole.id)
        .then(res => {
          this.roleApiAuthRecords = res;
          this.winApi.selectedIds = res.map(item => item.resourceId);
          this.winApi.visible = true;
        })
        .catch(this.$errorHandler);
    },
    /**
     * 服务选择完成后，为当前选中的角色授服务权限
     */
    onApiSelect(apis, added, removed) {
      // 获取新授权的服务id
      const addIds = added.map(item => item.id);
      // 遍历查找要删除的授权记录id集合
      const removeAuthIds = removed.map(removedApi => {
        // 查找移除的服务此前是否已有授权记录
        const authItem = this.roleApiAuthRecords.find(
          authRecord => authRecord.resourceId === removedApi.id
        );
        return authItem.id;
      });
      roleAuthApi
        .roleAuthApi(this.selectRole.id, addIds, removeAuthIds)
        .then(() => {
          this.$message.success('授权成功');
        })
        .catch(this.$errorHandler);
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
