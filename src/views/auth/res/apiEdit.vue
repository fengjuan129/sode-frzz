<!-- 服务编辑页面 -->
<template>
  <el-dialog title='服务编辑' :visible.sync='isOpen' width="30%" :before-close="close">
    <el-form :model='apiForm' size='small' label-width='80px' :rules='apiRules' ref='apiForm' status-icon>
      <el-row :gutter="30">
        <el-col :span='12'>
          <el-form-item label='服务名称' prop='name'>
            <el-input v-model='apiForm.name'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label='服务编码' prop='code'>
            <el-input v-model='apiForm.code' :disabled="!isNew"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label='授权类型' prop='authType'>
            <el-select v-model="apiForm.authType">
              <el-option
                v-for='item in authType'
                :key='item.id'
                :label="item.name"
                :value='item.value'>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label="排序">
            <el-input v-model.number="apiForm.sort"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='24'>
          <el-form-item label="服务路径" prop='url'>
            <el-input v-model="apiForm.url"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='24'>
          <el-form-item label='备注'>
            <el-input type='textarea' :autosize='{ minRows: 4, maxRows: 6}' v-model='apiForm.description'></el-input>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
    <!-- apiForm END -->

    <span slot='footer' class='dialog-footer'>
        <el-button size='mini' @click='close'>取 消</el-button>
        <el-button size='mini' type='primary' @click='save'>确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
import Dic from '@/api/mockDictionary'; // TODO 假数据字典
import { editApi } from '@/api/resources';

export default {
  props: ['isNew', 'api'],
  data() {
    return {
      isOpen: true,
      apiForm: {},
      authType: Dic.authType, // TODO 授权类型，假数据
      apiRules: {
        name: [
          { required: true, message: '请填写服务名称', trigger: 'blur' },
          { max: 32, message: '服务名称长度不能超过32位', trigger: 'blur' },
        ],
        code: [
          { required: true, message: '请填写服务编码', trigger: 'blur' },
          { max: 32, message: '服务编码长度不能超过32位', trigger: 'blur' },
        ],
        authType: [{ required: true, message: '请选择授权类型', trigger: 'change' }],
        url: [
          { required: true, message: '请填写服务路径', trigger: 'blur' },
          { max: 64, message: '服务路径长度不能超过64位', trigger: 'blur' },
        ],
      },
    };
  },

  mounted() {
    this.initForm();
  },

  methods: {
    initForm() {
      if (this.isNew) {
        this.apiForm.resAffiliationType = this.api.resAffiliationType;
      } else {
        const keys = Object.keys(this.api);
        const cloneApi = {};

        for (let i = 0, len = keys.length; i < len; i += 1) {
          const item = keys[i];
          cloneApi[item] = this.api[item];
        }

        this.$set(this, 'apiForm', cloneApi);
      }
    },
    save() {
      this.$refs.apiForm.validate(valid => {
        if (!valid) return;
        // TODO 为调用接口，调用成功后后端会返回完整数据
        editApi(this.apiForm).then(res => {
          console.log(res);
          this.$emit('save', res);
          this.close();
          this.$message({
            message: '操作成功',
            type: 'success',
          });
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
