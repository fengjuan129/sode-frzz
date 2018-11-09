<!-- 角色管理页面 -->
<template>
  <div>
    <el-row :gutter='6'>
      <el-col :span='4'>1</el-col>
      <!-- tree END -->

      <el-col :span='20'>
        <!-- Tab -->
        <el-tabs type='border-card'>
          <el-tab-pane label='全部'></el-tab-pane>

          <div class="tool-bar">
            <el-col :span='20'>
              <el-button size='small'>新增</el-button>
            </el-col>

            <el-col :span='4'>
              <el-input placeholder="请输入内容" size='small' suffix-icon="el-icon-search"></el-input>
            </el-col>
          </div>
          <!-- toolBar END -->

          <el-table style="width: 100%;" :data='roleList'>
            <el-table-column v-for='(column,index) in columns' :key='index'
              :label='column.label'
              :width='column.width'
              :align='column.align'
              :prop='column.key'>
              <template scope="scope">
              </template>
            </el-table-column>
          </el-table>
        </el-tabs>
        <!-- Tab END -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      columns: [
        {
          lable: '角色名称',
          key: 'name',
          width: 150,
        },
        {
          lable: '角色编码',
          key: 'code',
          width: 100,
        },
        {
          lable: '角色类型',
          key: 'type',
          width: 100,
        },
        {
          lable: '所属机构',
          key: 'deptNmae',
        },
        {
          lable: '状态',
          key: 'state',
          width: 100,
        },
        {
          lable: '排序',
          key: 'sort',
          width: 50,
        },
        {
          lable: '备注',
          key: 'description',
        },
      ],
      roleList: [],
    };
  },

  components: {},

  computed: {},

  mounted() {},

  methods: {},
};
</script>
<style lang='less' scoped>
</style>