<!-- 侧栏导航菜单 -->
<template>
  <div>
    <!-- 顶部插槽 -->
    <slot name="header"></slot>
    <!-- 菜单主体 -->
    <el-menu router :default-active="$route.path">
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>系统管理</span>
        </template>
        <el-menu-item index="/org/user">账号管理</el-menu-item>
        <el-menu-item index="/org/dept">组织机构管理</el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>运维管理</span>
        </template>
        <el-menu-item index="/core/app">应用系统管理</el-menu-item>
        <el-menu-item index="/res/menu">菜单管理</el-menu-item>
        <el-menu-item index="/core/role">角色管理</el-menu-item>
        <el-menu-item index="/res/api">服务管理</el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon-goods"></i>
          <span>安全管理</span>
        </template>
        <el-menu-item index="/auth/app">系统资源分配</el-menu-item>
        <el-menu-item index="/auth/role">角色授权管理</el-menu-item>
      </el-submenu>
      <el-menu-item index="/demo">vuex模块化示例</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  name: 'SiderMenu',
  props: [],
  data() {
    return {};
  },
};
</script>

<style scoped>
.el-menu {
  border-right: 0px;
}
</style>
