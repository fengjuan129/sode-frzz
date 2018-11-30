<!-- 组织机构编辑页面 -->
<template>
  <el-dialog title="组织机构编辑" visible width="30%" :before-close="close" :close-on-click-modal="false">
    <el-form
      :model="deptEditForm"
      :rules="deptEditRules"
      ref="deptEditForm"
      size="small"
      label-width="80px"
      v-loading="loading"
    >
      <el-row :gutter="30">
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input v-model="deptEditForm.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>
        <!--<el-col :span='12'>-->
        <!-- <el-form-item label="编码"> -->
        <!-- 修改是 编码不能修改 -->
        <!-- 18/11/12 后端要求编码不能填写，后台自动生成 -->
        <!-- <el-input v-model="deptEditForm.code" :disabled="id ? true : false"></el-input> -->
        <!-- <el-input v-model="deptEditForm.code" disabled></el-input> -->
        <!-- </el-form-item> -->
        <!-- </el-col> -->
        <el-col :span="12">
          <el-form-item label="上级部门">
            <el-input v-model="deptEditForm.parentName" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否启用">
            <el-select v-model="deptEditForm.isEnable">
              <el-option
                v-for="item in isEnable"
                :key="item.value"
                :value="item.value"
                :label="item.text"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否法人">
            <el-select v-model="deptEditForm.isCorporation">
              <el-option
                v-for="item in isCorporation"
                :key="item.value"
                :label="item.text"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="排序" prop="sort" ref="sort">
            <el-input v-model.number="deptEditForm.sort"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注">
            <el-input
              type="textarea"
              :autosize="{ minRows: 4, maxRows: 6}"
              v-model="deptEditForm.description"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="save">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DeptApi from '@/api/dept';
import { getCodeTable } from '@/libs/codeTable'; // 码表

export default {
  name: 'DeptEdit',
  props: {
    id: {
      type: String,
    },
    parentCode: {
      type: [String, Number],
      required: true,
    },
    parentName: {
      type: String,
      required: true,
    },
    deptTypeCode: {
      type: String,
    },
  },
  data() {
    return {
      loading: false,
      deptEditForm: {
        isCorporation: false,
        isEnable: true,
      },
      // 验证规则
      deptEditRules: {
        name: [
          { required: true, message: '请填写机构名称' },
          { max: 32, message: '长度不能超过32个字符' },
        ],
        sort: [
          {
            validator(rule, value, callback) {
              if (value && !Number.isInteger(value)) {
                callback(new Error('请输入数字值'));
              } else {
                callback();
                // this.$refs.sort.clearValidate();
              }
            },
          },
        ],
      },
      isEnable: getCodeTable('isEnable'), // 码表是否启用
      isCorporation: getCodeTable('isCorporation'), // 码表是否法人
    };
  },

  created() {
    // 判断新增、修改 有 ID 修改，无 ID 新增
    if (!this.id) {
      this.$set(this.deptEditForm, 'parentName', this.parentName);
      this.deptEditForm.parentCode = this.parentCode;
      // 后端要求根节点需要参入 code 参数
      if (this.parentCode === -1) {
        this.deptEditForm.code = this.deptTypeCode;
      }
    } else {
      this.loadDeptInfo();
    }
  },

  methods: {
    loadDeptInfo() {
      this.loading = true;
      DeptApi.loadDeptInfo(this.id)
        .then(res => {
          res.parentName = this.parentName;
          this.deptEditForm = res;
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
        });
    },
    save() {
      this.$refs.deptEditForm.validate(valid => {
        if (!valid) return;
        this.loading = true;
        DeptApi.editDept(this.deptEditForm)
          .then(res => {
            this.$emit('save', res);
            this.$message.success('保存成功');
          })
          .catch(this.$errorHandler)
          .finally(() => {
            this.loading = false;
          });
      });
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>
<style lang='less' scoped>
</style>
