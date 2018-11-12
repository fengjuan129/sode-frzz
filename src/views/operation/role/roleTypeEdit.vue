<!-- 组织机构类型编辑页面 -->
<template>
  <el-dialog title='角色类型编辑' :visible.sync='isOpen' width="30%" :before-close="close">

    <el-form :model='roleTypeForm' size='small' label-width='80px' :rules='deptTypeRules' ref='roleTypeForm' status-icon>
      <el-row :gutter="30">
        <el-col :span='12'>
          <el-form-item label='角色名称' prop='typename'>
            <el-input v-model='roleTypeForm.typename'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label='排序'>
            <el-input v-model='roleTypeForm.code'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='24'>
          <el-form-item label='备注'>
            <el-input type='textarea' :autosize='{ minRows: 4, maxRows: 6}' v-model='roleTypeForm.description'></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      
    </el-form>
    <!-- roleTypeForm END -->

    <span slot='footer' class='dialog-footer'>
        <el-button size='mini' style='float: left;' @click='deleteDeptTye' :disabled="!this.id">删除</el-button>
        <el-button size='mini' @click='close'>取 消</el-button>
        <el-button size='mini' type='primary' @click='save("roleTypeForm")'>确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import DeptApi from '@/api/dept';
export default {
  // props: ['isOpen', 'id'],
  data() {
    return {
      isOpen: false,
      id: '',

      roleTypeForm: {},
      deptTypeRules: {
        typename: [
          { required: true, message: '此项为必填选项', trigger: 'blur' },
          { max: 32, message: '长度不能超过32位', trigger: 'blur' },
        ],
      },
    };
  },

  mounted() {
    // this.loadDepTypeInfo();
  },

  methods: {
    loadDepTypeInfo() {
      if (!this.id) return;
      DeptApi.getDeptTypeInfo(this.id).then(res => {
        /**
         * TODO: 假数据随机生成ID，重新赋值ID
         */
        res.id = this.id;
        this.$set(this, 'roleTypeForm', res);
      });
    },

    save(roleTypeForm) {
      this.$refs[roleTypeForm].validate(valid => {
        if (!valid) return;
        DeptApi.addDeptType(this.roleTypeForm).then(res => {
          let message = '';
          if (this.id) {
            message = '修改成功';
          } else {
            this.roleTypeForm.id = res.id;
            message = '保存成功';
          }
          console.log(this.roleTypeForm);
          this.$emit('save', this.roleTypeForm);
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
    deleteDeptTye() {
      this.$confirm('确定删除该组织机构', '提示', {
        confirmButtonText: '确定',
        cancelButton: '取消',
        type: 'warning',
      })
        .then(() => {
          DeptApi.deleteDeptType(this.id).then(res => {
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