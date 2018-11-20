<template>
  <div>
    <!-- 组织机构管理 -->
    <el-tabs type="border-card" v-model="tabs.tabActiveCode" id='t-tabs' :before-leave='stopTabChange' @tab-click='tabChange'>
      <el-tab-pane v-for='item in tabs.tabData' :key='item.id' :name='item.code' :data-info='item'>
        <span slot='label'>
          {{item.typename}}
          <i class='el-icon-edit'
            v-show='tabs.tabActiveCode == item.code'
            @click.stop="dialogStatus.deptTypeEdit = true; dialogStatus.deptTypeId = item.id"></i>
        </span>
      </el-tab-pane>
      <el-tab-pane name='addDeptBtn'>
        <span slot='label' @click='dialogStatus.deptTypeEdit = true; dialogStatus.deptTypeId = ""'>
          <i class='el-icon-circle-plus'></i>
        </span>
      </el-tab-pane>
      <!-- tabItem END -->
      <div class='t-toolbar'>
        <el-button size='mini' @click='dialogStatus.deptEdit = true; upDateDeptMsg.id = false'>新增</el-button>
      </div>

      <!-- 表格树 -->
      <el-table
        :data="treeData"
        border
        style="width: 100%"
        highlight-current-row
        @row-click='sendRowData'
        :row-style="showTr">
        <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" :align="column.align" :width='column.width'>
          <template slot-scope="scope">
            <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row.level" class="ms-tree-space" :key='levelIndex'></span>
            <span class="button is-outlined is-primary is-small" v-if="toggleIconShow(index,scope.row)">
              <i v-if="!scope.row.expanded" class="el-icon-arrow-right t-icon" aria-hidden="true"></i>
              <i v-if="scope.row.expanded" class="el-icon-arrow-down t-icon" aria-hidden="true"></i>
            </span>
            <span v-else-if="index === 0" class="ms-tree-space"></span>
            <span v-if='column.dataIndex == "isEnable"'>
              <i :class='scope.row[column.dataIndex] ?
                  "fs-20 success el-icon-circle-check" : "fs-20 danger el-icon-circle-close"'>
              </i>
            </span>
            <span v-else>{{scope.row[column.dataIndex]}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size='mini' @click.stop='deptEdit(scope.row,scope.$index)'>修改</el-button>
            <el-button size='mini' @click.stop="deleteDept(scope.row,scope.$index)">删除</el-button>
            <el-button size='mini'
              @click.stop='disableDept(!scope.row["isEnable"],scope.row,scope.$index)'>{{scope.row["isEnable"] ? '禁用' : '启用'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 表格树 END -->
    </el-tabs>

    <!-- v-if 触发组件生命周期 -->
    <DeptTypeEdit :isOpen='dialogStatus.deptTypeEdit'
      :id='dialogStatus.deptTypeId'
      @close='dialogStatus.deptTypeEdit = false'
      @delete='deleteDeptType'
      @save='editDeptType'
      v-if='dialogStatus.deptTypeEdit'/>
    <!-- 组织机构类型 END -->

    <DeptEdit :isOpen='dialogStatus.deptEdit'
      :id='upDateDeptMsg.id'
      :parentCode='upDateDeptMsg.code'
      :parentName='upDateDeptMsg.name'
      @close='dialogStatus.deptEdit = false'
      @save='editDept'
      v-if='dialogStatus.deptEdit'/>
    <!-- 组织机构编辑 END -->

  </div>
</template>

<script>
import DeptApi from '@/api/dept';
import { data2treeGridArr } from '@/libs/utils';
import DeptTypeEdit from './deptTypeEdit.vue';
import DeptEdit from './deptEdit.vue';

export default {
  data() {
    return {
      defaultExpandAll: false,
      tabs: {
        tabData: [], // 机构类型
        tabActiveCode: '',
        tabActiveInfo: '',
      },
      dialogStatus: {
        deptEdit: false,
        deptTypeEdit: false,
        deptTypeId: '', // 保存修改类型ID
      },
      /**
       * 表头信息
       */
      columns: [
        {
          text: '名称',
          dataIndex: 'name',
          width: 200,
        },
        {
          text: '编码',
          dataIndex: 'code',
          width: 150,
          align: 'center',
        },
        {
          text: '法人单位',
          dataIndex: 'orgCode',
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
      deptList: [],
      upDateDeptMsg: {},
      curRow: '',
    };
  },

  components: {
    DeptTypeEdit,
    DeptEdit,
  },

  computed: {
    treeData() {
      return data2treeGridArr(this.deptList, 'code', 'parentCode', false);
    },
  },

  mounted() {
    this.loadDeptType();
  },

  methods: {
    // 加载组织机构类型
    loadDeptType() {
      DeptApi.getDeptType().then(res => {
        // 组织机构 Key 为 name   机构Key 为 typename  添加name属性
        res.forEach(item => {
          item.name = item.typename;
          item.isRoot = true;
        });

        if (res.length) {
          const firstData = res[0];
          this.tabs.tabData = res;
          this.tabs.tabActiveCode = firstData.code;
          this.tabs.tabActiveInfo = firstData;
          this.upDateDeptMsg = Object.assign({}, firstData);

          // Tree 第一级菜单
          this.loadDeptByParentId(firstData.code, -1);
        }
      });
    },
    /**
     * 加载 tree 数据
     * @param {string} parentCode 父Code
     */
    loadDeptByParentId(typeCode, parentCode) {
      DeptApi.getLazyTree(typeCode, parentCode).then(res => {
        this.deptList = [...this.deptList, ...res];
      });
    },

    /**
     * Tab切换时,点击添加按钮时阻止选中
     */
    stopTabChange(activeName) {
      if (activeName === 'addDeptBtn') return false;
      return true;
    },
    /**
     * tabs 点击事件
     */
    tabChange(tab) {
      if (tab.name === 'addDeptBtn' || tab.name === this.tabs.tabActiveInfo.id) return;
      this.tabs.tabActiveInfo = tab.$attrs['data-info'];
      this.upDateDeptMsg = Object.assign({}, tab.$attrs['data-info']);
      // tab切换时 刷新Tree
      this.deptList = [];
      this.loadDeptByParentId(tab.name, -1);
    },
    /**
     * 添加机构类型
     */
    editDeptType(deptTypeInfo) {
      // 有id 修改,添加无 ID
      if (this.dialogStatus.deptTypeId) {
        for (let i = 0, len = this.tabs.tabData.length; i < len; i += 1) {
          const item = this.tabs.tabData[i];
          if (item.id === deptTypeInfo.id) {
            Object.assign(item, deptTypeInfo);
            break;
          }
        }
      } else {
        deptTypeInfo.name = deptTypeInfo.typename;
        deptTypeInfo.isRoot = true;

        this.tabs.tabData.push(deptTypeInfo);

        this.deptList = []; // 清空 Tree
        this.tabs.tabActiveCode = deptTypeInfo.code; // 选中新增项
        this.upDateDeptMsg = Object.assign({}, deptTypeInfo); // 更新选项卡选中信息
      }
    },
    /**
     * 删除组织机构类型
     */
    deleteDeptType(id) {
      const { tabData } = this.tabs;
      for (let i = 0, len = tabData.length; i < len; i += 1) {
        const item = tabData[i];
        if (item.id === id) {
          tabData.splice(i, 1);
          break;
        }
      }

      this.deptList = []; // 清空 Tree

      /**
       * 删除后重新选中,默认选中第一条
       */
      if (tabData.length) {
        this.tabs.tabActiveCode = tabData[0].code;
        this.loadDeptByParentId(this.tabs.tabActiveCode, -1);
      }
    },

    showTr(row) {
      const curRow = row.row;
      const show = curRow.parent ? curRow.parent.expanded && curRow.parent.show : true;
      curRow.show = show;
      return show
        ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        : 'display:none;';
    },
    // 显示层级关系的空格和图标
    spaceIconShow(index) {
      if (index === 0) {
        return true;
      }
      return false;
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow(index, record) {
      if (index === 0 && (!record.isLoaded || (record.children && record.children.length > 0))) {
        return true;
      }
      return false;
    },
    /**
     * 选中行发生变化时，向父组件发送选中行的数据
     */
    sendRowData(curRow) {
      curRow.expanded = !curRow.expanded;
      this.activeTr = curRow;
      this.upDateDeptMsg = Object.assign({}, curRow);
      if (curRow.isLoaded) return;
      this.loadDeptByParentId(this.tabs.tabActiveCode, curRow.code);
      curRow.isLoaded = true;
    },
    /**
     * 修改组织机构
     */
    deptEdit(row) {
      this.upDateDeptMsg = Object.assign({}, row);
      // 更新  子组件接收参数 parentName
      // this.updateDeptMsg.name = row.parent.name;
      this.dialogStatus.deptEdit = true;
    },
    /**
     * 修改组织机构类型
     */
    updateDeptType() {
      this.dialogStatus.deptTypeEdit = true;
    },
    deleteDept(row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(() => {
          DeptApi.deleteDept(row.id).then(() => {
            const { children, parent } = row;
            /**
             * !删除 Tree 上的引用，dataTranslate.js  根据 item.children 处理数据，删除子类及父级目标子类
             */
            // children && delete row.children;
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

            this.deleteDeptById(row.id);

            this.$message({
              type: 'success',
              message: '删除成功!',
            });
          });
        })
        .catch(() => {});
    },

    /**
     * 编辑组织机构
     */
    editDept(deptInfo) {
      // 后端要求，在根节点添加机构时，parentCode 为 -1
      if (this.upDateDeptMsg.isRoot !== undefined && this.upDateDeptMsg.isRoot) {
        deptInfo.parentCode = -1;
        deptInfo.code = this.upDateDeptMsg.code;
      }
      DeptApi.editDept(deptInfo).then(res => {
        // 有 ID 为修改，无ID 新增
        if (this.upDateDeptMsg.id) {
          Object.assign(this.findDeptById(deptInfo.id, this.treeData), res);
        } else {
          this.$set(this, 'deptList', [res, ...this.deptList]);
        }
      });
    },

    /**
     * 禁用组织机构
     * @param state true 启用  false 禁用
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

            this.$message({
              message: state ? '启用成功' : '禁用成功',
              type: 'success',
            });
          });
        },
        () => {}
      );
    },

    setParentsState(row, state) {
      let parentObj = row.parent;
      while (parentObj) {
        parentObj.isEnable = state;
        parentObj = parentObj.parent;
      }
    },
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
    deleteDeptById(id, list = this.deptList) {
      for (let i = 0; i < list.length; i += 1) {
        const item = list[i];

        if (item.id === id) {
          list.splice(i, 1);
          break;
        }
      }
    },
    /**
     * 根据ID 查询Tree 上数据
     */
    findDeptById(id, list) {
      let target = '';

      for (let i = 0, len = list.length; i < len; i += 1) {
        const item = list[i];
        if (item.id === id) {
          target = item;
          break;
        }

        if (item.children) {
          this.findDeptById(id, item.children);
        }
      }
      return target;
    },
  },

  watch: {},
};
</script>
<style lang='less' scoped>
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
.fs-20 {
  font-size: 20px;
}
.fs-20.success {
  color: #67c23a;
}
.fs-20.danger {
  color: #f56c6c;
}
.t-tooltip-container {
  text-align: right;
}
.t-toolbar {
  padding-bottom: 15px;
}
</style>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
