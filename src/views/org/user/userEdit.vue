<!-- 账号编辑页面 -->
import { valid } from 'semver';
<template>
  <div>
    <el-dialog
      title='设置 - 账号编辑'
      :visible.sync='isOpen'
      :before-close="close"
      width='30%'>
      <el-form :model='userEditForm' size='small' label-width='80px' :rules='userEditRules' ref='userEditForm'>
        <el-col :span='12'>
          <el-form-item label='姓名' prop='realName'>
            <el-input v-model='userEditForm.realName'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label='账号' prop='username'>
            <el-input v-model='userEditForm.username' :disabled="id ? true : false"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item prop='orgCode' class='t-select-dep'>
            <template>
              <a href="javascript: void(0)" slot='label' @click='dialogState = true'>部门</a>
              <el-input v-model='userEditForm.deptName' disabled placeholder="请选择部门"></el-input>
              <input type="hidden" v-model="userEditForm.orgCode">
            </template>
            <!--<el-input v-model='userEditForm.deptCode' :disabled="id ? true : false"></el-input>
            <div class='t-mask' @click='selectDep' v-if='id ? false : true'></div>-->
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label='单位'>
            <el-input v-model='userEditForm.orgCode' disabled></el-input>
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
              <el-option v-for='item in secretLev' :key='item.id' :label='item.tit' :value='item.id'></el-option>
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
          <el-form-item label='排序'>
            <el-input v-model='userEditForm.order'></el-input>
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
        <el-button type='primary' @click='save("userEditForm")'>确 定</el-button>
      </span>
      </el-dialog>


      <SelectDept :isOpen='dialogState' 
        @close='dialogState = false'
        @select="setDept"/>
  </div>
</template>

<script>
import Mock from 'mockjs';
import UserApi from '@/api/user';
import SelectDept from '@/components/SelectDept';
export default {
  props: ['id', 'isOpen', 'rootName'],
  data() {
    return {
      dialogState: false,
      userEditForm: {
        isEnabled: true,
      },
      /**
       * TODO: 数据字典
       */
      secretLev: [
        { id: 1, tit: '公开' },
        { id: 2, tit: '秘密' },
        { id: 3, tit: '绝密' },
        { id: 4, tit: '秘密1' },
        { id: 5, tit: '公开2' },
      ],
      /**
       * 表单验证规则
       * ! 验证规则的 key 需要与 表单的valueKey 对应。。。。
       */
      userEditRules: {
        username: [
          { required: true, message: '此项为必填选项', trigger: 'blur' },
          { min: 6, max: 32, message: '账号长度为 6 - 32个字符', trigger: 'blur' },
        ],
        realName: [
          { required: true, message: '此项为必填选项', trigger: 'blur' },
          { max: 32, message: '姓名长度不能超过32个字符', trigger: 'blur' },
        ],
        orgCode: [{ required: true, message: '此项为必填选项', trigger: 'blur' }],
        certId: [{ required: true, message: '此项为必填选项', trigger: 'blur' }],
      },
    };
  },
  components: {
    SelectDept,
  },
  mounted() {
    this.getUserById();
  },
  methods: {
    getUserById() {
      /**
       * 有 ID 为修改
       */
      if (!this.id) return;
      UserApi.getUserMsg(this.id).then(res => {
        // console.log(res);
        // this.$refs['userEditForm'].resetFields();
        this.userEditForm = res;
        this.userEditForm.deptName = this.rootName; // 后端为提供部门名称，父组件传入
      });
    },

    save(userEditForm) {
      this.$refs[userEditForm].validate(valid => {
        if (!valid) return;
        /**
         * TODO: 保存后 将数据发送给父组件，方法名 save
         */
        UserApi.userEdit(Object.assign(this.userEditForm, { id: this.id })).then(res => {
          this.$emit('save', res);
          this.$message({
            message: '保存成功',
            type: 'success',
          });
          this.close();
        });
      });
    },
    setDept(deptMsg) {
      /**
       * TODO 更具后端返回数据在做处理
       */
      this.userEditForm.deptName = deptMsg.name;
      this.userEditForm.orgCode = deptMsg.code;
      this.userEditForm.deptCode = deptMsg.code;
    },
    close() {
      this.$emit('close');
    },
  },
  watch: {
    // id(val, old) {
    //   if (val === undefined) {
    //     this.$refs['userEditForm'].resetFields();
    //     this.userEditForm = {};
    //   }
    //   if (!this.isOpen || !val) return;
    //   this.getUserById();
    // },
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