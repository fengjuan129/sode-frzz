<template>
  <section class="page-container">
    <header>
      <div class="header-container">
        <nav-menu
          mode="horizontal"
          style="border-bottom: 0px;">
        </nav-menu>
      </div>
    </header>
    <main>
      <div class="main-container">
        <router-view></router-view>
      </div>
    </main>
  </section>
</template>

<script>
import NavMenu from '@/components/NavMenu';

export default {
  name: 'HeaderContentLayout',
  components: {
    NavMenu,
  },
  data() {
    return {};
  },
};
</script>

<style lang="less" scoped>
.page-container {
  min-height: 100%;

  header {
    box-sizing: border-box;
    border-bottom: 1px solid #e6e6e6;
  }
}

.header-container,
.main-container {
  width: 1160px;
  margin: 0 auto;
}

.main-container {
  padding-top: 20px;
}
</style>
