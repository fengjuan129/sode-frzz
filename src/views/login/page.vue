<template>
  <div class="login-page">
    <div class="layer bg" id="login"></div>
    <div class="layer flex-center">
      <!-- logo部分 -->
      <div class="logo-group">
        <img src="./image/logo.png" alt="logo">
      </div>
      <!-- 表单部分 -->
      <div class="form-group">
        <el-card>
          <el-form
            ref="loginForm"
            label-position="top"
            :rules="rules"
            :model="formLogin"
            size="default"
          >
            <el-form-item>
              <el-select
                v-model="formLogin.role"
                placeholder="请选择登录角色"
                @change="onRoleChange"
                style="width: 100%;"
              >
                <el-option label="运维管理员" value="admin"></el-option>
                <el-option label="顶级系统三员" value="topadmin"></el-option>
                <el-option label="小三员" value="sysadmin"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="username">
              <el-input
                type="text"
                v-model="formLogin.username"
                placeholder="用户名"
                @keyup.enter.native="submit"
              >
                <font-awesome-icon slot="prepend" icon="user"/>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="formLogin.password"
                placeholder="密码"
                @keyup.enter.native="submit"
              >
                <font-awesome-icon slot="prepend" icon="lock"/>
              </el-input>
            </el-form-item>
            <el-button @click="submit" size="default" type="primary" class="button-login">登录</el-button>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { setToken } from '@/libs/token';
import { login } from '@/api/login';
import config from '@/config';

export default {
  data() {
    return {
      // 表单
      formLogin: {
        username: 'admin',
        password: '123456',
        role: 'admin',
      },
      // 校验
      rules: {
        username: [{ required: true, message: '请输入用户名' }],
        password: [{ required: true, message: '请输入密码' }],
      },
    };
  },
  methods: {
    onRoleChange(role) {
      const accountList = {
        admin: {
          username: 'admin',
          appCode: '',
        },
        topadmin: {
          username: '',
          appCode: '',
        },
        sysadmin: {
          username: '',
          appCode: '',
        },
      };
      const { username, appCode } = accountList[role];
      this.formLogin.username = username;
      config.appCode = appCode;
    },
    // 调用登录服务实现登录
    submit() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          const { username, password } = this.formLogin;
          login(username, password)
            .then(tokenData => {
              setToken(tokenData);
              this.$router.replace('/');
            })
            .catch(this.$errorHandler);
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
