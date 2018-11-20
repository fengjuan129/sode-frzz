<!-- 服务类型编辑页面 -->
<template>
  <el-dialog title='服务类型编辑' :visible.sync='isOpen' width="30%" :before-close="close">

    <el-form :model='apiTypeForm' size='small' label-width='80px' :rules='apiTypeRules' ref='apiTypeForm' status-icon>
      <el-row :gutter="30">
        <el-col :span='12'>
          <el-form-item label='类型名称' prop='name'>
            <el-input v-model='apiTypeForm.name'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label='上级类型'>
            <el-input v-model='parentType' disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label="排序">
            <el-input v-model="apiTypeForm.sort"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='24'>
          <el-form-item label='备注'>
            <el-input type='textarea' :autosize='{ minRows: 4, maxRows: 6}' v-model='apiTypeForm.description'></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <!-- apiTypeForm END -->

    <span slot='footer' class='dialog-footer'>
        <el-button size='mini' style='float: left;' @click='deleteApiTye' :disabled='isNew'>删除</el-button>
        <el-button size='mini' @click='close'>取 消</el-button>
        <el-button size='mini' type='primary' @click='save'>确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import { editApiType, deleteApiType } from '@/api/resources';

export default {
  props: ['parentType', 'apiType', 'isNew'],
  data() {
    return {
      isOpen: true,
      apiTypeForm: {},
      apiTypeRules: {
        name: [{ required: true, message: '请填写类型名称', trigger: 'blur' }],
      },
    };
  },

  mounted() {
    this.initForm();
  },

  methods: {
    initForm() {
      /**
       * 有ID 为新增，无ID 修改
       */
      const cloneMsg = this.cloneObj(this.apiType);
      if (this.isNew) {
        this.apiTypeForm.pid = cloneMsg.id;

        // TODO 测试添加ID
        // this.apiTypeForm.id = parseInt(Math.random() * 100, 10);
      } else {
        this.$set(this, 'apiTypeForm', cloneMsg);
      }
    },
    save() {
      editApiType(this.apiTypeForm)
        .then(res => {
          console.log(res);
          // TODO 后端会返回编辑后的对象
          this.$emit('save', this.apiTypeForm);
          this.close();
          this.$message({
            message: this.isNew ? '添加成功' : '修改成功',
            type: 'success',
          });
        })
        .catch(this.$errorHandle);
    },
    deleteApiTye() {
      this.$confirm('删除后将无法，确定删除该服务类型?', '提示', { type: 'warning' }).then(() => {
        deleteApiType(this.apiType.id)
          .then(
            () => {
              this.$emit('delete', this.apiType.id);
              this.$message({
                message: '删除成功',
                type: 'success',
              });
              this.close();
            },
            () => {}
          )
          .catch(this.$errorHandle);
      });
    },
    close() {
      this.$emit('close');
    },
    /**
     * 复制对象属性
     */
    cloneObj(obj) {
      const keys = Object.keys(obj);
      const returnObj = {};

      keys.forEach(item => {
        if (item !== 'children') {
          returnObj[item] = obj[item];
        }
      });

      return returnObj;
    },
  },
};
</script>
<style lang='less' scoped>
</style>
