<!-- 角色编辑页面 -->
<template>
  <el-dialog title='组织机构编辑' :visible.sync='isOpen' width="30%" :before-close="close">
    <el-form :model="roleEditForm"
      :rules="roleEditRules"
      ref='roleEditForm'
      size='small'
      label-width='80px'
      status-icon>
      <el-row :gutter="30">
        <el-col :span='12'>
          <el-form-item label="角色名称" prop='name'>
            <el-input v-model="roleEditForm.name" autocomplete="off"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label="角色编码" prop='code'>
            <!-- 修改是 编码不能修改 -->
            <el-input v-model="roleEditForm.code" :disabled="id ? true : false"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label="角色类型" prop='type'>
            <el-select v-model="roleEditForm.type">
              <el-option value='1'>类型数据字典</el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label="是否启用">
            <el-select v-model="roleEditForm.isEnable">
              <el-option v-for='item in enableStatus'
                :key='item.id'
                :value='item.val'
                :label="item.txt"></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label="所属机构">
            <el-input v-model='roleEditForm.dept'></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='12'>
          <el-form-item label="排序" prop="sort">
            <el-input v-model.number="roleEditForm.sort"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span='24'>
          <el-form-item label="备注">
            <el-input type='textarea'
              :autosize='{ minRows: 4, maxRows: 6}'
              v-model='roleEditForm.description'></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <span slot='footer' class='dialog-footer'>
        <el-button @click='close'>取 消</el-button>
        <el-button type='primary' @click='save("roleEditForm")'>确 定</el-button>
      </span>
  </el-dialog>
</template>

<script>
export default {
  name: 'RoleEdit',
  data() {
    return {
      isOpen: true,
      id: 1,
      // TODO 启用状态为数据字典
      enableStatus: [],
      roleEditForm: {},
      roleEditRules: {
        name: [{ required: true, message: '角色名称为必填选项', trigger: 'blur' }],
        code: [{ required: true, message: '角色编码为必填选项', trigger: 'blur' }],
        type: [{ required: true, message: '角色类型为必填选项', trigger: 'blur' }],
      },
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {
    close() {
      this.$emit('close');
    },
    save(roleEditForm) {
      this.$refs[roleEditForm].validate(valid => {
        if (!valid) return;
        console.log(1);
      });
    },
  },
};
</script>
