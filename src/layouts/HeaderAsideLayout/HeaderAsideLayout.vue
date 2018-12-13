<template>
  <el-container style="min-height: 100%;">
    <!-- 侧栏 -->
    <el-aside :width="asideWidth">
      <!-- 侧栏导航菜单 -->
      <nav-menu v-bind="menuConfig" :menus="menuData">
        <template slot="header">
          <div class="logo-wrapper" :title="system">
            <router-link to="/">
              <img src="../../assets/logo.png" :alt="system">
              <h1>{{ system }}</h1>
            </router-link>
          </div>
        </template>
      </nav-menu>
    </el-aside>
    <!-- 页面主体 -->
    <el-container>
      <el-header>
        <div class="toggle-handler" @click="toggleCollapse">
          <font-awesome-icon
            icon="bars"
            class="toggle-icon"
            size="lg"
            :rotation="toggleIconRotation"
          />
        </div>
        <el-dropdown @command="handleCommand" size="medium" class="user-dropdown">
          <div class="user-info-container">
            <img src="../../assets/logo.png" class="avatar" alt="头像">
            <span class="user-name">运维管理员</span>
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
import { mapState, mapGetters, mapMutations, mapActions } from 'vuex';
import NavMenu from '@/components/NavMenu';
import { setToken } from '@/libs/token';
import { logout } from '@/api/login';
import config from '@/config';

export default {
  name: 'HeaderAsideLayout',
  components: {
    NavMenu,
  },
  data() {
    return {
      system: config.system, // 系统名称
    };
  },
  computed: {
    // 是否折叠侧栏
    ...mapState('global', {
      collapse: state => state.layout.collapse,
    }),
    // 侧栏菜单数据
    ...mapGetters('user', ['menuData']),
    // 获取侧栏宽度、菜单配置
    ...mapGetters('global', ['asideWidth', 'menuConfig']),
    // 切换侧栏折叠按钮旋转角度
    toggleIconRotation() {
      return this.collapse ? 270 : 180;
    },
  },
  created() {
    // 加载菜单数据
    this.loadCurUserMenus();
  },
  methods: {
    // 将切换侧栏收缩状态方法绑定到当前组件
    ...mapMutations('global', ['toggleCollapse']),
    // 将加载当前账号菜单方法绑定到当前组件
    ...mapActions('user', ['loadCurUserMenus']),
    /**
     * 处理下拉菜单操作
     * @param {string} command 操作类型
     */
    handleCommand(command) {
      // 退出登录
      if (command === 'exit') {
        logout()
          .then(() => {
            setToken('');
            this.$router.push('/login');
          })
          .catch(this.$errorHandler);
      }
    },
  },
};
</script>


<style lang="less" scoped>
.el-header {
  color: rgba(0, 0, 0, 0.65);
  padding-left: 0px;

  .toggle-handler {
    display: inline-block;
    height: 60px;
    line-height: 60px;
    padding: 0 20px;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
    .toggle-icon {
      transition: all 0.2s ease-in-out;
    }
    .toggle-icon.rotate {
      transform: rotate('90deg');
    }
  }

  .user-dropdown {
    float: right;
    .user-info-container {
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
    .avatar {
      height: 24px;
      display: inline-block;
      vertical-align: middle;
      margin-right: 8px;
    }
    .user-name {
      display: inline-block;
      vertical-align: middle;
      font-weight: normal;
    }
  }
}

.el-aside {
  border-right: solid 1px #e6e6e6;
  transition: all 0.2s ease-in-out;
  overflow: hidden;
}

.el-main {
  background-color: #f0f2f5;
  color: #333;
}

.logo-wrapper {
  height: 60px;
  line-height: 60px;
  padding-left: 17px;
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
