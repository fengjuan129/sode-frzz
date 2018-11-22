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
        <el-dropdown @command="handleCommand" size="medium" class="user-dropdown">
          <div>
            <img src="../assets/logo.png" alt="头像">
            <span>运维管理员</span>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="setting" disabled>
              <i class="el-icon-setting"></i>&nbsp;&nbsp;个人设置
            </el-dropdown-item>
            <el-dropdown-item command="exit" divided>
              <i class="el-icon-circle-close"></i>&nbsp;&nbsp;退出登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <!-- 路由子页面显示区域 -->
        <router-view></router-view>
      </el-main>
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
      system: config.system,
    };
  },
  methods: {
    handleCommand(command) {
      if (command === 'exit') {
        logout().then(() => {
          setToken('');
          this.$router.push('/login');
        });
      }
    },
  },
};
</script>


<style lang="less" scoped>
.el-header {
  color: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: flex-end;

  .user-dropdown {
    div {
      display: inline-block;
      padding: 0 12px;
      height: 60px;
      line-height: 60px;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }
    img {
      height: 24px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
    }
    span {
      display: inline-block;
      vertical-align: middle;
      font-weight: normal;
    }
  }
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
</style>
