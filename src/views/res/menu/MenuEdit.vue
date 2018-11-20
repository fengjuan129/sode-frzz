<!-- 菜单编辑页 -->
<template>
  <el-dialog title='菜单编辑' :visible='true' width="30%" :before-close="close">
      <el-form
        :model="menuEditForm"
        ref="menuEditForm"
        :rules='menuEditRules'
        size='small'
        label-width='80px'
        status-icon>
        <el-row :gutter="30">

          <el-col :span='12'>
            <el-form-item label="菜单名称" prop='name'>
              <el-input autocomplete='off' v-model="menuEditForm.name"></el-input>
            </el-form-item>
          </el-col>

          <!-- <el-col :span='12'>
            <el-form-item label="菜单编码" prop='code'>
              <el-input autocomplete='off' v-model="menuEditForm.code"></el-input>
            </el-form-item>
          </el-col> -->

          <el-col :span='12'>
            <el-form-item label="菜单类型" prop="menuType">
              <el-select v-model="menuEditForm.menuType">
                <el-option v-for='item in menuType'
                  :key='item.id'
                  :label='item.name'
                  :value='item.value'>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label="授权方式" prop='authType'>
              <el-select v-model="menuEditForm.authType">
                <el-option v-for='item in authType'
                  :key='item.id'
                  :label='item.name'
                  :value='item.value'>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <!-- TODO 后期实现为选择字体图标 没有字段 -->
            <el-form-item label="菜单图标">
              <el-input autocomplete='off' v-model="menuEditForm.imagePath" placeholder="请输入图标类名"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label="排序">
              <el-input autocomplete='off' v-model.number="menuEditForm.sort"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label="是否启用">
              <el-select v-model="menuEditForm.isEnable">
                <el-option v-for='item in isEnable'
                  :key='item.id'
                  :label="item.name"
                  :value='item.value'>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label="是否可见">
              <el-select v-model="menuEditForm.isVisible">
                <el-option v-for='item in isVisible'
                  :key='item.id'
                  :label="item.name"
                  :value='item.value'>
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label="菜单路径">
              <el-input autocomplete='off' v-model="menuEditForm.url"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span='24'>
            <el-form-item label="备注">
              <el-input type='textarea'
                :autosize='{ minRows: 4, maxRows: 6}'
                autocomplete='off'
                v-model="menuEditForm.description">
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>

     <span slot='footer' class='dialog-footer'>
        <el-button @click='close'>{{parentMenu ? '关 闭' : '取 消' }}</el-button>
        <el-button type='primary' @click='save()'>{{parentMenu ? '保 存' : '确 定'}}</el-button>
      </span>
  </el-dialog>
</template>

<script>
import Dic from '@/api/mockDictionary'; // 数据字典对象

export default {
  name: 'MenuEdit',
  props: {
    parentMenu: {
      type: Number,
      required: true,
    },
    menu: {
      type: Object,
      required: false,
    },
  },
  data() {
    return {
      isOpen: true,
      menuEditForm: {
        isEnable: true, // 默认为启用
        isVisible: true, // 默认可见
      },
      // 表单验证规则
      menuEditRules: {
        name: [{ required: true, message: '请填写菜单名称', trigger: 'blur' }],
        // code: [{ required: true, message: '请填写菜单编码', trigger: 'blur' }],
        menuType: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
        authType: [{ required: true, message: '请选择授权类型', trigger: 'blur' }],
      },
      isEnable: Dic.isEnable, // TODO 是否启用为数据字典
      isVisible: Dic.isVisible, // TODO 是否可见为数据字典
      authType: Dic.authType, // TODO 授权方式为数据字典
      menuType: Dic.menuType, // TODO 菜单类型为数据字典
    };
  },

  mounted() {
    this.initForm();
  },

  methods: {
    initForm() {
      // parentMenu 没有为修改，有值为新增
      if (this.parentMenu !== undefined) {
        this.menuEditForm.parentId = this.parentMenu;
      } else {
        const keys = Object.keys(this.menu);
        const cloneMenu = {};

        keys.forEach(item => {
          cloneMenu[item] = this.menu[item];
        });

        this.$set(this, 'menuEditForm', cloneMenu);
      }
    },
    save() {
      this.$refs.menuEditForm.validate(valid => {
        if (!valid) return;

        this.$emit('save', this.menuEditForm);
        this.close();
      });
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>
<style lang='less' scoped>
</style>
