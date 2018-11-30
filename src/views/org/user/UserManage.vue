<!-- 账号管理页面 -->
<template>
  <div>
    <el-tabs type="border-card" @tab-click="changeTab">
      <el-tab-pane
        v-for="item in organizationType"
        :key="item.id"
        :label="item.typename"
        :code="item.code"
        v-if="organizationType.length > 1"
      ></el-tab-pane>

      <el-row :gutter="30">
        <el-col :span="4">
          <div class="select-user-search-bar">
            <el-input
              v-model="tree.keyword"
              placeholder="输入关键词"
              style="width: 70%"
              size="mini"
              @keydown.13.native="getTree"
            ></el-input>
            <el-button type="primary" style="float: right;" size="mini " @click="getTree">查询</el-button>
          </div>
          <div class="select-user-tree">
            <!-- 懒加载加载 不能使 v-IF -->
            <el-tree
              v-show="tree.isLazy"
              lazy
              :load="loadTreeChild"
              highlight-current
              v-if="organizationType.length"
              :props="tree.defaultProps"
              @node-click="treeNodeClick"
              node-key="id"
              v-loading="treeLoading"
              ref="userLazyTree"
            ></el-tree>

            <!-- 全加载 -->
            <el-tree
              v-show="!tree.isLazy"
              :data="tree.searchTreeData"
              :props="tree.defaultProps"
              default-expand-all
              highlight-current
              v-loading="treeLoading"
              @node-click="treeNodeClick"
            ></el-tree>
          </div>
        </el-col>

        <el-col :span="20">
          <div class="t-header">
            <div class="btns-container">
              <el-button size="mini" @click="addUser" :disabled="!organizationId">新增</el-button>

              <el-dropdown
                trigger="click"
                style="margin-left: 10px;"
                @command="updateMore"
                v-if="curUser.length > 1"
              >
                <span class="el-dropdown-link">
                  <el-button size="mini">
                    批量操作
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="1">启用</el-dropdown-item>
                  <el-dropdown-item command="2">禁用</el-dropdown-item>
                  <el-dropdown-item command="3">解锁</el-dropdown-item>
                  <el-dropdown-item command="5">账号迁移</el-dropdown-item>
                  <el-dropdown-item command="6" v-if="isDevlopment">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>

              <el-dropdown
                trigger="click"
                @command="setUp"
                style="margin-left: 10px;"
                v-if="isAdmin"
              >
                <span class="el-dropdown-link">
                  <el-button size="mini">
                    设置
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <!-- <el-dropdown-item command='1'>账号锁定规则</el-dropdown-item> -->
                  <el-dropdown-item command="2">密码强度规则</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <!-- 操作框 END -->
            <el-form :inline="true" :model="userForm" size="mini">
              <el-form-item label="姓名">
                <el-input v-model="userForm.realName" placeholder="姓名"></el-input>
              </el-form-item>

              <el-form-item label="账号">
                <el-input v-model="userForm.userName" placeholder="账号"></el-input>
              </el-form-item>

              <el-form-item label="类型">
                <el-select v-model="userForm.status" placeholder="类型">
                  <el-option
                    v-for="item in userStatus"
                    :key="item.id"
                    :label="item.tit"
                    :value="item.value"
                  ></el-option>
                  <el-option label="锁定" value="locked"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" @click="getUserListByOption(false)">查询</el-button>
                <el-button @click="getUserListByOption(true)">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!-- 条件查询框 END -->
          <div class="user-list-table-container">
            <div class="user-list-table">
              <el-table
                ref="userListTable"
                :data="userList"
                style="width: 100%;"
                max-height="550"
                stripe
                @selection-change="tableSelectChange"
                v-loading="loading"
              >
                <el-table-column type="selection" width="55">
                  <!-- 复选框-->
                </el-table-column>
                <el-table-column type="index" width="55" label="序号"></el-table-column>
                <el-table-column label="姓名" property="realName"></el-table-column>
                <el-table-column label="账号" property="username"></el-table-column>
                <el-table-column label="密级" property="securityLevel" :formatter="isSecurityLevel"></el-table-column>
                <el-table-column label="状态">
                  <template slot-scope="scope">
                    <!-- 显示规则：锁定有先 -->
                    {{isStatusFormatter(scope.row.isLocked,scope.row.isEnabled)}}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope" @click="curUser = scope.row">
                    <el-button type="text" @click="seeUser(scope)">查看</el-button>
                    <el-button type="text" @click="updateUser(scope)">编辑</el-button>

                    <el-dropdown trigger="click" style="margin: 0 10px;" @command="updateRow">
                      <a
                        href="javascript: void(0)"
                        class="el-dropdown-link el-button--text"
                        @click="curUser = scope.row"
                      >
                        更多
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </a>
                      <el-dropdown-menu slot="dropdown">
                        <!-- command 属性不能修改，固定写法 -->
                        <!--isEnabled: false 禁用 isEnabled： true 启用   isLocked：true 锁定 false 未锁定-->
                        <el-dropdown-item
                          command="1"
                          v-if="scope.row.isEnabled == false && scope.row.isLocked != true"
                        >启用</el-dropdown-item>
                        <el-dropdown-item
                          command="2"
                          v-if="scope.row.isEnabled == true && scope.row.isLocked != true"
                        >禁用</el-dropdown-item>
                        <el-dropdown-item command="3" v-if="scope.row.isLocked == true">解锁</el-dropdown-item>
                        <el-dropdown-item command="4">重置密码</el-dropdown-item>
                        <el-dropdown-item command="5">账号迁移</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!-- 用户列表 END -->
            <div class="pagination-contianer">
              <el-pagination
                @size-change="pageSizeChange"
                @current-change="curPageChange"
                :current-page="page.current"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="page.total"
                style="float: right; padding-top: 15px;"
              ></el-pagination>
            </div>
            <!-- 分页信息 -->
          </div>
        </el-col>
      </el-row>
    </el-tabs>
    <!-- tab end -->
    <!-- <LockRuleConfig v-if='dialogMsg.lockRule' @close='dialogMsg.lockRule = false'/> -->
    <!-- 锁定用户弹框 END 保存成功后刷新列表 -->
    <UserEdit
      :id="curUser.id"
      @save="getUserListByOption"
      @close="dialogMsg.userEdit = false"
      :rootName="activeDeptName"
      v-if="dialogMsg.userEdit"
    />
    <!-- 修改用户信息 弹框 END -->
    <UserView v-if="dialogMsg.userView" :id="seeCurUser.id" @close="dialogMsg.userView = false"/>
    <!-- 查看用户信息 END -->
    <PasswordRuleConfig
      v-if="dialogMsg.passwordRuleConfig"
      @close="dialogMsg.passwordRuleConfig = false"
    />
    <!-- 密码强度规则编辑页面 END -->
    <SelectDept
      :multiple="false"
      v-if="dialogMsg.selectDept"
      :rootCode="activeTab"
      @close="dialogMsg.selectDept = false"
      @select="moveUser2Dept"
    />
  </div>
</template>

<script>
import UserApi from '@/api/user'; // 用户管理接口
import DeptApi from '@/api/dept'; // 组织机构管理接口
import { getCodeTable, createFormatter } from '@/libs/codeTable';
import * as authApi from '@/api/auth.user';
import * as Utils from '@/libs/utils';
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
      loading: false,
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
      organizationType: [], // 组织机构类型
      activeTab: '', // 当前选中Tab
      activeDeptName: '', // 18/11/12 保存当前选项卡名称，编辑时传入只组件
      userForm: {},
      page: {
        // 分页信息
        current: 0,
        pageSize: 0,
        total: 0,
      },
      isEnable: getCodeTable('isEnable'),
      userStatus: [{ id: 1, tit: '启用', value: true }, { id: 2, tit: '禁用', value: false }],
      userList: [],
      organizationId: null, // 机构ID
      dialogMsg: {
        // 管理弹出框状态
        lockRule: false,
        userEdit: false,
        userView: false,
        passwordRuleConfig: false,
        selectDept: false,
      },
      curUser: '', // 当前选中用户
      seeCurUser: '', // 保存查看用户选中用户，与修改、新增不同数据对象。避免不能正确触发子组件 watch 方法
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
      return authApi
        .judgeIsAdmin()
        .then(isAdmin => {
          this.isAdmin = isAdmin;
          return isAdmin;
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
        });
    },
    /**
     * 获取组织机构类型
     */
    getOrganizationType() {
      DeptApi.getDeptType()
        .then(res => {
          this.organizationType = res;
          this.activeTab = res[0].code;

          this.getTree();
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
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
     * 全加载tree 点击节点
     */
    treeNodeClick(node) {
      this.userForm = {};
      this.organizationId = node.code; // 触发 watch
      this.activeDeptName = node.name;
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
    /**
     * 切换组织机构时重新渲染懒加载树
     */
    reloadLazyTree() {
      this.treeLoading = true;
      DeptApi.getLazyTree(this.activeTab, -1)
        .then(res => {
          const children = this.$refs.userLazyTree.root.childNodes;
          children.splice(0, children.length);
          this.$refs.userLazyTree.root.doCreateChildren(res);
          if (res.length) {
            this.$refs.userLazyTree.setCurrentKey(res[0].id);
            this.organizationId = res[0].code;
          } else {
            this.userList = [];
          }
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.treeLoading = false;
        });
    },

    /**
     * 新增用户
     */
    addUser() {
      this.curUser = {};
      this.dialogMsg.userEdit = true;
    },
    /**
     * 查看用户信息
     */
    seeUser(scope) {
      this.seeCurUser = scope.row;
      this.dialogMsg.userView = true;
    },
    /**
     * 修改用户信息
     */
    updateUser(scope) {
      if (this.curUser.id !== scope.row.id) {
        this.curUser = scope.row;
      }
      this.dialogMsg.userEdit = true;
    },
    /**
     * tabs 组件点击时触发,重新加载Tree，显示懒加载树
     */
    changeTab(tab) {
      this.tree.keyword = '';
      this.activeTab = tab.$attrs.code;
      this.reloadLazyTree();
      this.tree.searchTreeData = [];
      this.isLazy = true;
      this.activeDeptName = tab.label;
    },
    /**
     * 接收 SelectUser 子组件信息
     */
    getSelect(user) {
      this.organizationId = user;
    },
    /**
     * 表格复选框数据改变是获取
     */
    tableSelectChange(list) {
      this.curUser = list;
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
     * 密级过滤，使用码表方法
     */
    isSecurityLevel: createFormatter('securityLevel'),

    /**
     * 列表显示状态过滤，显示规则 锁定有先
     */
    isStatusFormatter(isLocked, isEnabled) {
      return isLocked ? '锁定' : this.isEnable.find(item => item.value === isEnabled).text;
    },
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
          this.dialogMsg.passwordRuleConfig = true;
          break;
        default:
      }
    },

    /**
     * updateRow
     * @param eventType 1：启用 2：禁用 3：解锁 4：重置密码 5：账号迁移
     */
    updateRow(eventType) {
      switch (parseInt(eventType, 10)) {
        case 1:
          this.disableUser('enable', [this.curUser.id], [this.curUser]);
          break;
        case 2:
          this.disableUser('disable', [this.curUser.id], [this.curUser]);
          break;
        case 3:
          this.unlockUser([this.curUser.id], [this.curUser]);
          break;
        case 4:
          this.resetPwd([this.curUser.id]);
          break;
        case 5:
          this.moveUser([this.curUser.id], [this.curUser]);
          break;
        default:
      }
    },
    /**
     * 批量操作时，按照状态过滤
     * @param type 1：启用 2：禁用 3：解锁  5：账号迁移 6: 删除
     * @returns 选中的 ID列表
     */
    filterSelectOptionByType(type) {
      // ids 选中ID
      // curArr 选中项，保存成功后使用
      const [idsArr, curArr] = [[], []];

      if (this.curUser.length) {
        this.curUser.forEach(item => {
          switch (parseInt(type, 10)) {
            case 1: // 只添加 状态为禁用的选项
              if (item.isEnabled === false && item.isLocked !== true) {
                idsArr.push(item.id);
                curArr.push(item);
              }
              break;
            case 2: // 只添加状态为启用的选项
              if (item.isEnabled === true && item.isLocked !== true) {
                idsArr.push(item.id);
                curArr.push(item);
              }
              break;
            case 3: // 只添加状态为锁定的选项
              if (item.isLocked === true) {
                idsArr.push(item.id);
                curArr.push(item);
              }
              break;
            default:
              idsArr.push(item.id);
              curArr.push(item);
          }
        });
      }

      return {
        idsArr,
        curArr,
      };
    },
    /**
     * 批量操作
     * @param eventType 1：启用 2：禁用 3：解锁  5：账号迁移 6: 删除功能
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

      switch (parseInt(eventType, 10)) {
        case 1:
          this.disableUser('enable', idsArr, filterList.curArr);
          break;
        case 2:
          this.disableUser('disable', idsArr, filterList.curArr);
          break;
        case 3:
          this.unlockUser(idsArr, filterList.curArr);
          break;
        case 5:
          this.moveUser(idsArr, filterList.curArr);
          break;
        case 6:
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
      this.$confirm('确定删除已选项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        UserApi.deleteUser(idsArr)
          .then(() => {
            this.removeUsers(idsArr);

            this.$message({
              message: '删除成功',
              type: 'success',
            });
            // 本页全删除后，重新获取列表
            if (this.userList.length === 0) {
              this.getUserListByOption();
            }
          })
          .catch(this.$errorHandler)
          .finally(() => {
            this.loading = false;
          });
      });
    },
    /**
     * 启动或禁用
     * @param {string} upfateType 判断 enable: 启用 disable：禁用
     * @param {array} ids 选中项ID集合
     * @param {array} curList 选中项
     */
    disableUser(disableType, ids, curList) {
      const status = disableType === 'enable' ? 'Y' : 'N';
      UserApi.disableUser(ids, status)
        .then(() => {
          /**
           * 更新视图
           */
          curList.forEach(item => {
            item.isEnabled = status === 'Y';
          });

          this.$message({
            message: '操作成功',
            type: 'success',
          });
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
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
          UserApi.lockUser(ids, 'N').then(() => {
            curList.forEach(item => {
              item.isLocked = false;
            });
            this.$message({
              message: '修改成功',
              type: 'success',
            });
          });
        })
        .catch(() => {});
    },
    // 重置密码
    resetPwd(ids) {
      this.$confirm('是否重置该用户密码?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          UserApi.resetPwd(ids)
            .then(() => {
              this.$message({
                message: '重置成功',
                type: 'success',
              });
            })
            .catch(this.$errorHandler);
        })
        .catch(() => {});
    },
    /**
     * 获取目标组织机构
     */
    moveUser2Dept(secectDeptMsg) {
      UserApi.moveUsers(this.moveUsersMsg.ids, secectDeptMsg.code)
        .then(() => {
          this.removeUsers(this.moveUsersMsg.ids);

          if (this.userList.length === 0) this.getUserListByOption(true);
          this.$message({
            message: '迁移成功',
            type: 'success',
          });
        })
        .catch(this.$errorHandler);
    },
    // 账号迁移
    moveUser(ids, curList) {
      this.dialogMsg.selectDept = true;
      this.moveUsersMsg = {
        ids,
        curList,
      };
    },

    /**
     * 编辑 !刷新列表
     */
    editUser(userMsg) {
      if (this.curUser.id) {
        this.curUser = Object.assign(this.curUser, userMsg);
      } else {
        this.userList.unshift(userMsg);
        this.page.total += 1;
      }
    },
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

  watch: {
    organizationId() {
      this.getUserListByOption();
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
