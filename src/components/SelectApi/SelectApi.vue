<!-- 选择服务公共页面 -->
<template>
  <el-dialog :title='title' :visible='isVisible' width="60%" :before-close="close">

    <div class="search-bar">
      <el-form :inline="true">
        <el-form-item label="服务名称">
          <el-input v-model.trim="formApi.name" size='mini'></el-input>
        </el-form-item>

        <el-form-item label="服务编码">
          <el-input v-model.trim="formApi.code" size='mini'></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type='primary' size='mini'>查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button size='mini'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索框 END -->

    <el-table border>
      <el-table-column label="服务名称"></el-table-column>
      <el-table-column label="服务编码"></el-table-column>
      <el-table-column label="服务路径"></el-table-column>
    </el-table>
    <span slot="footer" class='dialog-footer'>
        <el-button @click='close'>取 消</el-button>
        <el-button type='primary' @click='sendSelect'>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'SelectApi',
  props: {
    title: {
      type: String,
      default: '系统服务分配',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    selectedIds: {
      type: Array,
    },
  },
  data() {
    return {
      isVisible: true,
      formApi: {
        name: '',
        code: '',
      },
    };
  },

  created() {},

  methods: {
    sendSelect() {},
    close() {
      this.$emit('close');
    },
  },
};
</script>
<style lang='less' scoped>
</style>
