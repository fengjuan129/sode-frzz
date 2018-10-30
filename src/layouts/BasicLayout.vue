<template>
  <el-container style="height: 100%;">
    <el-aside>
      <menu-tree></menu-tree>
    </el-aside>
    <el-container>
      <el-header>
        <el-button @click="exit" type="danger" class="btn-exit">退出</el-button>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </el-container>
</template>

<script>
import MenuTree from '@/components/MenuTree';
import { setToken } from '@/libs/token';

export default {
  name: 'BasicLayout',
  components: {
    MenuTree,
  },
  methods: {
    exit() {
      setToken('');
      this.$router.push('/login');
    },
  },
};
</script>

<style scoped>
.el-header,
.el-footer {
  background-color: #b3c0d1;
  color: #333;
  text-align: center;
}

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: center;
}

.el-main {
  background-color: #e9eef3;
  color: #333;
  text-align: center;
}

.btn-exit {
  float: right;
}
</style>
