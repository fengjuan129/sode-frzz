<template>
  <!-- 角色选择窗口 -->
  <el-dialog :title="title" :visible="visible" :before-close="close" width="300px">

    <!-- 角色列表 -->
    <el-table :data="roles" v-loading="loading" highlight-current-row @selection-change="onSelectionChange">
      <!-- 多选时才显示checkbox列 -->
      <el-table-column type="selection" v-if="multiple"></el-table-column>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="角色名称"></el-table-column>
      <el-table-column prop="description" label="备注"></el-table-column>
    </el-table>

    <!-- 底部按钮栏 -->
    <span slot='footer' class='dialog-footer'>
      <el-button @click='close'>取 消</el-button>
      <el-button type='primary' @click='select'>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as roleApi from '@/api/role';

export default {
  name: 'SelectRole',
  props: {
    // 窗口是否可见
    visible: {
      type: Boolean,
      required: true,
    },
    // 窗口标题
    title: {
      type: String,
      default: '角色选择',
    },
    // 是否多选
    multiple: {
      type: Boolean,
    },
    // 已选角色id
    selectedIds: {
      type: Array,
    },
  },
  data() {
    return {
      roles: [], // 角色列表数据
      selectedRoles: [], // 勾选的角色
      name: '', // 查询条件，角色名称
      loading: true, // 是否正在加载
    };
  },
  created() {
    this.loadRoles();
  },
  methods: {
    /**
     * 加载角色列表
     */
    loadRoles() {
      // 根据查询条件，查询启用的角色
      roleApi
        .loadRoles(null, null, {
          name: this.name,
          isEnable: true,
        })
        .then(roles => {
          this.roles = roles;
        });
    },
    onSelectionChange(selection) {
      this.selectedRoles = selection;
      console.log(selection);
    },
    select() {
      this.$emit('select', [...this.selectedRoles]);
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>
