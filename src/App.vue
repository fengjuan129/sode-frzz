<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
/* 引入样式重置表 */
@import '~normalize.css';
/* 引入通用样式 */
@import './styles/common.scss';
</style>
