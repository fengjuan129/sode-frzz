<!-- 角色选择公共页面 -->
<template>
  <!-- 角色选择窗口 -->
  <el-dialog :title="title" visible :before-close="close" width="600px">
    <!-- 查询栏 -->
    <el-form :inline="true" size="mini">
      <el-form-item label="角色名称">
        <el-input v-model="name"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type='primary' @click="loadRoles">查询</el-button>
        <el-button @click="resetCondition">重置</el-button>
      </el-form-item>
    </el-form>

    <!-- 角色列表 -->
    <el-table
      ref="tableRole"
      :data="roles"
      v-loading="loading"
      highlight-current-row
      @selection-change="onSelectionChange"
      @current-change="onCurrentChange">
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
      default: () => [],
    },
  },
  data() {
    return {
      roles: [], // 角色列表数据
      selectedRoles: [], // 勾选的角色
      currentRole: {}, // 当前选中角色
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
      this.loading = true;
      // 根据查询条件，查询启用的角色
      roleApi
        .loadRoles(null, null, {
          name: this.name,
          isEnable: true,
        })
        .then(roles => {
          this.roles = roles;
          // 勾选已选中角色
          if (this.selectedIds.length > 0) {
            if (this.multiple) {
              // 多选
              this.$nextTick(() => {
                this.roles
                  .filter(role => this.selectedIds.some(selectedId => selectedId === role.id))
                  .forEach(role => {
                    this.$refs.tableRole.toggleRowSelection(role, true);
                  });
              });
            } else {
              // 单选
              this.$nextTick(() => {
                this.$refs.tableRole.setCurrentRow(
                  this.roles.find(role => role.id === this.selectedIds[0])
                );
              });
            }
          }
          this.loading = false;
        });
    },
    /**
     * 重置查询条件
     */
    resetCondition() {
      this.name = '';
      this.loadRoles();
    },
    /**
     * 勾选项改变时更新数据
     */
    onSelectionChange(selection) {
      this.selectedRoles = selection;
    },
    /**
     * 当前选中行发生改变
     * @param {object} currentRole 当前选中角色
     */
    onCurrentChange(currentRole) {
      this.currentRole = currentRole;
    },
    /**
     * 确定选择角色
     */
    select() {
      // 多选时返回勾选角色列表，单选时返回当前选择的角色对象
      const selection = this.multiple ? [...this.selectedRoles] : { ...this.currentRole };
      this.$emit('select', selection);
    },
    /**
     * 关闭窗口
     */
    close() {
      this.$emit('close');
    },
  },
};
</script>
