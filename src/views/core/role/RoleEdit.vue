<!-- 角色编辑页面 -->
<template>
  <!-- 弹出窗口 -->
  <el-dialog title='角色编辑' :visible='visible' :before-close="close" width="30%">

    <!-- 角色表单 -->
    <el-form :model="formRole" :rules="rules" ref="formRole" size="mini" label-width="90px">
      <el-col :span="12">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="formRole.name"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="角色编码" prop="roleCode">
          <el-input v-model="formRole.roleCode"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="是否启用" prop="isEnable">
          <el-select v-model="formRole.isEnable">
            <el-option
              v-for="item in isEnableCodeTable"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="排序" prop="sort">
          <el-input v-model="formRole.sort"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span='24'>
        <el-form-item label='备注' prop="description">
          <el-input type='textarea' :autosize='{ minRows: 4, maxRows: 6}' v-model='formRole.description'></el-input>
        </el-form-item>
      </el-col>
    </el-form>

    <!-- 底部按钮栏 -->
    <span slot='footer' class='dialog-footer'>
      <el-button @click='close'>关 闭</el-button>
      <el-button type='primary' @click='save'>保 存</el-button>
    </span>

  </el-dialog>
</template>

<script>
import * as roleApi from '@/api/role';

export default {
  name: 'RoleEdit',
  props: {
    // 是否可见
    visible: {
      type: Boolean,
      required: true,
    },
    // 角色对象（修改时传入）
    role: {
      type: Object,
    },
  },
  data() {
    return {
      // 角色表单
      formRole: {
        deptCode: '',
        roleCode: '',
        name: '',
        isEnable: true,
      },
      // 表单验证规则
      rules: {
        name: [
          {
            required: true,
            message: '请输入角色名称',
          },
          {
            max: 32,
            message: '角色名称不能超过32个字符',
          },
        ],
        roleCode: [
          {
            required: true,
            message: '请输入角色编码',
          },
          {
            max: 32,
            message: '角色编码不能超过32个字符',
          },
        ],
      },
      isEnableCodeTable: [{ text: '启用', value: true }, { text: '禁用', value: false }], // TODO: 是否启用码表
    };
  },
  created() {
    // 如果传入了角色对象，表明为修改模式，此时将表单数据替换为传入对象的拷贝
    // ! 注意一定要拷贝传入的对象，否则子组件对对象的修改会影响父组件，除非设计效果就是这样
    if (this.role) {
      this.formRole = { ...this.role };
    }
  },
  methods: {
    /**
     * 关闭窗口
     */
    close() {
      // 触发关闭事件
      this.$emit('close');
    },
    /**
     * 保存角色
     */
    save() {
      // 验证表单
      this.$refs.formRole.validate(valid => {
        if (valid) {
          roleApi.saveRole(this.formRole).then(role => {
            // 更新表单角色对象
            this.formRole = { ...role };
            // 触发保存成功事件
            this.$emit('save', role);
          });
        }
      });
    },
  },
};
</script>
