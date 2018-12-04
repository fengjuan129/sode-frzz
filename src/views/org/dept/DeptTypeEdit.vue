<!-- 组织机构类型编辑页面 -->
<template>
  <el-dialog
    title="组织机构类型编辑"
    visible
    width="500px"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-form
      :model="formDeptType"
      size="small"
      label-width="80px"
      :rules="deptTypeRules"
      ref="formDeptType"
      status-icon
    >
      <el-row :gutter="30">
        <el-col :span="24">
          <el-form-item label="类型名称" prop="typename">
            <el-input v-model="formDeptType.typename"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              v-model="formDeptType.description"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- formDeptType END -->
    <span slot="footer">
      <el-button style="float: left;" @click="deleteDeptTye" v-if="this.id">删除</el-button>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as DeptApi from '@/api/dept';

export default {
  name: 'DeptTypeEdit',
  props: {
    id: {
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      formDeptType: {},
      deptTypeRules: {
        typename: [
          { required: true, message: '此项为必填选项', trigger: 'blur' },
          { max: 32, message: '长度不能超过32位', trigger: 'blur' },
        ],
      },
    };
  },

  created() {
    this.loadDepTypeInfo();
  },

  methods: {
    /**
     * 加载机构类型
     */
    loadDepTypeInfo() {
      if (!this.id) return;
      this.loading = true;
      DeptApi.getDeptTypeInfo(this.id)
        .then(res => {
          this.$set(this, 'formDeptType', res);
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 编辑机构类型
     */
    save() {
      this.$refs.formDeptType.validate(valid => {
        if (!valid) return;
        DeptApi.editDeptType(this.formDeptType).then(res => {
          this.$emit('save', res);
          this.close();
          this.$message.success(this.id ? '修改成功' : '保存成功');
        });
      });
    },

    close() {
      this.$emit('close');
    },

    /**
     * 删除组织机构类型
     */
    deleteDeptTye() {
      this.$confirm('确定删除此组织机构类型？', '提示', {
        confirmButtonText: '确定',
        cancelButton: '取消',
        type: 'warning',
      })
        .then(() => {
          this.loading = true;
          DeptApi.deleteDeptType(this.id)
            .then(() => {
              this.$message({
                message: '删除成功',
                type: 'success',
              });
              this.$emit('delete', this.id);
            })
            .catch(this.$errorHandler);
        })
        .catch(() => {})
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
