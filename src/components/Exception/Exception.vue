<template>
  <div class="exception">
    <div class="imgBlock">
      <img class="imgEle" :src="image">
    </div>
    <div class="content">
      <h1>{{ config[type].title }}</h1>
      <div class="desc">{{ config[type].desc }}</div>
      <div class="actions">
        <el-button type="primary" @click="goBack">重新加载</el-button>
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
  methods: {
    goBack() {
      this.$router.back();
    },
  },
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
