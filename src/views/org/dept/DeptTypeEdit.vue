<!-- 组织机构类型编辑页面 -->
<template>
  <el-dialog
    title='组织机构类型编辑'
    visible
    width="500px"
    :close-on-click-modal='false'
    :before-close="close">

    <el-form :model='deptTypeForm' size='small' label-width='80px' :rules='deptTypeRules' ref='deptTypeForm' status-icon>
      <el-row :gutter="30">
        <el-col :span='24'>
          <el-form-item label='类型名称' prop='typename'>
            <el-input v-model='deptTypeForm.typename'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='24'>
          <el-form-item label='备注'>
            <el-input type='textarea' :autosize='{ minRows: 4, maxRows: 6}' v-model='deptTypeForm.description'></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <!-- deptTypeForm END -->

    <span slot='footer' class='dialog-footer'>
        <el-button size='mini' style='float: left;' @click='deleteDeptTye' :disabled="!this.id">删除</el-button>
        <el-button size='mini' @click='close'>取 消</el-button>
        <el-button size='mini' type='primary' @click='save("deptTypeForm")'>确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import DeptApi from '@/api/dept';

export default {
  name: 'DeptTypeEdit',
  props: {
    id: {
      type: String,
    },
  },
  data() {
    return {
      deptTypeForm: {},
      deptTypeRules: {
        typename: [
          { required: true, message: '此项为必填选项', trigger: 'blur' },
          { max: 32, message: '长度不能超过32位', trigger: 'blur' },
        ],
      },
    };
  },

  mounted() {
    this.loadDepTypeInfo();
  },

  methods: {
    /**
     * 加载机构类型
     */
    loadDepTypeInfo() {
      if (!this.id) return;
      DeptApi.getDeptTypeInfo(this.id).then(res => {
        this.$set(this, 'deptTypeForm', res);
      });
    },

    /**
     * 编辑机构类型
     */
    save(deptTypeForm) {
      this.$refs[deptTypeForm].validate(valid => {
        if (!valid) return;
        DeptApi.editDeptType(this.deptTypeForm).then(res => {
          let message = '';
          if (this.id) {
            message = '修改成功';
          } else {
            message = '保存成功';
          }
          this.$emit('save', res);
          this.close();
          this.$message({
            message,
            type: 'success',
          });
        });
      });
    },
    close() {
      this.$emit('close');
    },
    /**
     * 删除组织机构
     */
    deleteDeptTye() {
      this.$confirm('确定删除该组织机构', '提示', {
        confirmButtonText: '确定',
        cancelButton: '取消',
        type: 'warning',
      })
        .then(() => {
          DeptApi.deleteDeptType(this.id).then(() => {
            this.$message({
              message: '删除成功',
              type: 'success',
            });
            this.$emit('delete', this.id);
            this.close();
          });
        })
        .catch();
    },
  },
};
</script>
<style lang='less' scoped>
</style>
