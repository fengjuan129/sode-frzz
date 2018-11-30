<!-- 组织机构管理页面 -->
<template>
  <div>
    <el-tabs
      v-model="activeTabCode"
      type="border-card"
      :before-leave="stopTabChange"
      @tab-click="onTabClick"
    >
      <el-tab-pane v-for="item in deptTypeList" :key="item.code" :name="item.code">
        <span slot="label">
          {{item.typename}}
          <i
            class="el-icon-edit button-edit-scale"
            v-show="activeTabCode === item.code"
            @click.stop="winDeptTypeEdit.id = item.id,winDeptTypeEdit.visible = true"
          ></i>
        </span>
      </el-tab-pane>

      <el-tab-pane name="buttonAddDeptType">
        <span slot="label" @click.stop="winDeptTypeEdit.id = '',winDeptTypeEdit.visible = true">
          <i class="el-icon-circle-plus"></i>
        </span>
      </el-tab-pane>
      <!-- tabs END -->
      <div class="btn-container">
        <el-button size="mini" @click="deptEdit">新增</el-button>
      </div>
      <!-- 按钮框 END -->
      <!-- 表格树 -->
      <el-table
        :data="treeData"
        border
        style="width: 100%"
        highlight-current-row
        show-overflow-tooltip
        v-loading="loading"
        :row-style="showTr"
        @current-change="onTabCurrentChange"
      >
        <el-table-column
          v-for="(column, index) in columns"
          :key="column.dataIndex"
          :label="column.text"
          :align="column.align"
          :width="column.width"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span
              v-if="spaceIconShow(index)"
              v-for="(space, levelIndex) in scope.row.level"
              class="ms-tree-space"
              :key="levelIndex"
            ></span>
            <span
              class="button is-outlined is-primary is-small"
              @click="loadChildDept(scope.row)"
              v-if="toggleIconShow(index,scope.row)"
            >
              <i
                :class="scope.row.expanded ? 'el-icon-arrow-down t-icon' : 'el-icon-arrow-right t-icon'"
                aria-hidden="true"
              ></i>
            </span>
            <span v-else-if="index === 0" class="ms-tree-space"></span>
            <span
              v-if="column.dataIndex == 'isEnable'"
            >{{scope.row[column.dataIndex] | format('isEnable')}}</span>

            <span v-else>{{scope.row[column.dataIndex]}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="deptEdit(scope.row,scope.$index)">修改</el-button>

            <el-popover style="margin: 0 10px;" placement="top" v-model="scope.row.showDelPopOver">
              <p>确定删除此机构？</p>
              <div style="text-align: right;">
                <el-button size="mini" type="text" @click="scope.row.showDelPopOver = false">取消</el-button>
                <el-button type="primary" size="mini" @click="deleteDept(scope.row)">确定</el-button>
              </div>
              <el-button type="text" slot="reference" v-if="isDevlopment">删除</el-button>
            </el-popover>

            <el-button
              type="text"
              @click.stop="disableDept(!scope.row['isEnable'],scope.row,scope.$index)"
            >{{scope.row["isEnable"] ? '禁用' : '启用'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 表格树 END -->
    </el-tabs>
    <!-- 页面主体 END -->
    <!-- 公共组件 -->
    <dept-type-edit
      :id="winDeptTypeEdit.id"
      v-if="winDeptTypeEdit.visible"
      @close="winDeptTypeEdit.visible = false"
      @save="oneDeptTypeSaved"
      @delete="onDeleteDeptType"
    ></dept-type-edit>
    <!-- 组织机构类型编辑 END -->
    <dept-edit
      v-if="winDeptEdit.visible"
      :id="winDeptEdit.dept.id"
      :parentCode="winDeptEdit.dept.parentCode"
      :parentName="winDeptEdit.dept.parentName"
      :deptTypeCode="activeTabCode"
      @close="winDeptEdit.visible = false"
      @save="onDeptSaved"
    ></dept-edit>
  </div>
</template>

<script>
import DeptApi from '@/api/dept';
import { data2treeGridArr } from '@/libs/utils';
import { format } from '@/libs/codeTable';
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
      loading: false,
      deptTypeList: [], // 保存组织机构列表
      deptList: [], // 组织机构列表
      activeTabCode: '', // 当前选中组织机构类型CODE
      // 表头信息
      columns: [
        {
          text: '名称',
          dataIndex: 'name',
          width: 180,
        },
        {
          text: '编码',
          dataIndex: 'code',
          width: 80,
          align: 'center',
        },
        {
          text: '法人单位',
          dataIndex: 'orgCode',
          width: 180,
        },
        {
          text: '状态',
          dataIndex: 'isEnable',
          width: 100,
          align: 'center',
        },
        {
          text: '备注',
          dataIndex: 'description',
        },
      ],
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
      currentRow: null, // 选中行信息
    };
  },

  filters: {
    format,
  },

  computed: {
    treeData() {
      return data2treeGridArr(this.deptList, 'code', 'parentCode', false);
    },
  },

  created() {
    this.loadDeptType().then(() => {
      this.loadDept(-1); // 加载机构第一级数据
    });
  },

  methods: {
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
    toggleIconShow(index, record) {
      if (index === 0 && (!record.isLoaded || (record.children && record.children.length > 0))) {
        return true;
      }
      return false;
    },

    /**
     * 获取组织机构列表
     */
    loadDeptType() {
      this.loading = true;
      return DeptApi.getDeptType()
        .then(res => {
          // 组织机构 Key 为 name   机构Key 为 typename  添加name属性
          this.deptTypeList = res.map(item => ({
            ...item,
            name: item.typename,
          }));

          this.activeTabCode = res[0].code;
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 阻止添加组织机构类型按钮选中
     * @param {string} activeName 选项卡name
     */
    stopTabChange(activeName) {
      return !(activeName === 'buttonAddDeptType');
    },

    /**
     * 点击标签页事件
     */
    onTabClick() {
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
        this.activeTabCode = deptType.code;
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
        this.activeTabCode = this.deptTypeList[0].code;
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
      this.loading = true;
      return DeptApi.getLazyTree(this.activeTabCode, parentCode)
        .then(res => {
          res = res.map(item => ({
            ...item,
            showDelPopOver: false, // 为每行数据添加是否显示确认删除框的标识
          }));

          // 快速点击  tab 切换时防止数据重复加载
          this.deptList = parentCode === -1 ? res : [...this.deptList, ...res];
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
        });
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
    onTabCurrentChange(curRow) {
      this.currentRow = curRow;
    },

    /**
     * 组织机构编辑
     */
    deptEdit(row) {
      const { winDeptEdit, currentRow } = this;
      winDeptEdit.dept.parentCode = currentRow ? currentRow.code : -1;
      if (row.id) {
        winDeptEdit.dept.parentName = row.parent ? row.parent.name : '';
      } else {
        winDeptEdit.dept.parentName = currentRow ? currentRow.name : '';
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
        if (dept.isEnable !== this.currentRow.isEnable) {
          if (dept.isEnable) {
            this.setParentsState(this.currentRow, true);
          } else {
            this.setChildrensState(this.currentRow.children, false);
          }
        }
        this.currentRow = Object.assign(this.currentRow, dept);
      } else {
        // 当前行没加载过,嗲用接口加载，避免重复数据
        if (this.currentRow && this.currentRow.isLoaded === undefined) {
          this.loadDept(this.currentRow ? this.currentRow.code : -1).then(() => {
            this.currentRow.expanded = true;
            this.currentRow.isLoaded = true;
          });
          return;
        }
        this.$set(dept, 'showDelPopOver', false);
        this.deptList.push(dept);
      }
    },

    /**
     * 删除组织机构
     */
    deleteDept(row) {
      this.loading = true;
      DeptApi.deleteDept(row.id)
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
     * 禁用组织机构
     */
    disableDept(state, row) {
      // TODO: 必须先将组织机构下所有启用账号迁移到新部门，才能禁用该组织机构; 调用接口判断
      // 18/11/12 后端判断，不需要条用接口

      this.$confirm(`是否${state ? '启用' : '禁用'}组织机构?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(
        () => {
          DeptApi.setDeptDisable(row.id, state ? 'Y' : 'N').then(() => {
            if (state) {
              this.setParentsState(row, true);
            } else {
              this.setChildrensState(row.children, false);
            }
            row.isEnable = state;

            this.$message.success(state ? '启用成功' : '禁用成功');
          });
        },
        () => {}
      );
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
.btn-container {
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
table td {
  line-height: 26px;
}
.t-icon {
  cursor: pointer;
}
.button-edit-scale {
  margin-left: 5px;
  display: inline-block;
  opacity: 0.8;
  -webkit-transition: opacity 0.1s;
  -moz-transition: opacity 0.1s;
  -ms-transition: opacity 0.1s;
  -o-transition: opacity 0.1s;
  transition: opacity 0.1s;
  &:hover {
    opacity: 1;
  }
}
</style>
