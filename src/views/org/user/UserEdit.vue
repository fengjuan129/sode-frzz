<!-- 账号编辑页面 -->
<template>
  <div>
    <el-dialog
      title='设置 - 账号编辑'
      visible
      :before-close="close"
      :close-on-click-modal='false'
      width='600px'>
      <el-form :model='userEditForm' size='small' label-width='80px' :rules='userEditRules' ref='userForm'>
        <el-col :span='12'>
          <el-form-item label='姓名' prop='realName'>
            <el-input v-model='userEditForm.realName'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label='账号' prop='username'>
            <el-input v-model='userEditForm.username' :disabled="userEditForm.id ? true : false"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label='部门' prop='deptName'>
            <el-input v-model='userEditForm.deptName' disabled ></el-input>
          </el-form-item>
         <!-- <el-form-item prop='deptName' class='t-select-dep'>
            <template>
              <el-button type='text' slot='label' @click='dialogState = true'>部门</el-button>
              <el-input v-model='userEditForm.deptName' disabled placeholder="请选择部门"></el-input>
            </template>
          </el-form-item>
          -->
        </el-col>

        <el-col :span='12'>
          <el-form-item label='单位'>
            <el-input v-model='userEditForm.orgName' disabled ></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label='证件号' prop='certId'>
            <el-input v-model='userEditForm.certId'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label='密级'>
            <el-select v-model='userEditForm.securityLevel'>
              <el-option v-for='item in secretLev' :key='item.value' :label='item.text' :value='item.value'></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label='是否启用'>
            <el-select v-model="userEditForm.isEnabled">
              <el-option label="启用" :value="true"></el-option>
              <el-option label="禁用" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label='排序' prop="order">
            <el-input v-model.number='userEditForm.order'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='24'>
          <el-form-item label='备注'>
            <el-input type='textarea' :autosize='{ minRows: 4, maxRows: 6}' v-model='userEditForm.description' placeholder=''></el-input>
          </el-form-item>
        </el-col>
      </el-form>

      <span slot='footer' class='dialog-footer'>
        <el-button @click='close'>取 消</el-button>
        <el-button type='primary' @click='save("userForm")'>确 定</el-button>
      </span>
      </el-dialog>
      <SelectDept
        @close='dialogState = false'
        @select="setDept"
        v-if='dialogState'/>
  </div>
</template>

<script>
import * as UserApi from '@/api/user';
import SelectDept from '@/components/SelectDept';
import { getCodeTable } from '@/libs/codeTable';

export default {
  /**
   * user 账号对象,新增修改时传入
   */
  props: { user: Object },
  data() {
    return {
      dialogState: false,
      userEditForm: {
        isEnabled: true,

        ...this.user,
      },
      secretLev: getCodeTable('securityLevel'),
      /**
       * 表单验证规则
       * ! 验证规则的 key 需要与 表单的valueKey 对应。。。。
       */
      userEditRules: {
        username: [
          { required: true, message: '此项为必填选项', trigger: 'blur' },
          {
            max: 32,
            message: '账号长度不能超过32个字符',
            trigger: 'blur',
          },
        ],
        realName: [
          { required: true, message: '此项为必填选项', trigger: 'blur' },
          { max: 32, message: '姓名长度不能超过32个字符', trigger: 'blur' },
        ],
        deptName: [{ required: true, message: '此项为必填选项', trigger: 'change' }],
        certId: [{ required: true, message: '此项为必填选项', trigger: 'blur' }],
        order: [{ type: 'number', message: '序号必须为数字值', trigger: 'blur' }],
      },
    };
  },
  components: {
    SelectDept,
  },
  created() {},
  methods: {
    /**
     * 获取数据字典
     */
    // getSecretLevel() {
    //   this.secretLev = getCodeTable('securityLevel');
    // },
    save(userEditForm) {
      this.$refs[userEditForm].validate(valid => {
        if (!valid) return;
        UserApi.userEdit({ ...this.userEditForm }).then(res => {
          this.$message({
            message: '保存成功',
            type: 'success',
          });
          this.$emit('save', res);
          this.close();
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
.t-select-dep {
  position: relative;
  .t-mask {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    cursor: pointer;
  }
}
</style>
