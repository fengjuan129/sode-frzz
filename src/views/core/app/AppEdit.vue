<!-- 应用系统编辑页面 -->
<template>
  <div>
    <el-dialog
      width="650px"
      :title="title"
      visible
      :before-close="close"
      :close-on-click-modal="false"
    >
      <!-- 子系统提示 -->
      <div class="hint-container" v-if="!isRootApp && formApp.id === undefined">
        <el-alert title="子系统继承父系统的角色、菜单、服务及授权，并可基于这些配置进行扩展及自定义" type="warning" show-icon/>
      </div>

      <el-form
        :model="formApp"
        size="small"
        label-width="100px"
        :rules="formAppRules"
        ref="formApp"
      >
        <input type="hidden" v-model="formApp.deptCode">
        <el-row :gutter="30">
          <el-col :span="12">
            <el-form-item :label="isRootApp ? '系统名称' : '子系统名称'" prop="name">
              <el-input type="text" v-model="formApp.name"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item prop="deptName">
              <template>
                <el-button type="text" slot="label" @click="deptVisible = true">所属机构</el-button>
                <el-input v-model="formApp.deptName" disabled placeholder="请选择系统所属机构"></el-input>
              </template>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="是否启用">
              <el-select v-model="formApp.isEnable">
                <el-option
                  v-for="item in isEnableCodeTable"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="排序">
              <el-input v-model.number="formApp.sort"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="24">
            <el-form-item label="备注">
              <el-input
                type="textarea"
                :autosize="{ minRows: 4, maxRows: 6}"
                v-model="formApp.description"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="close">关闭</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </span>
    </el-dialog>

    <!-- 选择部门弹框 -->
    <select-dept v-if="deptVisible" @close="deptVisible = false" @select="setDept"></select-dept>
  </div>
</template>

<script>
import { getCodeTable } from '@/libs/codeTable';
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
        deptName: [{ required: true, message: '请选择所属机构' }],
      },
      isEnableCodeTable: getCodeTable('isEnable'),
    };
  },

  created() {
    this.initForm();
  },

  methods: {
    initForm() {
      // id undefined 新增
      if (this.app.id === undefined) {
        this.formApp.isEnable = true;
        this.formApp.pid = this.app.pid;
      } else {
        // 后端只接受表单数据，传多余数据报错 18/11/23
        const keys = Object.keys(this.formApp);

        keys.forEach(item => {
          this.formApp[item] = this.app[item];
        });
      }
    },
    close() {
      this.$emit('close');
    },
    save() {
      this.$refs.formApp.validate(valid => {
        if (!valid) return;
        // ! promise 层级太深转换出错，删除childern
        if (this.formApp.children) {
          this.formApp.children = [];
        }
        AppApi.editApp(this.formApp)
          .then(res => {
            console.log(res);

            this.$emit('save', res);
            this.close();
          })
          .catch(this.$errorHandler);
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
