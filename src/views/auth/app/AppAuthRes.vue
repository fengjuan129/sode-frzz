<!-- 系统资源分配页面 -->
<template>
  <el-card class="box-card">
    <el-form :inline="true" @submit.native.prevent slot="header" class="clearfix">
      <el-form-item label="应用系统名称">
        <el-input v-model.trim="keyWord" size="mini" @keydown.13.prevent="loadSystem"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="mini" @click="loadSystem">查询</el-button>
      </el-form-item>

      <el-form-item>
        <el-button size="mini" @click="keyWord = '',loadSystem()">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="systemList"
      style="width: 100%;"
      border
      highlight-current-row
      v-loading="loading"
    >
      <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
      <el-table-column label="系统名称" prop="name">
        <template slot-scope="scope">
          <span class="ms-tree-space" v-for="(item,index) in scope.row.level" :key="index"></span>
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="系统编码" prop="code" width="100" align="center"></el-table-column>
      <el-table-column label="所属机构" prop="deptCode" width="100" align="center"></el-table-column>
      <el-table-column label="备注" prop="description"></el-table-column>
      <el-table-column label="分配操作">
        <template slot-scope="scope">
          <el-button type="text" @click="getSystemMenu(scope.row)">[菜单]</el-button>
          <el-button type="text" @click="getSystemApi(scope.row)">[服务]</el-button>
          <el-button type="text" @click="getSystemCodeTable(scope.row)">[码表]</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 公共组件 -->
    <select-menu
      v-bind="selectMenu"
      :selectedIds="cacheData.selectedIds"
      v-if="selectMenu.isVisible"
      @close="selectMenu.isVisible = false"
      @select="saveAppAuth"
    ></select-menu>
    <!-- 菜单 END -->
    <select-api
      v-bind="selectApi"
      :selectedIds="cacheData.selectedIds"
      v-if="selectApi.isVisible"
      @close="selectApi.isVisible = false"
      @select="saveAppAuth"
    ></select-api>
    <!-- 服务 END -->
  </el-card>
</template>

<script>
import * as Utils from '@/libs/utils';
import * as AppAuthResApi from '@/api/auth.app';

import SelectMenu from '@/components/SelectMenu';
import SelectApi from '@/components/SelectApi';
// TODO 代码项：@/components/SelectCodeItem.vue（暂缺）

export default {
  name: 'AppAuthRes',
  components: {
    SelectMenu,
    SelectApi,
  },
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
        autoCheckParent: true,
      },
      // 选择服务弹框
      selectApi: {
        isVisible: false,
        multiple: true,
      },
      cacheData: {
        curRow: null, // 保存当前选中行
        selectedIds: [], // 保存授权菜单、服务、码表 对应的资源ID
        selectedMsg: [], // 保存授权菜单、服务、码表 完整对象，便于保存时查找关联ID
      },
    };
  },

  created() {
    this.loadSystem();
  },
  methods: {
    // 获取系统列表
    loadSystem() {
      this.loading = true;

      AppAuthResApi.getSystemList({ name: this.keyWord, isEnable: true })
        .then(res => {
          this.systemList = Utils.data2treeGridArr(res, 'id', 'pid', true);
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
        });
    },

    // 获取系统菜单
    getSystemMenu(row) {
      this.cacheData.curRow = row;
      this.dialogLoading = true;

      AppAuthResApi.getAuthMenusBySystemId(row.id)
        .then(res => {
          // 未查询到授权菜单时 后端返回 null，
          this.cacheData.selectedIds = res ? res.map(item => item.id) : [];
          this.cacheData.selectedMsg = res || [];
          this.selectMenu.isVisible = true;
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.dialogLoading = false;
        });
    },

    // 保存系统授权
    saveAppAuth(select, added, removed) {
      /**
       * 11/23 resourceId / appId / resTypeCode 后端参数，要求组装成对象
       * 11/26 后端接收参数修改
       *       接收删除已勾选对象，新增对象
       */
      const appId = this.cacheData.curRow.id;
      let deleteIds = removed.map(item => item.id);

      const saveData = added.map(item => ({
        appId,
        resourceId: item.id,
        resTypeCode: item.resTypeCode,
      }));

      // 根据资源ID 查找 系统-资源关联ID
      deleteIds = this.findContactIdByResId(deleteIds);

      AppAuthResApi.saveAppAuth(saveData, deleteIds)
        .then(() => {
          this.$message({
            message: '保存成功',
            type: 'success',
          });
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.dialogLoading = false;
        });
    },

    // 获取系统服务
    getSystemApi(row) {
      this.cacheData.curRow = row;
      this.dialogLoading = true;

      AppAuthResApi.getSystemAuth(row.id)
        .then(res => {
          // 未查询到授权服务时 返回 NULL
          this.cacheData.selectedIds = res ? res.map(item => item.id) : [];
          this.cacheData.selectedMsg = res || [];
          this.dialogLoading = false;
          this.selectApi.isVisible = true;
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.dialogLoading = false;
        });
    },

    // 获取系统码表
    getSystemCodeTable(row) {
      this.cacheData.curRow = row;
      // TODO 暂无选中码表公共组件
    },
    // 保存系统码表
    saveSystemCodeTable(selectCodeTable) {
      // TODO 暂无选中码表公共组件
      console.log(selectCodeTable);
    },

    /**
     * 查找关联ID
     */
    findContactIdByResId(ids) {
      const map = {};
      const returnArr = [];

      this.cacheData.selectedMsg.forEach(item => {
        map[item.id] = item;
      });

      ids.forEach(item => {
        if (map[item]) {
          returnArr.push(map[item].reality); // 添加关联ID
        }
      });

      return returnArr;
    },
  },
};
</script>
<style lang='less' scoped>
.el-form-item {
  margin-bottom: 0;
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
