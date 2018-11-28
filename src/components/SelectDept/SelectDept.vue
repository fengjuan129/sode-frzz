<!-- 组织机构选择公共页面 -->
<template>
  <el-dialog
    title="组织机构选择"
    visible
    :before-close="close"
    :close-on-click-modal="false"
    width="400px"
  >
    <div class="select-user-container">
      <el-tabs @tab-click="onTabClick" v-model="activeTabCode">
        <el-tab-pane
          v-for="item in deptTypeList"
          :key="item.code"
          :name="item.code"
          :label="item.typename"
          v-if="deptTypeList.length > 1 && !rootCode && isShowDeptTab"
        ></el-tab-pane>

        <div class="select-user-search-bar">
          <el-input
            v-model="keyword"
            placeholder="输入关键词"
            style="width: 70%"
            size="mini"
            @keydown.13.native="loadDept"
          ></el-input>
          <el-button type="primary" style="float: right;" size="mini " @click="loadDept()">查询</el-button>
        </div>
        <div class="select-user-tree">
          <!-- 全加载 -->
          <el-tree
            v-loading="loading"
            v-if="deptTypeList.length > 0"
            node-key="code"
            :data="treeData"
            :props="defaultProps"
            :show-checkbox="multiple"
            :default-expand-all="true"
            highlight-current
            ref="deptTree"
          ></el-tree>
        </div>
      </el-tabs>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sendSelectDept">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import DeptApi from '@/api/dept';
import * as Utils from '@/libs/utils';

export default {
  name: 'SelectDept',
  props: {
    // 是否允许多选。多选时显示checkbox
    multiple: {
      type: Boolean,
      default: false,
    },
    // 根节点的部门编码
    rootCode: {
      type: String,
    },
    // 默认选中code
    selectedCodes: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      keyword: '',
      loading: false,
      deptTypeList: [], // 组织机构类型
      deptList: [], // 组织机构
      activeTabCode: '',
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      isShowDeptTab: true, // TODO 是否启用多维组织机构常量，实现方式待定
    };
  },
  computed: {
    treeData() {
      return Utils.data2treeArr(this.deptList, 'code', 'parentCode', true);
    },
    // 默认选中项转为JSON，用于提交前数据过滤
    defaultSelectMap() {
      const defaultSelectMap = {};

      this.selectedCodes.forEach(item => {
        defaultSelectMap[item] = true;
      });

      return defaultSelectMap;
    },
  },
  mounted() {
    this.loadDeptType();
  },
  methods: {
    // 获取机构类型
    loadDeptType() {
      this.loading = true;
      DeptApi.getDeptType()
        .then(res => {
          this.deptTypeList = res.map(item => {
            const returnData = {
              ...item,
              name: item.typeName,
            };

            return returnData;
          });

          this.activeTabCode = this.rootCode || this.deptTypeList[0].code;
          this.loadDept();
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
        });
    },
    // 获取机构
    loadDept() {
      this.loading = true;
      DeptApi.getTreeByKeyword(this.keyword, this.activeTabCode, true)
        .then(res => {
          this.deptList = res;

          if (this.selectedCodes.length) {
            this.$nextTick(() => {
              this.selectedCodes.forEach(item => {
                if (this.multiple) {
                  this.$refs.deptTree.setChecked(item, true, false);
                } else {
                  this.$refs.deptTree.setCurrentKey(item);
                }
              });
            });
          }
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
        });
    },
    // tabs 点击
    onTabClick(tab) {
      this.keyword = '';
      this.activeTabCode = tab.name;
      this.loadDept();
    },
    // 提交选中项
    sendSelectDept() {
      const select = this.$refs.deptTree[this.multiple ? 'getCheckedNodes' : 'getCurrentNode']();

      if (select === null || select.length === 0) {
        this.$message({
          message: '请选择部门后再提交',
          type: 'warning',
        });
        return;
      }

      const filterData = this.filterDelAndSaveOption(select);

      // return;
      this.$emit('select', select, filterData.added, filterData.removed);
      this.close();
    },
    close() {
      this.$emit('close');
    },

    /**
     * 过滤新增、删除的选项
     * @param {Array} select 子组件返回勾选信息
     * @return {Object}  保存、删除集合
     */
    filterDelAndSaveOption(select) {
      select = select instanceof Array ? select : [select];
      const { defaultSelectMap } = this;
      const returnDate = {
        added: [],
        removed: [],
      };

      select.forEach(item => {
        if (defaultSelectMap[item.code]) {
          defaultSelectMap[item.code] = false; // 如果存在，表示不需要做修改操作
        } else {
          returnDate.added.push(item); // 新增项
        }
      });

      // 获取需要删除的选项
      returnDate.removed = this.deptList.filter(item => defaultSelectMap[item.code] === true);

      // 单选返回对象
      if (!this.multiple) {
        returnDate.added = { ...returnDate.added[0] };
        returnDate.removed = { ...returnDate.removed[0] };
      }
      return returnDate;
    },
  },
};
</script>
<style lang='scss' scoped>
.select-user-tree {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e9e9e9;
}
.select-user-container {
  min-height: 400px;
}
</style>
