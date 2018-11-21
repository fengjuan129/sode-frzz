<!-- 应用系统管理 -->
<template>
  <div>
    <div class="search-bar">
      <el-form :inline='true' :model="formSearch">
        <el-button size="mini">新增</el-button>

        <div class="f-r">
          <el-input v-model="formSearch.name" size="mini" placeholder="请输入系统名称">
            <el-button slot="append" icon='el-icon-search'></el-button>
          </el-input>
        </div>
      </el-form>
    </div>
    <!-- 搜索 END -->

    <el-table
      style='width: 100%'
      highlight-current-row
      :data='appList'>

      <el-table-column type='index' align="center" width="50"></el-table-column>
      <el-table-column prop='name' label="系统名称"></el-table-column>
      <el-table-column prop='name' label="系统编码" align='center' width='100'></el-table-column>
      <el-table-column prop='name' label="状态" align='center' width='80'></el-table-column>
      <el-table-column prop='name' label="所属机构" align='center' width='100'></el-table-column>
      <el-table-column prop='name' label="备注"></el-table-column>
      <el-table-column prop='name' label="排序" align='center' width='80'></el-table-column>
      <el-table-column prop='name' label="操作">
        <template slot-scope="scope">
          <el-button type='text'>编辑</el-button>
          <el-button type='text'>禁用</el-button>
          <el-dropdown trigger="click" style='margin-left: 10px;'>
            <el-button type='text' class='el-dropdown-link'>
              更多<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>黄金糕</el-dropdown-item>
              <el-dropdown-item>狮子头</el-dropdown-item>
              <el-dropdown-item>螺蛳粉</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'AppManage',

  components: {},

  data() {
    return {
      formSearch: {
        name: '',
      },
      appList: [
        {
          id: 100,
          name: 'qweqwe',
        },
      ],
    };
  },

  created() {},

  methods: {},
};
</script>
<style lang='less' scoped>
.search-bar {
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 15px;
  margin-bottom: 15px;
}
.f-r {
  float: right;
}
</style>
