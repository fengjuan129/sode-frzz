<!-- 服务类型编辑页面 -->
<template>
  <el-dialog title="服务类型编辑" :visible.sync="isVisible" width="30%" :before-close="close">
    <el-form
      :model="formApiType"
      size="small"
      label-width="80px"
      :rules="apiTypeRules"
      ref="formApiType"
      status-icon
    >
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="类型名称" prop="name">
            <el-input v-model="formApiType.name"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="上级类型">
            <el-input v-model="parentType" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="排序">
            <el-input v-model="formApiType.sort"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              v-model="formApiType.description"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- formApiType END -->
    <span slot="footer" class="dialog-footer">
      <el-button style="float: left;" @click="deleteApiTye" :disabled="isNew">删除</el-button>
      <el-button @click="close">关闭</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { editApiType, deleteApiType } from '@/api/res';

export default {
  name: 'ApiTypeEdit',
  props: {
    isNew: {
      type: Boolean,
      required: true,
    },
    parentType: {
      type: String,
      required: true,
    },
    apiType: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isVisible: true,
      formApiType: {},
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
        this.formApiType.pid = cloneMsg.id;
      } else {
        this.$set(this, 'formApiType', cloneMsg);
      }
    },
    save() {
      editApiType(this.formApiType)
        .then(res => {
          this.$emit('save', res);
          this.close();
          this.$message({
            message: this.isNew ? '添加成功' : '修改成功',
            type: 'success',
          });
        })
        .catch(this.$errorHandler);
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
          .catch(this.$errorHandler);
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
