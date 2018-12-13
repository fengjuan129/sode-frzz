<!-- 组织机构管理页面 -->
<template>
  <div>
    <el-tabs v-model="curDeptTypeCode" type="border-card" @tab-click="onTabClick">
      <!-- 组织机构类型标签页（当前账号是运维管理员时才显示） -->
      <template v-if="isAdmin">
        <el-tab-pane v-for="item in deptTypeList" :key="item.code" :name="item.code">
          <span slot="label">
            {{item.typename}}
            <!-- 组织机构类型编辑按钮 -->
            <i
              class="el-icon-edit"
              v-show="curDeptTypeCode === item.code"
              @click.stop="winDeptTypeEdit.id = item.id,winDeptTypeEdit.visible = true"
            ></i>
          </span>
        </el-tab-pane>
      </template>

      <!-- 创建组织机构按钮标签（当前账号是运维管理员时才显示） -->
      <el-tab-pane name="btnAddDeptType" v-if="isAdmin">
        <span slot="label">
          <i class="el-icon-circle-plus" @click.stop="winDeptTypeEdit.visible = true"></i>
        </span>
      </el-tab-pane>

      <!-- 操作按钮栏 -->
      <div class="toolbar">
        <el-button size="mini" @click="editDept">新增</el-button>
      </div>

      <!-- 组织机构表格树 -->
      <el-table
        :data="treeData"
        highlight-current-row
        v-loading="loading"
        :row-style="showTr"
        @current-change="onDeptSelectionChanged"
      >
        <el-table-column prop="name" label="名称">
          <template slot-scope="{ row }">
            <!-- 生成缩进（顶层节点level为0） -->
            <span v-for="(val, key) in row.level" :key="key" class="ms-tree-space"></span>
            <!-- 生成收缩/展开图标 -->
            <span v-if="toggleIconShow(row)" @click="loadChildDept(row)">
              <i :class="row.expanded ? 'el-icon-arrow-down icon' : 'el-icon-arrow-right icon'"></i>
            </span>
            <span :class="toggleIconShow(row) ? 'pl5' : 'pl20'">{{row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="isCorporation" label="法人单位" :formatter="isCorpFormatter" ></el-table-column>
        <el-table-column prop="isEnable" label="状态" :formatter="isEnableFormatter" width="60"></el-table-column>
        <el-table-column prop="sort" label="排序" width="60"></el-table-column>
        <el-table-column prop="description" label="备注"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editDept(scope.row)">编辑</el-button>
            <el-popover
              v-model="scope.row.showEnablePopover"
              style="margin-left: 10px;"
              placement="top"
            >
              <p>确定{{scope.row.isEnable ? '禁用' : '启用'}}此机构？其{{scope.row.isEnable ? '下级' : '上级'}}机构也将一并{{scope.row.isEnable ? '禁用' : '启用'}}</p>
              <div style="text-align: right;">
                <el-button size="mini" type="text" @click="scope.row.showEnablePopover = false">取消</el-button>
                <el-button type="primary" size="mini" @click="toggleDeptState(scope.row)">确定</el-button>
              </div>
              <el-button type="text" slot="reference">{{scope.row.isEnable ? '禁用' : '启用'}}</el-button>
            </el-popover>
            <!-- 开发模式才可执行删除操作 -->
            <el-popover
              v-if="isDevlopment"
              v-model="scope.row.showDelPopOver"
              style="margin-left: 10px;"
              placement="top"
            >
              <p>确定删除此机构？</p>
              <div style="text-align: right;">
                <el-button size="mini" type="text" @click="scope.row.showDelPopOver = false">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteDept(scope.row)">确定</el-button>
              </div>
              <el-button type="text" slot="reference">删除</el-button>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
    </el-tabs>

    <!-- 组织机构类型编辑弹出窗口 -->
    <dept-type-edit
      :id="winDeptTypeEdit.id"
      v-if="winDeptTypeEdit.visible"
      @close="winDeptTypeEdit.visible = false"
      @save="oneDeptTypeSaved"
      @delete="onDeleteDeptType"
    ></dept-type-edit>

    <!-- 组织机构编辑弹出窗口 -->
    <dept-edit
      v-if="winDeptEdit.visible"
      :id="winDeptEdit.dept.id"
      :parentCode="winDeptEdit.dept.parentCode"
      :parentName="winDeptEdit.dept.parentName"
      :deptTypeCode="curDeptTypeCode"
      @close="winDeptEdit.visible = false"
      @save="onDeptSaved"
    ></dept-edit>
  </div>
</template>

<script>
import * as deptApi from '@/api/dept';
import * as authApi from '@/api/auth.user';
import { data2treeGridArr } from '@/libs/utils';
import { createFormatter } from '@/libs/codeTable';
import SelectUser from '@/components/SelectUser';
import DeptTypeEdit from './DeptTypeEdit.vue';
import DeptEdit from './DeptEdit.vue';

export default {
  name: 'DeptManage',

  components: {
    SelectUser,
    DeptTypeEdit,
    DeptEdit,
  },

  data() {
    return {
      isDevlopment: process.env.NODE_ENV === 'development', // 是否为开发环境
      isAdmin: false, // 当前账号是否为运维管理员
      loading: false,
      deptTypeList: [], // 保存组织机构列表
      deptList: [], // 组织机构列表
      curDeptTypeCode: '', // 当前选中组织机构类型CODE
      // 组织机构类型弹框
      winDeptTypeEdit: {
        visible: false, // 编辑窗口是否可见
        id: null, // 传入编辑窗口的机构类型ID
      },
      // 组织机构弹框
      winDeptEdit: {
        visible: false,
        dept: {
          id: '', // 机构id 判断新增修改
          parentCode: '', // 父级Code
          parentName: '', // 父级名称
        },
      },
      currentDept: null, // 选中行信息
    };
  },

  computed: {
    treeData() {
      return data2treeGridArr(this.deptList, 'code', 'parentCode', false);
    },
  },

  created() {
    // 判断当前账号是否是运维管理员
    this.judgeIsAdmin()
      .then(isAdmin => {
        // 如果是运维管理员，先加载组织机构类型，再加载组织机构数据
        if (isAdmin) {
          return this.loadDeptType().then(() => {
            this.loadDept(-1); // 加载机构第一级数据
          });
        }
        // 如果不是运维管理员，直接加载组织机构数据
        return this.loadDept(-1);
      })
      .catch(this.$errorHandler);
  },

  methods: {
    /**
     * 判断当前账号是否为运维管理员
     */
    judgeIsAdmin() {
      return authApi.judgeIsAdmin().then(isAdmin => {
        this.isAdmin = isAdmin;
        return isAdmin;
      });
    },

    /**
     * 是否启用渲染方法
     */
    isEnableFormatter: createFormatter('isEnable'),

    /**
     * 是否为法人单位渲染方法
     */
    isCorpFormatter(row, column, value) {
      return value ? '√' : '';
    },

    /**
     * 控制 tree-grid 层级显示
     */
    showTr(row) {
      const curRow = row.row;
      const show = curRow.parent ? curRow.parent.expanded && curRow.parent.show : true;
      curRow.show = show;
      return show
        ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        : 'display:none;';
    },

    /**
     * 显示层级关系的空格和图标
     */
    spaceIconShow(index) {
      if (index === 0) {
        return true;
      }
      return false;
    },

    /**
     * 点击展开和关闭的时候，图标的切换
     */
    toggleIconShow(record) {
      if (!record.isLoaded || (record.children && record.children.length > 0)) {
        return true;
      }
      return false;
    },

    /**
     * 获取组织机构列表
     */
    loadDeptType() {
      this.loading = true;
      return deptApi
        .getDeptTypes()
        .then(deptTypes => {
          // 组织机构key为name，机构Key为typename，添加name属性用于渲染
          this.deptTypeList = deptTypes.map(dept => ({
            ...dept,
            name: dept.typename,
          }));
          this.curDeptTypeCode = deptTypes.length > 0 ? deptTypes[0].code : '';
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 点击标签页事件
     */
    onTabClick(tab) {
      // 如果点击的是新增标签，不作任何操作
      if (tab.name === 'btnAddDeptType') {
        return;
      }
      this.deptList = [];
      this.loadDept(-1); // 加载机构第一级
    },

    /**
     * 编辑组织机构类型编辑回调方法
     * winDeptTypeEdit.id 有为修改，反之新增
     * @param {object} deptType 组织机构信息
     */
    oneDeptTypeSaved(deptType) {
      if (this.winDeptTypeEdit.id) {
        // eslint 报错？？？？ is assigned a value but never used （no-unused-vars）
        // let activeDept = this.deptTypeList.find(item => item.id === deptType.id);
        // activeDept = Object.assign(activeDept, deptType);
        for (let i = 0, len = this.deptTypeList.length; i < len; i += 1) {
          let item = this.deptTypeList[i];
          if (item.id === deptType.id) {
            item = Object.assign(item, deptType);
            break;
          }
        }
      } else {
        this.deptTypeList.push({ ...deptType });
        this.curDeptTypeCode = deptType.code;
        this.deptList = []; // 新增清空组织机构
      }
      this.winDeptTypeEdit.visible = false;
    },

    /**
     * 删除组织机构类型
     * @param {string} deptTypeId 组织机构类型ID
     */
    onDeleteDeptType(deptTypeId) {
      // 删除组织机构类
      this.deptTypeList = this.deptTypeList.filter(item => item.id !== deptTypeId);
      // 删除后重新先选中
      if (this.deptTypeList.length) {
        this.curDeptTypeCode = this.deptTypeList[0].code;
        this.loadDept(-1);
      } else {
        this.deptList = [];
      }

      this.winDeptTypeEdit.visible = false;
    },

    /**
     * 加载组织机构
     * @param {string} parentCode 父机构Code,根默认为 -1
     */
    loadDept(parentCode) {
      // 如果当前账号为运维管理员且没有选中的组织机构类型（即组织机构类型为空），不执行加载
      if (this.idAdmin && !this.curDeptTypeCode) {
        return Promise.resolve();
      }
      this.loading = true;
      return (
        deptApi
          // 当前账号不是运维管理员时，curDeptTypeCode为空
          .getLazyTree(this.curDeptTypeCode, parentCode)
          .then(res => {
            res = res.map(item => ({
              ...item,
              showDelPopOver: false, // 为每行数据添加是否显示确认删除框的标识
              showEnablePopover: false, // 为每行数据添加是否显示确认修改状态框的标识
            }));
            // 快速点击  tab 切换时防止数据重复加载
            this.deptList = parentCode === -1 ? res : [...this.deptList, ...res];
          })
          .catch(this.$errorHandler)
          .finally(() => {
            this.loading = false;
          })
      );
    },

    /**
     * 加载子组织机构
     * @param {object} row 行信息
     */
    loadChildDept(row) {
      row.expanded = !row.expanded;
      if (row.isLoaded) return;
      this.loadDept(row.code);
      row.isLoaded = true;
    },

    // 选中行发生变化时保存选中行信息
    onDeptSelectionChanged(dept) {
      this.currentDept = dept;
    },

    /**
     * 组织机构编辑
     */
    editDept(row) {
      const { winDeptEdit, currentDept } = this;
      winDeptEdit.dept.parentCode = currentDept ? currentDept.code : -1;
      if (row.id) {
        winDeptEdit.dept.parentName = row.parent ? row.parent.name : '';
      } else {
        winDeptEdit.dept.parentName = currentDept ? currentDept.name : '';
      }
      winDeptEdit.dept.id = row.id || '';
      this.winDeptEdit.visible = true;
    },

    /**
     * 编辑组织机构回调
     */
    onDeptSaved(dept) {
      this.winDeptEdit.visible = false;
      if (this.winDeptEdit.dept.id) {
        // 修改了状态
        if (dept.isEnable !== this.currentDept.isEnable) {
          if (dept.isEnable) {
            this.setParentsState(this.currentDept, true);
          } else {
            this.setChildrensState(this.currentDept.children, false);
          }
        }
        this.currentDept = Object.assign(this.currentDept, dept);
      } else {
        // 当前行没加载过，调用接口加载，避免重复数据
        if (this.currentDept && this.currentDept.isLoaded === undefined) {
          this.loadDept(this.currentDept ? this.currentDept.code : -1).then(() => {
            this.currentDept.expanded = true;
            this.currentDept.isLoaded = true;
          });
          return;
        }
        this.$set(dept, 'showDelPopOver', false);
        this.$set(dept, 'showEnablePopover', false);
        this.deptList.push(dept);
      }
    },

    /**
     * 删除组织机构
     */
    deleteDept(row) {
      this.loading = true;
      deptApi
        .deleteDept(row.id)
        .then(() => {
          const { children, parent } = row;

          if (children && children.length) {
            row.children.splice(0, children.length);
          }

          if (parent && parent.children && parent.children.length) {
            for (let i = 0, len = parent.children.length; i < len; i += 1) {
              const item = parent.children[i];
              if (item.id === row.id) {
                parent.children.splice(i, 1);
                break;
              }
            }
          }
          // 删除原数据
          this.deptList = this.deptList.filter(item => item.id !== row.id);

          this.$message.success('删除成功!');
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 切换组织机构状态
     * @param {object} dept 组织机构对象
     */
    toggleDeptState(dept) {
      // 隐藏确认提示
      dept.showEnablePopover = false;
      // 目标状态
      const state = !dept.isEnable;
      deptApi.setDeptEnable(dept.id, state).then(() => {
        if (state) {
          // 启用子级机构同时启用父级机构
          this.setParentsState(dept, true);
        } else {
          // 禁用父级机构同时禁用子级机构
          this.setChildrensState(dept.children, false);
        }
        // 变更状态显示
        dept.isEnable = state;
        this.$message.success(state ? '启用成功' : '禁用成功');
      });
    },

    /**
     * 设置父节点状态
     */
    setParentsState(row, state) {
      let parentObj = row.parent;
      while (parentObj) {
        parentObj.isEnable = state;
        parentObj = parentObj.parent;
      }
    },
    /**
     * 设置子节点数据
     */
    setChildrensState(list, state) {
      if (!list || !list.length) return;
      for (let i = 0, len = list.length; i < len; i += 1) {
        const item = list[i];
        item.isEnable = state;

        if (item.children && item.children.length) {
          this.setChildrensState(item.children, state);
        }
      }
    },
  },
};
</script>
<style lang='less' scoped>
.toolbar {
  margin-bottom: 15px;
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
.icon {
  width: 15px;
  cursor: pointer;
}
</style>
