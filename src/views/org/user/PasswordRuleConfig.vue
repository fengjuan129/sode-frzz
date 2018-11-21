<!-- 密码强度规则编辑页面 -->
<template>
  <div>
    <el-dialog
      title='设置 - 密码强度规则'
      :visible.sync='isOpen'
      :before-close="close"
      width='25%'>
        <el-form :model="pwdRuleForm" label-width="80px">
          <el-form-item>
            <el-checkbox label='必须包含字母' v-model="pwdRuleForm.letter"></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox label='必须包含大小写' v-model="pwdRuleForm.uperlowercase"></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox label='必须包含数字' v-model="pwdRuleForm.number"></el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="pwdRuleForm.length">
              <span class='t-label el-input--mini'>长度限制为
              <input type="text" class='el-input__inner' v-model="pwdRuleForm.size" @keydown.13.prevent="()=>{}"/> 位
            </span>
          </el-checkbox>
          </el-form-item>
        </el-form>

      <span slot='footer' class='dialog-footer'>
        <el-button type='primary' @click='save'>保 存</el-button>
        <el-button @click='close'>关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import UserApi from '@/api/user';

export default {
  props: ['isOpen'],
  data() {
    return {
      pwdRuleForm: {},
      clonePwdRuleForm: {}, // 缓存上次保存结果，修改后未保存直接关闭时使用
      isSave: false,
    };
  },

  mounted() {
    this.loadPwdRule();
  },

  methods: {
    loadPwdRule() {
      UserApi.loadPwdRule().then(res => {
        this.pwdRuleForm = res;
        this.clonePwdRuleForm = JSON.parse(JSON.stringify(res));
      });
    },
    save() {
      if (
        this.pwdRuleForm.length &&
        (this.pwdRuleForm.size === '' ||
          (this.pwdRuleForm.size !== '' && Number.isNaN(this.pwdRuleForm.size)))
      ) {
        this.$alert('密码长度必须为数字');
        return;
      }
      UserApi.savePwdRule(this.pwdRuleForm).then(res => {
        this.clonePwdRuleForm = JSON.parse(JSON.stringify(res));
        this.isSave = true;
        this.$message({
          message: '保存成功',
          type: 'success',
        });
        this.close();
      });
    },

    close() {
      this.$emit('close');
      if (!this.isSave) {
        /**
         * 未保存直接关闭，将数据回退到上次保存的状态
         */
        this.pwdRuleForm = Object.assign(this.pwdRuleForm, this.clonePwdRuleForm);
      }
      this.isSave = false;
    },
  },
};
</script>
<style lang='less' scoped>
.t-label {
  font-size: 14px;
  input {
    width: 60px;
  }
}
.t-hint {
  margin: 0;
  color: #f56c6c;
}
</style>
