<!-- 侧栏导航菜单 -->
<template>
  <div>
    <!-- 顶部插槽 -->
    <slot name="header"></slot>

    <!-- 菜单主体 -->
    <el-menu router :default-active="$route.path" v-bind="$attrs">
      <menu-item :menus="menus"></menu-item>
    </el-menu>
  </div>
</template>

<script>
import MenuItem from './MenuItem.vue';

export default {
  name: 'NavMenu',
  components: { MenuItem },
  // 禁用特性继承，手动将父组件传入的props绑定到el-menu上
  inheritAttrs: false,
  props: {
    menus: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.el-menu {
  border-right: 0px;
  border-bottom: 0px;
}
</style>
