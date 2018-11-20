<!-- 系统资源分配页面 -->
<template>
  <div>
    <div class="t-pane" v-loading='dialogLoading'>
      <div class="pane-tit">
        <el-form :inline='true'>
          <el-form-item label="应用系统名称">
            <el-input v-model.trim="keyWord" size='mini' @keydown.13.prevent="loadSystem"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type='primary' size='mini' @click='loadSystem'>查询</el-button>
          </el-form-item>

          <el-form-item>
            <el-button size='mini' @click='keyWord = "",loadSystem'>重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- searchBar END -->
      <div class="pane-container">
        <el-table :data='systemList' style='width: 100%;' border hightlight-current-row v-loading='loading'>
          <el-table-column type='index' width='50' label="序号" align="center"></el-table-column>
          <el-table-column label='系统名称' prop='name'>
            <template slot-scope="scope">
              <span class='ms-tree-space' v-for='(item,index) in scope.row.level' :key='index'></span>
              {{scope.row.name}}
            </template>
          </el-table-column>
          <el-table-column label='系统编码' prop='code' width='100' align="center"></el-table-column>
          <el-table-column label='所属机构' prop='deptCode' width='100' align="center"></el-table-column>
          <el-table-column label='备注' prop='description'></el-table-column>
          <el-table-column label='分配操作'>
            <template slot-scope="scope">
              <a href="javascript: void(0)" class='m-5' @click='getSystemMenu(scope.row)'>[菜单]</a>
              <a href="javascript: void(0)" class='m-5' @click='getSystemApi(scope.row)'>[服务]</a>
              <a href="javascript: void(0)" class='m-5' @click='getSystemCodeTable(scope.row)'>[码表]</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- table END -->
    </div>

    <!-- 公共组件 -->
    <SelectMenu
      v-bind="selectMenu"
      v-if='selectMenu.isVisible'
      @close='selectMenu.isVisible = false'
      @select='saveSystemMenu'/>
    <!-- 菜单 END -->
    <SelectApi
      v-bind="selectApi"
      v-if='selectApi.isVisible'
      @close='selectApi.isVisible = false'
      @select='saveSystemApi'/>
    <!-- 服务 END -->
  </div>
</template>

<script>
import * as Utils from '@/libs/utils';
import * as AppAuthResApi from '@/api/auth.app';

import SelectMenu from '@/components/SelectMenu';
import SelectApi from '@/components/SelectApi';
import { major } from 'semver';
// TODO 代码项：@/components/SelectCodeItem.vue（暂缺）

export default {
  name: 'AppAuthRes',
  data() {
    return {
      keyWord: '',
      loading: false, // 数据加载图标
      dialogLoading: false,
      systemList: [], // 系统列表
      // 选择菜单弹框
      selectMenu: {
        isVisible: false,
        multiple: true,
        selectedIds: [],
      },
      // 选择服务弹框
      selectApi: {
        isVisible: true,
        multiple: true,
        selectedIds: [],
      },
      cacheData: {
        curRow: null, // 保存当前选中行
      },
    };
  },

  components: {
    SelectMenu,
    SelectApi,
  },

  created() {
    this.loadSystem();
  },

  methods: {
    // 获取系统列表
    loadSystem() {
      this.loading = true;
      AppAuthResApi.getSystemList(this.keyWord).then(res => {
        this.loading = false;
        this.systemList = Utils.data2treeGridArr(res, 'id', 'pid', true);
      });
    },

    // 获取系统菜单
    getSystemMenu(row) {
      this.cacheData.curRow = row;
      this.dialogLoading = true;
      AppAuthResApi.getAuthMenusBySystemId(row.id).then(res => {
        this.selectMenu.selectedIds = [...res];
        this.dialogLoading = false;
        this.selectMenu.isVisible = true;
      });
    },
    // 保存系统菜单
    saveSystemMenu(selectMenu) {
      // TODO 后端接收参数不确定
      const id = this.cacheData.curRow.id;
      const resId = this.findIds(selectMenu).join(',');
      AppAuthResApi.saveMenuAuth({ id, resId }).then(() => {
        this.$message({
          message: '保存成功',
          type: 'success',
        });
      });
    },
    // 获取系统服务
    getSystemApi(row) {
      this.cacheData.curRow = row;
      this.dialogLoading = true;
      AppAuthResApi.getSystemAuth(row.id).then(res => {
        this.selectApi.selectedIds = [...res];
        this.dialogLoading = false;
        this.selectApi.isVisible = true;
      });
    },
    // 保存系统服务
    saveSystemApi(selectApi) {},
    // 获取系统码表
    getSystemCodeTable(row) {
      this.cacheData.curRow = row;
      // TODO 暂无选中码表公共组件
    },
    // 保存系统码表
    saveSystemCodeTable(selectCodeTable) {
      // TODO 暂无选中码表公共组件
    },

    findIds(arr) {
      const returnArr = [];
      arr.forEach(element => {
        returnArr.push(element.id);
      });

      return returnArr;
    },
  },
};
</script>
<style lang='less' scoped>
.m-5 {
  margin: 0 5px;
}
.t-pane {
  @borderColor: #e9e9e9;
  border: 1px solid @borderColor;
  .pane-tit,
  .pane-container {
    padding: 11px 15px;
  }

  .pane-tit {
    border-bottom: 1px solid @borderColor;
  }

  .pane-tit .el-form-item {
    margin-bottom: 0;
  }
  .search-option-container {
    padding: 11px 15px 0 15px;
  }
}
.ms-tree-space {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: 'Glyphicons Halflings';
  font-style: normal;
  font-weight: 400;
  line-height: 1;
  width: 18px;
  height: 14px;
}
.ms-tree-space::before {
  content: '';
}
</style>
