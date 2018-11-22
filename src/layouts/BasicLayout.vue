<template>
  <el-container style="min-height: 100%;">
    <el-aside>
      <sider-menu></sider-menu>
    </el-aside>
    <el-container>
      <el-header>
        <el-button @click="exit" type="danger" class="btn-exit">退出</el-button>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
      <!-- <el-footer>Copyright © {{new Date().getFullYear()}} {{company}}</el-footer> -->
    </el-container>
  </el-container>
</template>

<script>
import SiderMenu from '@/components/SiderMenu';
import { setToken } from '@/libs/token';
import { logout } from '@/api/login';
// import config from '@/config';

export default {
  name: 'BasicLayout',
  components: {
    SiderMenu,
  },
  data() {
    return {
      // company: config.company,
    };
  },
  methods: {
    exit() {
      logout().then(() => {
        setToken('');
        this.$router.push('/login');
      });
    },
  },
};
</script>

<style scoped>
.el-header {
  background-color: #b3c0d1;
}

.el-header,
.el-footer {
  color: #333;
  text-align: center;
}

.el-aside {
  border-right: solid 1px #e6e6e6;
}

.el-main {
  background-color: #fff;
  color: #333;
}

.btn-exit {
  float: right;
}
</style>
