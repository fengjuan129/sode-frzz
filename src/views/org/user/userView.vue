<!-- 账号查看页面 -->
<template>
  <div>
    <el-dialog title='账号查看' width='30%' :visible.sync='isOpen' :before-close="close">

       <el-form :model='userMsg' size='small' label-width='80px'>
          <el-col :span='12'>
            <el-form-item label='姓名:'>
              {{userMsg.realName}}
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label='账号:'>
              {{userMsg.userName}}
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label='部门:'>
              {{userMsg.deptCode}}
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label='单位:'>
              {{userMsg.orgCode}}
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label='证件号:'>
              {{userMsg.certId}}
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label='密级:'>
              {{secretLevTxt}}
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label='是否启用:'>
              <span v-if='userMsg.isLocked == 1'><i class='el-icon-warning' style='color: #E6A23C; margin-right: 5px;'></i>锁定</span>
              <span v-else-if='userMsg.isEnabled == 1'><i class='el-icon-success' style='color: #67C23A; margin-right: 5px;'></i>启用</span>
              <span v-else-if='userMsg.isEnabled == 0'><i class='el-icon-error' style='color: #F56C6C; margin-right: 5px;'></i>禁用</span>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label='排序:'>{{userMsg.order}}
              <!-- <el-input v-model='userMsg.order' disabled></el-input> -->
            </el-form-item>
          </el-col>

          <el-col :span='24'>
            <el-form-item label='备注:'>
              <el-input type='textarea' :autosize='{ minRows: 4, maxRows: 6}' v-model='userMsg.description' placeholder='' disabled></el-input>
            </el-form-item>
          </el-col>
        </el-form>

        <span slot='footer' class='dialog-footer'>
          <el-button @click='close'>关闭</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import UserApi from '@/api/user';
export default {
  props: ['id', 'isOpen'],
  data() {
    return {
      userMsg: {},
      secretLev: [
        { id: 1, tit: '公开' },
        { id: 2, tit: '秘密' },
        { id: 3, tit: '绝密' },
        { id: 4, tit: '秘密1' },
        { id: 5, tit: '公开2' },
      ],
    };
  },

  computed: {
    secretLevTxt(id) {
      if (!this.userMsg.securityLevel) return;
      return this.secretLev.find(item => {
        return item.id == this.userMsg.securityLevel;
      })['tit'];
    },
  },

  methods: {
    getUserById() {
      UserApi.getUserMsg(this.id).then(res => {
        this.userMsg = res;
      });
    },

    close() {
      this.$emit('close');
    },
  },

  watch: {
    id(val) {
      if (!this.isOpen || !this.id) return;
      this.getUserById();
    },
  },
};
</script>
<style lang='less' scoped>
</style>