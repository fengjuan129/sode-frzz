<!-- 账号锁定规则编辑页面 -->
<template>
  <div>
    <el-dialog
      title="设置 - 账号锁定规则"
      :visible.sync="isOpen"
      :before-close="close"
      width="25%">
      
      <div class='form-container'>
        <el-form ref="lockRuleForm" :model="lockRuleForm" label-width="80px">
          <el-form-item label="错误次数">
            <el-input-number v-model="lockRuleForm.errNo" controls-position="right" :min="1" :max="10"></el-input-number>
          </el-form-item>
          <el-form-item label="重置周期">
            <el-select v-model="lockRuleForm.cycle">
              <el-option label="6小时" value="6"></el-option>
              <el-option label="12小时" value="12"></el-option>
              <el-option label="18小时" value="18"></el-option>
              <el-option label="24小时" value="24"></el-option>
            </el-select>
            <el-tooltip class="item" effect="dark" content="提示文字" placement="right">
              <i class="el-icon-info" style='margin-left: 15px;'></i>
            </el-tooltip>
          </el-form-item>
          <el-form-item label="锁定时长">
            <el-select v-model="lockRuleForm.time">
              <el-option label="无限" value="0"></el-option>
              <el-option label="6小时" value="6"></el-option>
              <el-option label="12小时" value="12"></el-option>
              <el-option label="18小时" value="18"></el-option>
              <el-option label="24小时" value="24"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">确 定</el-button>
        <el-button @click="close">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/**
 * TODO: 加载时是否应该获取设置信息？
 */
export default {
  props: ['isOpen'],
  data() {
    return {
      lockRuleForm: {
        errNo: '',
        cycle: 6,
        time: '0',
      },
    };
  },

  methods: {
    save() {
      this.$message({
        message: '提交成功',
        type: 'success',
      });
      this.close();
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>
<style lang='less' scoped>
.form-container {
  // width: 70%;
  padding-left: 30px;
}
</style>