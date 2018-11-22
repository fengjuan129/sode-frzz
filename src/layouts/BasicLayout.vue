<template>
  <el-container style="min-height: 100%;">
    <!-- 侧栏 -->
    <el-aside width="265px">
      <!-- 侧栏导航菜单 -->
      <sider-menu>
        <template slot="header">
          <div class="logo-wrapper">
            <router-link to="/">
              <img src="../assets/logo.png" :alt="system">
              <h1>{{ system }}</h1>
            </router-link>
          </div>
        </template>
      </sider-menu>
    </el-aside>
    <!-- 页面主体 -->
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
import config from '@/config';

export default {
  name: 'BasicLayout',
  components: {
    SiderMenu,
  },
  data() {
    return {
      // company: config.company,
      system: config.system,
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


<style lang="less" scoped>
// .el-header {
//   background-color: #b3c0d1;
// }

.el-header,
.el-footer {
  color: #333;
  text-align: center;
}

.el-aside {
  border-right: solid 1px #e6e6e6;
}

.el-main {
  background-color: #f0f2f5;
  color: #333;
}

.logo-wrapper {
  height: 60px;
  line-height: 60px;
  padding-left: 24px;
  overflow: hidden;

  img {
    height: 30px;
    display: inline-block;
    vertical-align: middle;
  }

  h1 {
    display: inline-block;
    vertical-align: middle;
    font-size: 20px;
    margin: 0 0 0 12px;
  }
}

.btn-exit {
  float: right;
}
</style>
