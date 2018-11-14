<!-- 菜单编辑页 -->
<template>
  <el-dialog title='菜单编辑' :visible.sync='isOpen' width="30%" :before-close="close">

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

          <el-col :span='12'>
            <el-form-item label="菜单编码" prop='code'>
              <el-input autocomplete='off' v-model="menuEditForm.code"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label="菜单类型" prop="menuType">
              <el-select v-model="menuEditForm.menuType">
                <el-option label="xxx" value='1'></el-option>
                <el-option label="xx2" value='2'></el-option>
                <el-option label="xx3" value='3'></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label="授权方式" prop='authType'>
              <el-select v-model="menuEditForm.authType">
                <el-option label="xxx" value='1'></el-option>
                <el-option label="xx2" value='2'></el-option>
                <el-option label="xx3" value='3'></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <!-- TODO 后期实现为选择字体图标 没有字段 -->
            <el-form-item label="菜单图标">
              <el-input autocomplete='off' v-model="menuEditForm.icon" placeholder="请输入图标类名"></el-input>
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
                <el-option label="xx" :value='true'></el-option>
                <el-option label="x1" :value='false'></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span='12'>
            <el-form-item label="是否可见">
              <el-select v-model="menuEditForm.isVisible">
                <el-option label="xx" value='1'></el-option>
                <el-option label="x1" value='2'></el-option>
              </el-select>
            </el-form-item>
          </el-col>

          <el-col :span='24'>
            <el-form-item label="菜单路径">
              <el-input autocomplete='off' v-model="menuEditForm.rul"></el-input>
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
        <el-button @click='close'>取 消</el-button>
        <el-button type='primary' @click='save()'>确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
export default {
  props: ['parentMenu', 'resType', 'menu'],
  data() {
    return {
      isOpen: true,
      menuEditForm: {
        isEnable: true,
      },
      menuEditRules: {
        name: [{ required: true, message: '请填写菜单名称', trigger: 'blur' }],
        code: [{ required: true, message: '请填写菜单编码', trigger: 'blur' }],
        menuType: [{ required: true, message: '请选择菜单类型', trigger: 'blur' }],
        authType: [{ required: true, message: '请选择授权类型', trigger: 'blur' }],
      },
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    save() {
      this.$refs.menuEditForm.validate(valid => {
        if (!valid) return;
        console.log(1);
        this.$emit('save');
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
