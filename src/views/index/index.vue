<template>
  <component :is="currentComponent"></component>
</template>

<script>
import { mapState } from 'vuex';
import HeaderAsideLayout from '@/layouts/HeaderAsideLayout';
import HeaderContentLayout from '@/layouts/HeaderContentLayout';

export default {
  name: 'Home',
  components: {
    HeaderAsideLayout,
    HeaderContentLayout,
  },
  computed: {
    // 确定当前使用哪种布局组件
    currentComponent() {
      return this.mode === 'vertical' ? HeaderAsideLayout : HeaderContentLayout;
    },
    // 获取显示模式
    ...mapState('global', {
      mode: state => state.layout.mode,
    }),
  },
};
</script>
