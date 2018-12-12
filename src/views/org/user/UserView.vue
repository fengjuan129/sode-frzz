<!-- 账号查看页面 -->
<template>
  <div>
    <el-dialog
      title="账号查看"
      width="500px"
      visible
      :before-close="close"
      :close-on-click-modal="false"
    >
      <el-form :model="userMsg" size="small" label-width="80px">
        <el-col :span="12">
          <el-form-item label="姓名:">{{userMsg.realName}}</el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="账号:">{{userMsg.username}}</el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="部门:">{{userMsg.deptName}}</el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="单位:">{{userMsg.orgName}}</el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="证件号:">{{userMsg.certId}}</el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="密级:">{{userMsg.securityLevel | format('securityLevel')}}</el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="是否启用:">{{formatIsEnable(userMsg.isLocked,userMsg.isEnabled)}}</el-form-item>
        </el-col>

        <el-col :span="12">
          <el-form-item label="排序:">
            {{userMsg.order}}
            <!-- <el-input v-model='userMsg.order' disabled></el-input> -->
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="备注:">
            {{userMsg.description}}
          </el-form-item>
        </el-col>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="close">关闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { format, getCodeTable } from '@/libs/codeTable';

export default {
  name: 'UserView',
  props: {
    user: Object,
  },
  data() {
    return {
      userMsg: { ...this.user },
      isEnable: getCodeTable('isEnable'),
    };
  },
  filters: {
    format,
  },
  methods: {
    formatIsEnable(isLocked, isEnabled) {
      if (isLocked === undefined || isEnabled === undefined) return '';
      // 锁定状态有先
      return isLocked ? '锁定' : this.isEnable.find(item => item.value === isEnabled).text;
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>
<style lang='less' scoped>
</style>
