<template>
  <div>
    <el-dialog
       :title="title"
       width="600px"
        visible
    >
      <div class="content">
        <el-form v-model="acountForm" size="small" label-width="80px" :rules="userEditRules">
          <!-- <el-input v-model="acountForm.deptCode" type="hidden" ></el-input>
          <el-input v-model="acountForm.orgCode" type="hidden"></el-input> -->
          <el-col :span="12">
            <el-form-item label="姓名" prop="realName">
              <el-input v-model="acountForm.realName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="账号" prop="userName">
              <el-input v-model="acountForm.userName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门" prop="deptName" disabled>
              <el-input v-model="acountForm.deptName" disabled ></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="单位" prop="orgCode" disabled>
              <el-input v-model="acountForm.orgCode" disabled></el-input>

            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="证件号" prop="certId" >
              <el-input v-model="acountForm.certId"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="密级" prop="securityLevel">
              <el-select v-model="acountForm.securityLevel">
                <el-option v-for="item in securityLevelData" :label="item.text" :value="item.value" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否启用" prop="isEnabled">
              <el-input v-model="acountForm.isEnabled"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="排序" prop="order">
              <el-input v-model="acountForm.order"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="备用" prop="description">
              <el-input type="textarea" v-model="acountForm.description" height="100"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-input v-model="acountForm.deptCode" type="hidden" ></el-input>
          </el-col>
           <el-col :span="12">
            <el-input v-model="acountForm.orgCode" type="hidden"></el-input>
          </el-col>
        </el-form>
      </div>

      <span slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </span>

    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'UserEdit',
  props: {
    title: String,
  },
  data() {
    return {
      acountForm: {},
      securityLevelData: [],
      /**
       * 表单验证规则
       */
      userEditRules: {
        userName: [
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
        securityLevel: [{ required: true, message: '此项为必填选项', trigger: 'blur' }],
      },
    };
  },
  methods: {
    save() {},
    close() {},
  },
};
</script>
<style lang="scss" scoped>
</style>
