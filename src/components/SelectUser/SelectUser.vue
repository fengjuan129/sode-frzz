<!-- 账号选择公共页面 -->
<template>
  <el-dialog title="账号选择" visible :before-close="close" :close-on-click-modal="false" width="400px">
    <div class="select-user-container" v-loading="loading">
      <el-tabs @tab-click="changeTab" v-model="activeTab">
        <el-tab-pane
          v-for="item in tabData"
          :key="item.id"
          :label="item.typename"
          :code="item.code"
          :name="item.code"
        ></el-tab-pane>

        <div class="select-user-search-bar">
          <el-input
            v-model="keyword"
            placeholder="输入关键词"
            style="width: 70%"
            size="mini"
            @keydown.13.native="getTree"
          ></el-input>
          <el-button type="primary" style="float: right;" size="mini " @click="getTree">查询</el-button>
        </div>
        <div class="select-user-tree">
          <!-- 全加载 -->
          <el-tree
            node-key="id"
            :data="treeData"
            :props="defaultProps"
            :show-checkbox="multiple"
            default-expand-all
            highlight-current
            ref="selectUserTree"
          ></el-tree>
        </div>
      </el-tabs>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submitUser('userEditForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import UserApi from '@/api/user';
import DeptApi from '@/api/dept';
import { data2treeArr } from '@/libs/utils';

export default {
  name: 'SelectUser',
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
    // 已选账号名称数组，此参数不为空时要在界面上勾选或选中对应数据
    selectedNames: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      loading: false,
      keyword: '', // 关键词搜索
      userList: [], // 保存列表信息
      defaultProps: {
        // tree 关联参数
        children: 'children',
        label: 'name',
      },
      tabData: [], // 保存组织机构类型
      activeTab: '', // 选中Tab
      checkedUser: '', // 保存选中人员
    };
  },

  computed: {
    treeData() {
      return data2treeArr(this.userList, 'code', 'parentCode', true);
    },
    defaultSelectMap() {
      const defaultSelectMap = {};

      this.selectedNames.forEach(item => {
        defaultSelectMap[item] = true;
      });

      return defaultSelectMap;
    },
  },

  created() {
    this.loadOrganization();
  },
  methods: {
    /**
     * 加装组织机构
     */
    loadOrganization() {
      this.loading = true;
      DeptApi.getDeptType()
        .then(res => {
          this.tabData = res;
          this.activeTab = this.rootCode || res[0].code;
          this.getTree();
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
        });
    },

    getTree() {
      this.loading = true;
      UserApi.getUserByDeptType(this.activeTab, this.keyword)
        .then(res => {
          /**
           * 11/27 后端返回参数 账户关联字段为 deptCode ，机构类型 关联字段为 parentCode，统一使用 parentCode
           */
          res = res || [];
          res.forEach(item => {
            if (item.username !== undefined && item.deptCode) {
              item.parentCode = item.deptCode;
              item.name = item.realName; // 添加显示项
              item.code = item.username;
            }
          });

          this.userList = res;

          // 默认选中
          if (this.selectedNames.length) {
            this.$nextTick(() => {
              this.selectedNames.forEach(item => {
                if (this.multiple) {
                  this.$refs.selectUserTree.setChecked(item, true, false);
                } else {
                  this.$refs.selectUserTree.setCurrentKey(item);
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

    changeTab(tab) {
      this.keyword = '';
      this.activeTab = tab.$attrs.code;
      this.getTree();
    },
    submitUser() {
      const select = this.$refs.selectUserTree[
        this.multiple ? 'getCheckedNodes' : 'getCurrentNode'
      ]();

      if (!select || select.length === 0 || select.children) {
        this.$message({
          message: '请选择用户后再提交',
          type: 'warning',
        });
        return;
      }

      const filterData = this.filterDelAndSaveOption(select);

      this.$emit('select', select, filterData.added, filterData.removed);
      this.close();
    },
    close() {
      this.$emit('close');
    },

    /**
     * 查找需要删除的选项
     * @param {Array} select 子组件返回勾选信息
     * @return {Object}  保存、删除集合
     */
    filterDelAndSaveOption(select) {
      select = select instanceof Array ? select : [select];
      const returnDate = {
        added: [],
        removed: [],
      };
      const { defaultSelectMap } = this;

      select.forEach(item => {
        if (defaultSelectMap[item.username]) {
          defaultSelectMap[item.username] = false; // 如果存在，表示不需要做修改操作
        } else {
          returnDate.added.push(item); // 新增项
        }
      });

      // 获取需要删除的选项
      returnDate.removed = this.userList.filter(item => defaultSelectMap[item.username] === true);
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
