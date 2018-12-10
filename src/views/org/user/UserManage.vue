<template>
  <div>
    <el-tabs  type="border-card" @tab-click="changeType" >
       <el-tab-pane v-for="item in originTypes" :label="item.typename" :key="item.id" :code="item.code" v-if="originTypes.length>1"></el-tab-pane>
      <el-row :gutter="20">
        <el-col :span="4">
          <div class="select-user-search-bar">
              <el-input
                v-model="tree.keyword"
                placeholder="输入关键词"
                style="width: 60%"
                size="mini"
                @keydown.13.native="getTree"
              ></el-input>
              <el-button type="primary" style="float: right;" size="mini " @click="getTree">查询</el-button>
            </div>
          <div class="select-user-tree">
              <!-- 懒加载加载 不能使 v-IF -->
              <el-tree
                lazy
                :load="loadTreeChild"
                :props="tree.defaultProps"
                node-key="id"
                ref="userLazyTree"
                 @node-click="treeNodeClick"
              />
              <!-- 全加载 -->
              <el-tree
                v-if="!tree.isLazy"
                :data="tree.searchTreeData"
                :props="tree.defaultProps"
              />
          </div>
        </el-col>
        <el-col :span="20">
           <div class="t-header">
              <!-- 功能操作按钮组 start -->
             <div class="btns-container">
                <el-button type="" size="mini" @click="createUser">新增</el-button>
                <el-dropdown  style="margin-left: 10px;" >
                    <span class="el-dropdown-link">
                      <el-button size="mini">
                        批量操作
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item>账号迁移</el-dropdown-item>
                      <el-dropdown-item>启用</el-dropdown-item>
                      <el-dropdown-item>禁用</el-dropdown-item>
                      <el-dropdown-item>解锁</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
                <el-dropdown  style="margin-left: 10px;">
                  <span class="el-dropdown-link">
                    <el-button size="mini">
                      设置
                      <i class="el-icon-arrow-down el-icon--right"></i>
                    </el-button>
                  </span>
                  <el-dropdown-menu  slot="dropdown">
                    <el-dropdown-item>账号规则锁定</el-dropdown-item>
                    <el-dropdown-item>启用</el-dropdown-item>
                    <el-dropdown-item>禁用</el-dropdown-item>
                    <el-dropdown-item>解锁</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
             </div>


           </div>
           <el-form :inline="true" :model="userForm" size="mini">
              <el-form-item label="姓名">
                <el-input v-model="userForm.realName"></el-input>
              </el-form-item>
              <el-form-item label="账号">
                <el-input v-model="userForm.userName"></el-input>
              </el-form-item>
              <el-form-item label="类型">
                <el-select v-model="userForm.status" placeholder="类型">
                  <el-option
                    v-for="item in userStatus"
                    :key="item.id"
                    :label="item.tit"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button size="mini" type="primary">查询</el-button>
                 <el-button size="mini" >重置</el-button>
              </el-form-item>
           </el-form>
           <div>
             <el-table
               :data="userList"
               style="100%"
              >
                <el-table-column type="index" width="55" label="序号"></el-table-column>
                <el-table-column label="姓名" prop="realName"></el-table-column>
                <el-table-column label="账号" prop="username"></el-table-column>
                <el-table-column label="密级" prop="securityLevel" :formatter="isSecurityLevel"></el-table-column>
                <el-table-column label="状态" prop="isEnabled">

                </el-table-column>
                <el-table-column label="操作" width="200">
                  <template slot-scope="scope" size="mini">
                    <el-button type="text">查看</el-button>
                    <el-button type="text">编辑</el-button>
                    <el-dropdown style="margin: 0 10px;" >
                       <a
                        href="javascript: void(0)"
                        class="el-dropdown-link el-button--text"
                        @click="curUser = scope.row"
                      >
                        更多
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </a>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>启用</el-dropdown-item>
                        <el-dropdown-item>禁用</el-dropdown-item>
                        <el-dropdown-item>解锁</el-dropdown-item>
                        <el-dropdown-item>重置密码</el-dropdown-item>
                        <el-dropdown-item>账号迁移</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>

             </el-table>
             <el-pagination
               :page-count="page.count"
               :page-size="page.size"
               :total="page.total"
               :page-sizes="[5, 20, 30, 40, 50, 100]"
               layout="total, sizes, prev, pager, next, jumper"

               @size-change="pageSizeChange"
               @current-change="pageSizeChange"
               style="float:right;margin-right:10px;"
             >
             </el-pagination>
           </div>
        </el-col>
      </el-row>
    </el-tabs>
    <!-- 编辑界面弹出框 -->
    <User-Edit
      v-if="dialog.isShowEdit"
      title="设置-账号信息"
    />
  </div>
</template>
<script>
import UserApi from '@/api/user'; // 用户管理接口
import DeptApi from '@/api/dept'; // 组织机构管理接口
import { createFormatter } from '@/libs/codeTable';
// import * as authApi from '@/api/auth.user';
import * as Utils from '@/libs/utils';
import UserEdit from './UserEdit.vue';

export default {
  name: 'UserManage',
  data() {
    return {
      originTypes: [], // 组织机构类型
      treeLoading: false,
      tree: {
        keyword: '',
        isLazy: false, // 控制显示 Tree
        lazyTreeData: [],
        searchTreeData: [],
        defaultProps: {
          children: 'children',
          label: 'name',
        },
      },
      organizationId: null, // 机构ID
      activeTab: '', // 当前选中Tab
      activeDeptName: '', // 18/11/12 保存当前选项卡名称，编辑时传入只组件
      userForm: {}, // 查询条件
      userList: [], // 用户列表
      page: { size: 0, count: 0, total: 0 }, // 分页对象
      userStatus: [{ id: 1, tit: '启用', value: true }, { id: 2, tit: '禁用', value: false }],
      dialog: {
        isShowEdit: false,
      },
    };
  },
  components: {
    UserEdit,
  },
  created() {
    this.loadTreeTypes();
  },
  methods: {
    /**
     *  加载组织机构类别
     */
    loadTreeTypes() {
      DeptApi.getDeptType().then(res => {
        this.originTypes = res;
        this.getTree();
      });
    },
    /**
     *  获取Tree列表
     */
    getTree() {
      const { tree } = this;
      if (tree.keyword) {
        tree.isLazy = false;
        DeptApi.getTreeByKeyword(tree.keyword, this.activeTab)
          .then(res => {
            tree.searchTreeData = Utils.data2treeArr(res);
            if (tree.searchTreeData.length === 0) return;
            this.$refs.userLazyTree.setCurrentKey(tree.searchTreeData[0].id);
            this.organizationId = tree.searchTreeData[0].code;
          })
          .catch(this.$errorHandler)
          .finally(() => {
            this.loading = false;
          });
      } else {
        tree.isLazy = true;
      }
    },
    loadTreeChild(node, resolve) {
      if (node.level === 0) {
        this.lazyTreeInit(resolve);
      }
      if (node.level >= 1) {
        this.getLeaf(node, resolve);
      }
    },
    /**
     * 加载第一级tree节点
     */
    lazyTreeInit(resolve) {
      this.treeLoading = true;
      DeptApi.getLazyTree(this.activeTab, -1, true)
        .then(res => {
          resolve(res);
          if (res.length === 0) return;
          this.$refs.userLazyTree.setCurrentKey(res[0].id);
          this.organizationId = res[0].code;

          this.activeDeptName = res[0].name;
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.treeLoading = false;
        });
    },
    /**
     * 加载子节点
     */
    getLeaf(node, resolve) {
      this.treeLoading = true;
      DeptApi.getLazyTree(this.activeTab, node.data.code, true)
        .then(res => {
          resolve(res);
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.treeLoading = false;
        });
    },
    /**
     * 用户列表
     * @param {Boolean} isClear 是否清空搜索项
     * @param {object} page 分页条件
     */
    getUserListByOption(isClear, page = { pageSize: 20, current: 1 }) {
      this.loading = true;
      const searchOption = {}; // 18/11/14 处理eslint 不能使用 delete 删除属性，保存搜索条件
      if (isClear) {
        this.userForm = {};
      } else {
        const { status } = this.userForm;
        const keys = Object.keys(this.userForm); // eslint 不允许使用 for..in for...of

        for (let i = 0, len = keys.length; i < len; i += 1) {
          const key = keys[i];
          if (key !== 'isLocked' && key !== 'isEnabled' && key !== 'status') {
            searchOption[key] = this.userForm[key];
          }
        }
        // 启用、禁用 为同一字段，与锁定字段不同
        if (status !== undefined && status === 'locked') {
          searchOption.isLocked = true;
        } else {
          searchOption.isEnabled = status;
        }
      }

      UserApi.loadUserList(Object.assign({}, searchOption, { deptCode: this.organizationId }, page))
        .then(res => {
          this.userList = res.users;
          this.page.current = res.current;
          this.page.total = res.total;
          this.page.pageSize = res.pageSize;
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
        });
    },
    // 组织机构类别切换
    changeType() {
      console.log(2);
    },
    /**
     * 全加载tree 点击节点
     */
    treeNodeClick(node) {
      this.userForm = {};
      this.organizationId = node.code; // 触发 watch
      this.activeDeptName = node.name;
    },
    pageSizeChange() {
      console.log(2);
    },
    /**
     * 密级过滤，使用码表方法
     */
    isSecurityLevel: createFormatter('securityLevel'),
    /**
     * 列表显示状态过滤，显示规则 锁定优先
     */
    isStatusFormatter(isLocked, isEnabled) {
      return isLocked ? '锁定' : this.isEnable.find(item => item.value === isEnabled).text;
    },
    createUser() {
      console.log(1);
      this.dialog.isShowEdit = true;
    },
  },
  watch: {
    organizationId() {
      this.getUserListByOption();
    },
  },
};
</script>
<style lang="scss" scoped>
@mixin hrBox {
  padding-bottom: 15px;
  margin-bottom: 15px;
  border-bottom: 1px solid #e9e9ee;
}
.select-user-search-bar {
  @include hrBox;
}
.t-header {
  .btns-container {
    @include hrBox;
  }
}
</style>
