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
          <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin"
            size="default">
            <el-form-item  prop="username">
              <el-input type="text" v-model="formLogin.username" placeholder="用户名">
                <i slot="prepend" class="el-icon-edit"></i>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" v-model="formLogin.password" placeholder="密码">
                <i slot="prepend" class="el-icon-goods"></i>
              </el-input>
            </el-form-item>
            <el-button @click="submit" size="default" type="primary"
              class="button-login">登录</el-button>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { setToken } from '@/libs/token';

export default {
  data() {
    return {
      // 表单
      formLogin: {
        username: 'admin',
        password: 'admin',
        code: 'v9am',
      },
      // 校验
      rules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        code: [{ required: true, message: '请输入验证码', trigger: 'blur' }],
      },
    };
  },
  methods: {
    // TODO: 调用登录服务实现登录
    submit() {
      setToken(Date.now());
      this.$router.replace('/');
    },
  },
};
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
