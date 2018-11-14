<!-- 账号管理页面 -->
<template>
  <div>
    <el-tabs type="border-card" @tab-click='changeTab'>
      <el-tab-pane v-for='item in organizationType' 
        :key='item.id' 
        :label="item.typename" 
        :code='item.code'>
      </el-tab-pane>

      <el-row :gutter="30">
          <el-col :span='4'>
            <div class='select-user-search-bar'>
            <el-input v-model="tree.keyword" 
              placeholder="输入关键词" 
              style='width: 70%' 
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
              :props="tree.defaultProps"
              @node-click='treeNodeClick'
              node-key='id'
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

              <div class='btns-container'>
                <el-button size='mini' @click='addUser'>新增</el-button>
                
                  <el-dropdown trigger="click" style="margin: 0 10px;" @command='updateMore'>
                    <span class="el-dropdown-link">
                      <el-button size='mini'>批量操作<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command='1'>启用</el-dropdown-item>
                      <el-dropdown-item command='2'>禁用</el-dropdown-item>
                      <el-dropdown-item command='3'>解锁</el-dropdown-item>
                      <el-dropdown-item command='5'>账号迁移</el-dropdown-item>
                      <el-dropdown-item command='6' v-if='isDevlopment'>删除</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>


                  <el-dropdown trigger="click" @command='setUp'>
                    <span class="el-dropdown-link"><el-button size='mini'>设置<i class="el-icon-arrow-down el-icon--right"></i></el-button></span>
                    <el-dropdown-menu slot="dropdown">
                      <!-- <el-dropdown-item command='1'>账号锁定规则</el-dropdown-item> -->
                      <el-dropdown-item command='2'>密码强度规则</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
              </div>
              <!-- 操作框 END -->
              <el-form :inline="true" :model='userForm' size="mini">
                <el-form-item label='姓名'>
                  <el-input v-model="userForm.realName" placeholder="姓名"></el-input>
                </el-form-item>

                <el-form-item label='账号'>
                  <el-input v-model="userForm.userName" placeholder="账号"></el-input>
                </el-form-item>

                <el-form-item label='类型'>
                  <el-select v-model="userForm.status" placeholder="类型">
                    <el-option v-for='item in userStatus' :key='item.id' :label="item.tit" :value='item.value'></el-option>
                    <el-option label='锁定' value='locked'></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-button type='primary' @click='getUserListByOption(false)'>查询</el-button>
                  <el-button @click='getUserListByOption(true)'>重置</el-button>
                </el-form-item>
              </el-form>
            </div>
            <!-- 条件查询框 END -->

            <div class="user-list-table-container">

              <div class="user-list-table">
                <el-table ref='userListTable' :data='userList' style='width: 100%;' max-height="550" stripe @selection-change='tableSelectChange'>
                  <el-table-column type="selection" width="55"><!-- 复选框--></el-table-column>
                  <el-table-column type='index' width="55" label="序号"></el-table-column>
                  <el-table-column label="姓名" property='realName'></el-table-column>
                  <el-table-column label='账号' property='userName'></el-table-column>
                  <el-table-column label="密级" property='securityLevel' :formatter="filterSecretLev"></el-table-column>
                  <el-table-column label="状态">
                    <template slot-scope="scope">
                        <!-- 显示规则：锁定有先 -->
                        <span>{{ scope.row.isLocked == true ? '锁定' : 
                                  scope.row.isEnabled == true ? '启用': '禁用'}}
                        </span>
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <template slot-scope="scope" @click='curUser = scope.row'>
                      <el-button type='text' @click='seeUser(scope)'>查看</el-button>
                      <el-button type='text' @click='updateUser(scope)'>编辑</el-button>
                      
                      <el-dropdown trigger="click" style='margin: 0 10px;' @command='updateRow'>
                        <a href="javascript: void(0)" class="el-dropdown-link el-button--text" @click='curUser = scope.row'>
                          更多<i class="el-icon-arrow-down el-icon--right"></i>
                        </a>
                        <el-dropdown-menu slot="dropdown">
                          <!-- command 属性不能修改，固定写法 -->
                          <!--isEnabled: false 禁用 isEnabled： true 启用   isLocked：true 锁定 false 未锁定-->
                          <el-dropdown-item command='1' v-if='scope.row.isEnabled == false && scope.row.isLocked != true'>启用</el-dropdown-item>
                          <el-dropdown-item command='2' v-if='scope.row.isEnabled == true && scope.row.isLocked != true'>禁用</el-dropdown-item>
                          <el-dropdown-item command='3' v-if='scope.row.isLocked == true'>解锁</el-dropdown-item>
                          <el-dropdown-item command='4'>重置密码</el-dropdown-item>
                          <el-dropdown-item command='5'>账号迁移</el-dropdown-item>
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
                  style='float: right; padding-top: 15px;'>
                </el-pagination>
              </div>
              <!-- 分页信息 -->
            </div>
          </el-col>
        </el-row>
    </el-tabs>
    <!-- tab end -->
    <LockRuleConfig :isOpen='dialogMsg.lockRule' @close='dialogMsg.lockRule = false'/>
    <!-- 锁定用户弹框 END 保存成功后刷新列表 -->
    <UserEdit :isOpen='dialogMsg.userEdit' 
      :id='curUser.id' 
      @save='getUserListByOption' 
      @close='dialogMsg.userEdit = false' 
      :rootName='activeTabName'
      v-if='dialogMsg.userEdit'/>
    <!-- 修改用户信息 弹框 END -->
    <UserView :isOpen='dialogMsg.userView' :id='seeCurUser.id' @close='dialogMsg.userView = false'/>
    <!-- 查看用户信息 END -->
    <!-- <PasswordRuleConfig :isOpen='dialogMsg.passwordRuleConfig' @close='dialogMsg.passwordRuleConfig = false'/> -->
    <!-- 密码强度规则编辑页面 END -->

    <SelectDept :multiple='false' 
      :isOpen='dialogMsg.selectDept' 
      :rootCode='activeTab' 
      @close='dialogMsg.selectDept = false'
      @select="moveUser2Dept"/>
  </div>
</template>

<script>
import SelectDept from '@/components/SelectDept';
import LockRuleConfig from './lockRuleConfig';
import UserEdit from './userEdit.vue';
import UserView from './userView.vue';
import PasswordRuleConfig from './passwordRuleConfig.vue';
/**
 * 接口列表
 */
import UserApi from '@/api/user.js';
import DeptApi from '@/api/dept.js';
import { setInterval, clearInterval } from 'timers';
export default {
  name: 'UserManage',
  data() {
    return {
      isDevlopment: process.env.NODE_ENV === 'development' ? true : false, // 是否为开发环境
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
      activeTabName: '', // 18/11/12 保存当前选项卡名称，编辑时传入只组件
      userForm: {},
      page: {
        // 分页信息
        current: 0,
        pageSize: 0,
        total: 0,
      },
      // TODO: userType,secretLev 为数据字典
      userStatus: [{ id: 1, tit: '启用', value: true }, { id: 2, tit: '禁用', value: false }],
      secretLev: [
        { id: 1, tit: '公开' },
        { id: 2, tit: '秘密' },
        { id: 3, tit: '绝密' },
        { id: 4, tit: '秘密1' },
        { id: 5, tit: '公开2' },
      ],
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
    this.getOrganizationType();
  },

  methods: {
    /**
     * 获取组织机构类型
     */
    getOrganizationType() {
      DeptApi.getDeptType().then(res => {
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
      let { tree } = this;
      if (tree.keyword) {
        tree.isLazy = false;
        DeptApi.getTreeByKeywork(tree.keyword, this.activeTab).then(res => {
          tree.searchTreeData = this.$store.state.createTerrData(res);
          this.$refs['userLazyTree'].setCurrentKey(tree.searchTreeData[0].id);
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
      let timer = setInterval(() => {
        if (this.activeTab) {
          clearInterval(timer);
          DeptApi.getLazyTree(this.activeTab, -1).then(res => {
            res.forEach(item => {
              /**
               * 懒加载 hasChildren 是否包含子节点，默认有
               */
              item.hasChildren = true;
            });
            resolve(res);
            this.$refs['userLazyTree'].setCurrentKey(res[0].id);
            this.organizationId = res[0].code;
          });
        }
      }, 80);
    },
    /**
     * 加载子节点
     */
    getLeaf(node, resolve) {
      DeptApi.getLazyTree(this.activeTab, node.data.code).then(res => {
        resolve(res);

        return;
        this.testLazyTree += 1; // !测试使用父节点有子节点时，不触发点击事件
        res = this.testLazyTree > 2 ? [] : res;
        /**
         * 如果有返回数据，将其设置为有子节点
         * 没有将当前选中节点 hasChildren = false, 用于点击时判断是否可执行方法，并加载该节点对应的用户列表
         */
        if (res.length) {
          res.forEach(item => {
            item.hasChildren = true; // 将子节点设置默认有子节点
          });
          node.data.hasChildren = true;
          resolve(res);
        } else {
          node.data.hasChildren = false;
          this.organizationId = node.id;
          this.getUserListByOption(true);
          resolve(res);
        }
      });
    },

    /**
     * 全加载tree 点击节点
     */
    treeNodeClick(node) {
      /**
       * !懒加载数据判断是否可加载数据字段 node.hasChildren
       */
      // if (node.children) return;
      this.userForm = {};
      this.organizationId = node.code; // 触发 watch
    },
    /**
     * 用户列表
     * @param {Boolean} isClear 是否清空搜索项
     * @param {object} page 分页条件
     */
    getUserListByOption(isClear, page = { pageSize: 20 }) {
      if (isClear) {
        this.userForm = {};
      } else {
        const { status } = this.userForm;
        if (status !== undefined && status === 'locked') {
          this.userForm.isLocked = true;
          this.userForm.isEnabled && delete this.userForm.isEnabled;
        } else {
          this.userForm.isEnabled = status;
          this.userForm.isLocked && delete this.userForm.isLocked;
        }
      }

      UserApi.loadUserList(
        Object.assign({}, this.userForm, { deptCode: this.organizationId }, page)
      ).then(res => {
        this.userList = res.users;
        this.page.current = res.current;
        this.page.total = res.total;
        this.page.pageSize = res.pageSize;
      });
    },
    /**
     * 切换组织机构时重新渲染懒加载树
     */
    reloadLazyTree() {
      let children = this.$refs.userLazyTree.root.childNodes;
      children.splice(0, children.length);
      DeptApi.getLazyTree(this.activeTab, -1).then(res => {
        this.$refs.userLazyTree.root.doCreateChildren(res);
        if (res.length) {
          this.$refs['userLazyTree'].setCurrentKey(res[0].id);
          this.organizationId = res[0].code;
        } else {
          this.userList = [];
        }
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
      this.curUser.id !== scope.row.id && (this.curUser = scope.row);
      this.dialogMsg.userEdit = true;
    },
    /**
     * tabs 组件点击时触发,重新加载Tree，显示懒加载树
     */
    changeTab(tab, event) {
      this.tree.keyword = '';
      this.activeTab = tab.$attrs.code;
      this.reloadLazyTree();
      this.tree.searchTreeData = [];
      this.isLazy = true;
      this.activeTabName = tab.label;
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
      this.page.pageSize = val;
      this.getUserListByOption();
    },
    /**
     * 分页组件选中页面时
     */
    curPageChange(val) {
      if (val === this.page.current) return;
      this.page.current = val;
      this.getUserListByOption(false, {
        current: val,
        pageSize: this.page.pageSize,
      });
    },

    filterSecretLev(row, column) {
      if (row.securityLevel) {
        return this.secretLev.find(item => {
          return item.id == row.securityLevel;
        })['tit'];
      } else {
        return '';
      }
    },

    /**
     * 设置
     * @param eventType 1: 账号锁定规则
     */
    setUp(eventType) {
      switch (parseInt(eventType)) {
        case 1:
          this.dialogMsg.lockRule = true;
          break;
        case 2:
          this.dialogMsg.passwordRuleConfig = true;
          break;
      }
    },

    /**
     * updateRow
     * @param eventType 1：启用 2：禁用 3：解锁 4：重置密码 5：账号迁移
     */
    updateRow(eventType) {
      switch (parseInt(eventType)) {
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
      }
    },
    /**
     * 批量操作时，按照状态过滤
     * @param type 1：启用 2：禁用 3：解锁  5：账号迁移 6: 删除
     * @returns 选中的 ID列表
     */
    filterSelectOptionByType(type) {
      let idsArr = [], // 选中ID
        curArr = []; // 选中项，保存成功后使用

      this.curUser.length &&
        this.curUser.forEach(item => {
          switch (parseInt(type)) {
            case 1: // 只添加 状态为禁用的选项
              if (item.isEnabled == false && item.isLocked != true) {
                idsArr.push(item.id);
                curArr.push(item);
              }
              break;
            case 2: // 只添加状态为启用的选项
              if (item.isEnabled == true && item.isLocked != true) {
                idsArr.push(item.id);
                curArr.push(item);
              }
              break;
            case 3: // 只添加状态为锁定的选项
              if (item.isLocked == true) {
                idsArr.push(item.id);
                curArr.push(item);
              }
              break;
            default:
              idsArr.push(item.id);
              curArr.push(item);
          }
        });

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

      switch (parseInt(eventType)) {
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
      /**
       * TODO: 调用删除接口
       */
      this.$confirm('确定删除已选项？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          UserApi.deleteUser(idsArr).then(res => {
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
      let status = disableType == 'enable' ? 'Y' : 'N';
      UserApi.disableUser(ids, status).then(res => {
        /**
         * 更新视图
         */
        curList.forEach(item => {
          item.isEnabled = status === 'Y' ? true : false;
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
          UserApi.lockUser(ids, 'N').then(res => {
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
          UserApi.resetPwd(ids).then(res => {
            this.$message({
              message: '重置成功',
              type: 'success',
            });
          });
        })
        .catch(() => {});
    },
    /**
     * 获取目标组织机构
     */
    moveUser2Dept(secectDeptMsg) {
      UserApi.moveUsers(this.moveUsersMsg.ids, secectDeptMsg.code).then(res => {
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
        for (let i = 0; i < userList.length; i++) {
          let user = userList[i];

          if (item == user.id) {
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