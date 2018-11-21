<!-- 组织机构编辑页面 -->
<template>
  <el-dialog title='组织机构编辑' :visible.sync='isOpen' width="30%" :before-close="close">

    <el-form :model="deptEditForm" :rules="deptEditRules" ref='deptEditForm' size='small' label-width='80px' status-icon>
      <el-row :gutter="30">
        <el-col :span='12'>
          <el-form-item label="名称" prop='name'>
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

        <el-col :span='12'>
          <el-form-item label="上级部门">
            <el-input v-model="deptEditForm.parentName" disabled></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label="是否启用">
            <el-select v-model="deptEditForm.isEnable">
              <el-option v-for='item in enableStatus' :key='item.id' :value='item.val' :label="item.txt"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label="是否法人">
            <el-select v-model="deptEditForm.isCorporation">
              <el-option label='否' :value='false'></el-option>
              <el-option label='是' :value='true'></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label="排序" prop="sort">
            <el-input v-model.number="deptEditForm.sort"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='24'>
          <el-form-item label="备注">
            <el-input type='textarea' :autosize='{ minRows: 4, maxRows: 6}' v-model='deptEditForm.description'></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>

    <span slot='footer' class='dialog-footer'>
        <el-button @click='close'>取 消</el-button>
        <el-button type='primary' @click='save("deptEditForm")'>确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import DeptApi from '@/api/dept';

export default {
  props: ['id', 'parentCode', 'parentName', 'isOpen'],
  data() {
    const checkSort = (rule, value, callback) => {
      if (value && !Number.isInteger(value)) {
        callback(new Error('请输入数字值'));
      } else {
        callback();
      }
    };

    return {
      deptEditForm: {
        isCorporation: false,
        isEnable: true,
      },
      // 验证规则
      deptEditRules: {
        name: [
          { required: true, message: '名称为必填选项', trigger: 'blur' },
          { max: 32, message: '名称不能超过32位', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '机构编码为必填选项', trigger: 'blur' },
          { max: 32, message: '机构编码超过32位', trigger: 'blur' },
        ],
        sort: [{ validator: checkSort, trigger: 'blur' }],
      },
      // TODO:状态数据字典
      enableStatus: [{ id: 0, txt: '禁用', val: false }, { id: 1, txt: '启用', val: true }],
    };
  },

  mounted() {
    // 判断新增、修改 有 ID 修改，无 ID 新增
    if (!this.id && this.parentCode && this.parentName) {
      this.$set(this.deptEditForm, 'parentCode', this.parentCode);
      this.$set(this.deptEditForm, 'parentName', this.parentName);
    } else {
      this.loadDeptInfo();
    }
  },

  methods: {
    loadDeptInfo() {
      DeptApi.loadDeptInfo(this.id).then(res => {
        res.parentName = this.parentName;
        this.deptEditForm = res;
      });
    },
    save() {
      this.$refs.deptEditForm.validate(valid => {
        if (!valid) return;

        this.$emit('save', this.deptEditForm);

        this.$message({
          message: '保存成功',
          type: 'success',
        });
        this.close();
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
