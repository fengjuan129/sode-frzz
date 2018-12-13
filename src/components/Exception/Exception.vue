<template>
  <div class="exception">
    <div class="imgBlock">
      <img class="imgEle" :src="image">
    </div>
    <div class="content">
      <h1>{{ config[type].title }}</h1>
      <div class="desc">{{ config[type].desc }}</div>
      <div class="actions">
        <el-button type="primary" @click="redirect">{{ btnText }}</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import config from './typeConfig';

export default {
  name: 'Exception',
  props: {
    type: {
      type: Number,
      default: 404,
    },
  },
  computed: {
    config() {
      return config;
    },
    image() {
      // eslint-disable-next-line global-require
      return require(`./img/${this.type}.svg`); // eslint-disable-line import/no-dynamic-require
    },
    btnText() {
      return this.type === 500 ? '重新加载' : '返回首页';
    },
  },
  methods: {
    /**
     * 路由重定向
     */
    redirect() {
      // 如果当前是500错误，返回原页面；如果是其他错误，返回首页
      if (this.type === 500) {
        this.$router.back();
      } else {
        this.$router.replace('/');
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
