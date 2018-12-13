<!-- 账号管理页面 -->
<template>
  <div>
    <el-tabs type="border-card" @tab-click='changeTab' >
      <el-tab-pane v-for='item in organizationType'
        :key='item.id'
        :label="item.typename"
        :code='item.code'
        v-if='organizationType.length > 1&& isAdmin'>
      </el-tab-pane>

      <el-row :gutter="10">
          <el-col :span='4'>
            <div class='select-user-search-bar'>
            <el-input v-model="tree.keyword"
              placeholder="输入关键词"
              style='width: 60%'
              size='mini'
              @keydown.13.native="getTree"></el-input>
            <el-button type='primary' style='float: right;' size='mini ' @click='getTree'>查询</el-button>
          </div>
          <div class='select-user-tree'>
            <!-- 懒加载加载 不能使 v-IF -->
            <el-tree
              v-show='tree.isLazy'
              lazy
              :load='loadTreeChild'
              highlight-current
              v-if='organizationType.length'
              :props="tree.defaultProps"
              @node-click='treeNodeClick'
              @current-change="changeNode"
              node-key='code'
              ref='userLazyTree'>
            </el-tree>

            <!-- 全加载 -->
            <el-tree
              v-show='!tree.isLazy'
              :data='tree.searchTreeData'
              :props="tree.defaultProps"
              default-expand-all
              highlight-current
              @node-click='treeNodeClick'>
            </el-tree>
          </div>
          </el-col>
          <el-col :span='20'>
            <div class='t-header'>
              <!-- 操作框-->
              <div class='btns-container'>
                <el-button size='mini' @click='addUser' :disabled="!organizationId">新增</el-button>
                  <el-dropdown trigger="click" style="margin-left: 10px;" @command='updateMore' v-if='selectUsers.length > 0'>
                    <span class="el-dropdown-link">
                      <el-button size='mini'>批量操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command='enable'>启用</el-dropdown-item>
                      <el-dropdown-item command='disable'>禁用</el-dropdown-item>
                      <!-- <el-dropdown-item command='unlock'>解锁</el-dropdown-item> -->
                      <el-dropdown-item command='accountTransfer'>账号迁移</el-dropdown-item>
                      <el-dropdown-item command='delete' v-if='isDevlopment'>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                  <el-dropdown trigger="click" @command='setUp' style="margin-left: 10px;" v-if='isAdmin'>
                    <span class="el-dropdown-link"><el-button size='mini'>设置<i class="el-icon-arrow-down el-icon--right"></i></el-button></span>
                    <el-dropdown-menu slot="dropdown">
                      <!-- <el-dropdown-item command='1'>账号锁定规则</el-dropdown-item> -->
                      <el-dropdown-item command='2'>密码强度规则</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
              </div>

              <!-- 条件查询框-->
              <el-form :inline="true" :model='userForm' size="mini">
                <el-form-item label='姓名'>
                  <el-input v-model="userForm.realName" placeholder="姓名"></el-input>
                </el-form-item>

                <el-form-item label='账号'>
                  <el-input v-model="userForm.username" placeholder="账号"></el-input>
                </el-form-item>

                <el-form-item label='类型'>
                  <el-select v-model="userForm.status" placeholder="类型">
                    <el-option v-for='item in userStatus' :key='item.value' :label="item.text" :value='item.value'></el-option>
                    <el-option label='锁定' value='locked'></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item>
                  <el-button type='primary' @click='getUserListByOption(false)'>查询</el-button>
                  <el-button @click='getUserListByOption(true)'>重置</el-button>
                </el-form-item>
              </el-form>
            </div>

             <!-- 用户列表-->
            <div class="user-list-table-container">
              <div class="user-list-table">
                <el-table ref='userListTable' :data='userList' style='width: 100%;' highlight-current-row stripe @selection-change='tableSelectChange'>
                  <el-table-column type="selection" width="55"><!-- 复选框--></el-table-column>
                  <el-table-column type='index' width="55" label="序号"></el-table-column>
                  <el-table-column label="姓名" property='realName'></el-table-column>
                  <el-table-column label='账号' property='username'></el-table-column>
                  <el-table-column label="密级" property='securityLevel' :formatter="filterSecretLev"></el-table-column>
                  <el-table-column label="状态">
                    <template slot-scope="scope">
                        <!-- 显示规则：锁定有先 -->
                        <span>{{ scope.row.isLocked ? '锁定' :
                                  scope.row.isEnabled? '启用': '禁用'}}
                        </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" width="200">
                    <template slot-scope="scope" @click='selectUsers = scope.row'>
                      <el-button type='text' @click='seeUser(scope)'>查看</el-button>
                      <el-button type='text' @click='updateUser(scope)'>编辑</el-button>

                      <el-dropdown trigger="click" style='margin: 0 10px;' @command='updateRow'>
                        <a href="javascript: void(0)" class="el-dropdown-link el-button--text" @click='selectUsers = scope.row'>
                          更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </a>
                        <el-dropdown-menu slot="dropdown">
                          <!-- command 属性不能修改，固定写法 -->
                          <!--isEnabled: false 禁用 isEnabled： true 启用   isLocked：true 锁定 false 未锁定-->
                          <el-dropdown-item command='enable' v-if='!scope.row.isEnabled && !scope.row.isLocked '>启用</el-dropdown-item>
                          <el-dropdown-item command='disable' v-if='scope.row.isEnabled && !scope.row.isLocked'>禁用</el-dropdown-item>
                          <el-dropdown-item command='unlock' v-if='scope.row.isLocked'>解锁</el-dropdown-item>
                          <el-dropdown-item command='resetPwd'>重置密码</el-dropdown-item>
                          <el-dropdown-item command='accountTransfer'>账号迁移</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>

                    </template>
                  </el-table-column>
                </el-table>
              </div>

               <!-- 分页信息 -->
              <div class="pagination-contianer">
                <el-pagination
                  @size-change="pageSizeChange"
                  @current-change="curPageChange"
                  :current-page="page.current"
                  :page-sizes="[10, 20, 30, 50]"
                  :page-size="page.pageSize"
                  layout="total, sizes, prev, pager, next, jumper"
                  :total="page.total"
                  style='float: right; padding-top: 15px;'>
                </el-pagination>
              </div>

            </div>
          </el-col>
        </el-row>
    </el-tabs>
    <!-- tab end -->
    <!-- 修改用户信息 弹框  -->
    <UserEdit
      v-if='winEdit.userEdit'
      @save='getUserListByOption'
      @close='winEdit.userEdit = false'
      :rootName='activeTabName'
      :user='winEdit.userData'
      />

    <!-- 查看用户信息  -->
    <UserView
      v-if='winView.userView'
      :user='winView.seeselectUsers'
      @close='winView.userView = false'
      />

    <!-- 密码强度规则编辑页面 -->
    <PasswordRuleConfig
      v-if='winPasswordRule.passwordRuleConfig'
       @close='winPasswordRule.passwordRuleConfig = false'
    />

    <!-- 部门选择界面 -->
    <SelectDept :multiple='false'
      v-if='winSelectDept.selectDept'
      :rootCode='activeTab'
      @close='winSelectDept.selectDept = false'
      @select="moveUser2Dept"/>
  </div>
</template>

<script>
import * as UserApi from '@/api/user'; // 用户管理接口
import * as DeptApi from '@/api/dept'; // 组织机构管理接口
import * as authApi from '@/api/auth.user';
import * as Utils from '@/libs/utils';
import { getCodeTable, createFormatter } from '@/libs/codeTable';
import SelectDept from '@/components/SelectDept';
import LockRuleConfig from './LockRuleConfig.vue';
import UserEdit from './UserEdit.vue';
import UserView from './UserView.vue';
import PasswordRuleConfig from './PasswordRuleConfig.vue';

export default {
  name: 'UserManage',
  data() {
    return {
      isDevlopment: process.env.NODE_ENV === 'development', // 是否为开发环境
      tree: {
        keyword: '',
        isLazy: false, // 控制显示 Tree
        searchTreeData: [], // 树的查询条件
        defaultProps: {
          children: 'children',
          label: 'name',
        },
      },
      organizationType: [], // 组织机构类型
      organizationId: null, // 机构ID
      activeTab: '', // 当前选中Tab
      activeTabName: '', // 18/11/12 保存当前选项卡名称，编辑时传入只组件
      page: {
        // 分页信息
        current: 0,
        pageSize: 0,
        total: 0,
      },
      userForm: {}, // 查询框数据
      userList: [], // 账号列表
      userStatus: getCodeTable('isEnable'), // 启用禁用数据字典
      secretLev: getCodeTable('securityLevel'), // 密级数据字典
      dialogMsg: {
        // 管理弹出框状态
        lockRule: false,
      },
      /**
       * 编辑窗口相关配置及数据
       */
      winEdit: {
        userEdit: false,
        userData: {}, // 传给编辑界面的数据
      },
      /**
       * 查询窗口相关配置及数据
       */
      winView: {
        userView: false,
        seeselectUsers: {}, // 传给查看界面的用户信息
      },
      /**
       * 密码规则窗口相关配置及数据
       */
      winPasswordRule: {
        passwordRuleConfig: false,
      },
      /**
       * 部门选择窗口相关配置及数据
       */
      winSelectDept: {
        selectDept: false,
      },
      selectUsers: {}, // 当前选中的用户
      testLazyTree: 1,
      moveUsersMsg: {}, // 保存
      isAdmin: false, // 是否为运维管理员
    };
  },

  components: {
    SelectDept,
    LockRuleConfig,
    UserEdit,
    UserView,
    PasswordRuleConfig,
  },

  mounted() {
    this.judgeIsAdmin();
    this.getOrganizationType();
  },

  methods: {
    /**
     * 判断当前登录人员是否为运维管理员
     */
    judgeIsAdmin() {
      return authApi.judgeIsAdmin().then(isAdmin => {
        this.isAdmin = isAdmin;
        return isAdmin;
      });
    },
    /**
     * 获取组织机构类型
     */
    getOrganizationType() {
      DeptApi.getDeptTypes().then(res => {
        this.organizationType = res;
        this.activeTab = res[0].code;
        this.activeTabName = res[0].typename;

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
        DeptApi.getTreeByKeyword(tree.keyword, this.activeTab).then(res => {
          tree.searchTreeData = Utils.data2treeArr(res);
          if (tree.searchTreeData.length === 0) return;
          this.$refs.userLazyTree.setCurrentKey(tree.searchTreeData[0].code);
          this.getUserListByOption();
          this.organizationId = tree.searchTreeData[0].code;
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
      DeptApi.getLazyTree(this.activeTab, -1, true).then(res => {
        resolve(res);
        if (res.length === 0) return;
        this.$refs.userLazyTree.setCurrentKey(res[0].code);
        this.getUserListByOption();
        this.organizationId = res[0].code;
      });
    },
    /**
     * 加载子节点
     */
    getLeaf(node, resolve) {
      DeptApi.getLazyTree(this.activeTab, node.data.code, true).then(res => {
        resolve(res);
      });
    },

    /**
     * 全加载tree 点击节点
     */
    treeNodeClick(node) {
      this.userForm = {};
      this.organizationId = node.code; // 触发 watch
    },
    /**
     * 组织机构节点选中事件
     */
    changeNode() {
      this.getUserListByOption();
    },
    /**
     * 用户列表
     * @param {Boolean} isClear 是否清空搜索项
     * @param {object} page 分页条件
     */
    getUserListByOption(isClear, page = { pageSize: 20, current: 1 }) {
      this.organizationId = this.$refs.userLazyTree.getCurrentKey();
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
      UserApi.loadUserList(
        Object.assign({}, searchOption, { deptCode: this.organizationId }, page)
      ).then(res => {
        this.userList = res.data;
        this.page.current = res.pageIndex;
        this.page.total = res.recordCount;
        this.page.pageSize = res.pageSize;
      });
    },
    /**
     * 切换组织机构时重新渲染懒加载树
     */
    reloadLazyTree() {
      const children = this.$refs.userLazyTree.root.childNodes;
      children.splice(0, children.length);
      DeptApi.getLazyTree(this.activeTab, -1).then(res => {
        this.$refs.userLazyTree.root.doCreateChildren(res);
        if (res.length) {
          this.$refs.userLazyTree.setCurrentKey(res[0].code);
          this.getUserListByOption();
          this.organizationId = res[0].code;
        } else {
          this.userList = [];
          this.page = {
            // 分页信息
            current: 0,
            pageSize: 0,
            total: 0,
          };
        }
      });
    },

    /**
     * 新增用户
     */
    addUser() {
      //  this.winEdit.userData = {};
      this.winEdit.userData = { ...this.getDeptinfoBySelectTree() };
      this.winEdit.userEdit = true;
    },

    /**
     * 查看用户信息
     */
    seeUser(scope) {
      if (scope.row.id) {
        this.winView.seeselectUsers = { ...this.getDeptinfoBySelectTree(), ...scope.row };
        this.winView.userView = true;
      }
    },
    /**
     * 修改用户信息
     */
    updateUser(scope) {
      if (scope.row.id) {
        // this.userData = {};
        this.winEdit.userData = { ...this.getDeptinfoBySelectTree(), ...scope.row };
        this.winEdit.userEdit = true;
      }
    },
    /**
     * 获取组织结构树中选中的部门及其单位信息
     */
    getDeptinfoBySelectTree() {
      const node = this.$refs.userLazyTree.getCurrentNode();
      const { isCorporation, parentCode } = node;
      let org = {};
      if (!isCorporation) {
        org = this.recursionTree(parentCode);
      } else {
        org = { orgCode: node.code, orgName: node.name };
      }
      return {
        ...org,
        deptCode: node.code,
        deptName: node.name,
      };
    },
    /**
     * 通过选中的节点递归寻找单位
     * @param {string} pCode 父节点code
     */
    recursionTree(pCode) {
      const { isCorporation, parentCode, code, name } = this.$refs.userLazyTree.getNode(pCode).data;
      if (!isCorporation) {
        return this.recursionTree(parentCode);
      }
      return { orgCode: code, orgName: name };
    },
    /**
     * tabs 组件点击时触发,重新加载Tree，显示懒加载树
     */
    changeTab(tab) {
      this.organizationId = null;
      this.tree.keyword = '';
      this.activeTab = tab.$attrs.code;
      this.reloadLazyTree();
      this.tree.searchTreeData = [];
      this.isLazy = true;
      this.activeTabName = tab.label;
    },
    /**
     * 表格复选框数据改变是获取
     */
    tableSelectChange(list) {
      this.selectUsers = list;
    },
    /**
     * 分页组件 页数发生变化时
     */
    pageSizeChange(val) {
      this.getUserListByOption(false, {
        pageSize: val,
        current: 1,
      });
    },
    /**
     * 分页组件选中页面时
     */
    curPageChange(val) {
      if (val === this.page.current) return;
      this.getUserListByOption(false, {
        current: val,
        pageSize: this.page.pageSize,
      });
    },
    /**
     * 密级转码
     */
    filterSecretLev: createFormatter('securityLevel'),
    /**
     * 设置
     * @param eventType 1: 账号锁定规则
     */
    setUp(eventType) {
      switch (parseInt(eventType, 10)) {
        case 1:
          this.dialogMsg.lockRule = true;
          break;
        case 2:
          this.winPasswordRule.passwordRuleConfig = true;
          break;
        default:
      }
    },

    /**
     * updateRow
     * @param eventType enable：启用 disable：禁用 unlock：解锁 resetPwd：重置密码 accountTransfer：账号迁移
     */
    updateRow(eventType) {
      switch (eventType) {
        case 'enable':
          this.disableUser('enable', [this.selectUsers.id], [this.selectUsers]);
          break;
        case 'disable':
          this.disableUser('disable', [this.selectUsers.id], [this.selectUsers]);
          break;
        case 'unlock':
          this.unlockUser([this.selectUsers.id], [this.selectUsers]);
          break;
        case 'resetPwd':
          this.resetPwd(this.selectUsers.id);
          break;
        case 'accountTransfer':
          this.moveUser([this.selectUsers.id], [this.selectUsers]);
          break;
        default:
      }
    },
    /**
     * 批量操作时，按照状态过滤
     * @param type enable：启用 disable：禁用 unlock：解锁  accountTransfer：账号迁移 delete: 删除功能
     * @returns 选中的 ID列表
     */
    filterSelectOptionByType(type) {
      // ids 选中ID
      // selectArr 选中项，保存成功后使用
      const [idsArr, selectArr] = [[], []];

      if (this.selectUsers.length) {
        this.selectUsers.forEach(item => {
          switch (parseInt(type, 10)) {
            case 'enable': // 只添加 状态为禁用的选项
              if (item.isEnabled === false && item.isLocked !== true) {
                idsArr.push(item.id);
                selectArr.push(item);
              }
              break;
            case 'disable': // 只添加状态为启用的选项
              if (item.isEnabled === true && item.isLocked !== true) {
                idsArr.push(item.id);
                selectArr.push(item);
              }
              break;
            case 'unlock': // 只添加状态为锁定的选项
              if (item.isLocked === true) {
                idsArr.push(item.id);
                selectArr.push(item);
              }
              break;
            default:
              idsArr.push(item.id);
              selectArr.push(item);
          }
        });
      }

      return {
        idsArr,
        selectArr,
      };
    },
    /**
     * 批量操作
     * @param eventType enable：启用 disable：禁用 unlock：解锁  accountTransfer：账号迁移 delete: 删除功能
     */
    updateMore(eventType) {
      const filterList = this.filterSelectOptionByType(eventType);
      const { idsArr } = filterList;
      const len = idsArr.length;
      if (!len) {
        this.$message({
          message: '未找到可设置选项,请重新选择',
          type: 'warning',
        });
        return;
      }
      switch (eventType) {
        case 'enable':
          this.disableUser('enable', idsArr, filterList.selectArr);
          break;
        case 'disable':
          this.disableUser('disable', idsArr, filterList.selectArr);
          break;
        case 'unlock':
          this.unlockUser(idsArr, filterList.selectArr);
          break;
        case 'accountTransfer':
          this.moveUser(idsArr, filterList.selectArr);
          break;
        case 'delete':
          this.deleteUser(idsArr);
          break;
        default:
          break;
      }
    },
    /**
     * 删除用户
     * @param {array} idsArr 选中项的ID集合
     */
    deleteUser(idsArr) {
      if (!this.isDevlopment) {
        this.$message.error('如要使用此功能请联系管理员');
        return;
      }
      if (!idsArr.length) return;
      this.$confirm(`确定删除勾选的账号？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          UserApi.deleteUser(idsArr).then(() => {
            this.removeUsers(idsArr);
            this.$message({
              message: '删除成功',
              type: 'success',
            });
            // 本页全删除后，重新获取列表
            if (this.userList.length === 0) {
              this.getUserListByOption();
            }
          });
        })
        .catch();
    },
    /**
     * 启动或禁用
     * @param {string} upfateType 判断 enable: 启用 disable：禁用
     * @param {array} ids 选中项ID集合
     * @param {array} curList 选中项
     */
    disableUser(disableType, ids, curList) {
      const status = disableType === 'enable';
      UserApi.disableUser(ids, status).then(() => {
        /**
         * 更新视图
         */
        curList.forEach(item => {
          item.isEnabled = status === true;
        });

        this.$message({
          message: '操作成功',
          type: 'success',
        });
      });
    },

    // 解锁
    unlockUser(ids, curList) {
      this.$confirm('是否解锁该用户?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          UserApi.lockUser(ids).then(() => {
            curList.forEach(item => {
              item.isLocked = false;
            });
            this.$message({
              message: '解锁成功',
              type: 'success',
            });
          });
        })
        .catch(this.$errorHandler);
    },
    // 重置密码
    resetPwd(ids) {
      this.$confirm('是否重置该用户密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          UserApi.resetPwd(ids).then(() => {
            this.$message({
              message: '重置成功',
              type: 'success',
            });
          });
        })
        .catch(this.$errorHandler);
    },
    /**
     * 获取目标组织机构
     */
    moveUser2Dept(secectDeptMsg) {
      UserApi.moveUsers(this.moveUsersMsg.ids, secectDeptMsg.code).then(() => {
        this.removeUsers(this.moveUsersMsg.ids);

        if (this.userList.length === 0) this.getUserListByOption(true);
        this.$message({
          message: '迁移成功',
          type: 'success',
        });
      });
    },
    // 账号迁移
    moveUser(ids, curList) {
      this.winSelectDept.selectDept = true;
      this.moveUsersMsg = {
        ids,
        curList,
      };
    },

    /**
     * 编辑 !刷新列表
     */
    // editUser(userMsg) {
    //   if (this.selectUsers.id) {
    //     this.selectUsers = Object.assign(this.selectUsers, userMsg);
    //   } else {
    //     this.userList.unshift(userMsg);
    //     this.page.total += 1;
    //   }
    // },
    /**
     * 删除缓存用户
     */
    removeUsers(idsArr, userList = this.userList) {
      idsArr.forEach(item => {
        for (let i = 0; i < userList.length; i += 1) {
          const user = userList[i];

          if (item === user.id) {
            userList.splice(i, 1);
            break;
          }
        }
      });
    },
  },
};
</script>
<style lang='less' scoped>
.t-header {
  .btns-container {
    padding-bottom: 15px;
    margin-bottom: 15px;
    border-bottom: 1px solid #e9e9ee;
  }
}
a.el-dropdown-link {
  text-decoration: none;
}
.select-user-tree {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e9e9e9;
}
</style>
