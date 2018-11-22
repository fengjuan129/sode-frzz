<!-- 应用系统编辑页面 -->
<template>
  <div>
    <el-dialog width="650px" :title='title' visible :before-close="close">
      <!-- 子系统提示 -->
      <div class="hint-container" v-if='!isRootApp && formApp.id === undefined'>
        <el-alert
          title="子系统继承父系统的角色、菜单、服务及授权，并可基于这些配置进行扩展及自定义"
          type="warning"
          show-icon/>
      </div>

      <el-form :model="formApp" size='small' label-width='100px' :rules="formAppRules" ref='formApp'>
        <input type="hidden" v-model="formApp.deptCode">
        <el-row :gutter='30'>

          <el-col :span='24'>
            <el-form-item :label='isRootApp ? "系统名称" : "子系统名称"' prop='name'>
              <el-input type='text' v-model="formApp.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label="系统编码" prop='code'>
              <el-input type="text" v-model="formApp.code"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item prop="deptName">
              <template>
                <el-button type='text' slot='label' @click='deptVisible = true'>部门</el-button>
                <el-input v-model='formApp.deptName' disabled placeholder="请选择部门"></el-input>
              </template>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label='是否启用'>
              <el-select v-model="formApp.isEnable">
                <el-option
                  v-for="item in isEnableCodeTable"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label="排序">
              <el-input v-model.number="formApp.sort"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span='24'>
            <el-form-item label='备注'>
              <el-input type='textarea' :autosize='{ minRows: 4, maxRows: 6}' v-model='formApp.description'></el-input>
            </el-form-item>
          </el-col>

        </el-row>
      </el-form>

      <span slot='footer' class='dialog-footer'>
        <el-button size='mini' @click='close'>{{formApp.id ? '取 消' : '关闭'}}</el-button>
        <el-button size='mini' type='primary' @click='save'>{{formApp.id ? '确 定' : '保存' }}</el-button>
      </span>
    </el-dialog>

  <!-- 选择部门弹框 -->
    <select-dept
      v-if="deptVisible"
      @close='deptVisible = false'
      @select='setDept'>
    </select-dept>
  </div>
</template>

<script>
import SelectDept from '@/components/SelectDept';
import * as AppApi from '@/api/app';

export default {
  name: 'AppEdit',
  props: {
    title: {
      type: String,
      default: '应用系统编辑',
    },
    app: {
      type: Object,
      required: true,
    },
  },

  computed: {
    isRootApp() {
      return this.formApp.pid === -1;
    },
  },
  components: { SelectDept },

  data() {
    return {
      formApp: {
        id: '',
        name: '',
        code: '',
        deptCode: '',
        deptName: '',
        isEnable: true,
        sort: '',
        description: '',
        pid: '',
      },
      deptVisible: false,
      formAppRules: {
        name: [{ required: true, message: '请输入系统名称' }],
        code: [{ required: true, message: '请输入系统编码' }],
        deptName: [{ required: true, message: '请选择所属机构', trggir: 'changed' }],
      },
      isEnableCodeTable: [{ text: '启用', value: true }, { text: '禁用', value: false }], // TODO: 是否启用码表
    };
  },

  created() {
    this.formApp = { ...this.app };
    if (this.app.id === undefined) {
      this.formApp.isEnable = true;
    }
  },

  methods: {
    close() {
      this.$emit('close');
    },
    save() {
      this.$refs.formApp.validate(valid => {
        if (!valid) return;
        AppApi.editApp(this.formApp).then(res => {
          console.log(res);
          // TODO 测试添加 ID
          if (this.formApp.id === undefined) {
            this.formApp.id = Math.random();
          }
          this.$emit('save', this.formApp);
          this.close();
        });
      });
    },
    setDept(dept) {
      this.formApp.deptName = dept.name;
      this.formApp.deptCode = dept.code;
    },
  },
};
</script>
<style lang='less' scoped>
.hint-container {
  margin-bottom: 15px;
  &::after {
    content: '';
    overflow: hidden;
  }
}
</style>
