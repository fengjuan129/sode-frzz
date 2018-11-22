<template>
  <div class="exception">
    <div class="imgBlock">
      <img class="imgEle" :src="image">
    </div>
    <div class="content">
      <h1>{{ config[type].title }}</h1>
      <div class="desc">{{ config[type].desc }}</div>
      <div class="actions">
        <router-link to="/">
          <el-button type="primary">返回首页</el-button>
        </router-link>
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
  },
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
