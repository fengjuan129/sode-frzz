<template>
  <!-- TODO: 将此组件改造为函数式组件，去掉最外层的div，以解决收起菜单时样式无法生效的问题（目前在common.scss中加入了HACK，改造后需移除） -->
  <div>
    <!-- 遍历菜单数据生成菜单项 -->
    <template v-for="menu in menus">
      <el-submenu v-if="menu.children" :index="menu.id" :key="menu.id">
        <template slot="title">
          <i v-if="menu.icon" :class="menu.icon"></i>
          <span slot="title">{{menu.name}}</span>
        </template>
        <!-- 递归调用自身生成嵌套结构 -->
        <menu-item :menus="menu.children"></menu-item>
      </el-submenu>
      <el-menu-item v-else :key="menu.id" :index="menu.url">
        <i v-if="menu.icon" :class="menu.icon"></i>
        <span slot="title">{{menu.name}}</span>
      </el-menu-item>
    </template>
  </div>
</template>
<script>
export default {
  name: 'MenuItem',
  props: {
    menus: {
      type: Array,
      required: true,
    },
  },
};
</script>
