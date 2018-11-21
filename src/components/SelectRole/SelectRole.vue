<template>
  <el-dialog :title="title" :visible="visible" :before-close="close" width="300px">
    角色选择窗口
  </el-dialog>
</template>

<script>
export default {
  props: ['title', 'multiple', 'selectedIds', 'visible'],
  data() {
    return {};
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>
