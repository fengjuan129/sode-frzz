<template>
  <div>

     <!--<tree-grid 
        :columns="columns" 
        :data-source='deptList' 
        @edit='upDateDept'
        @curRow='getCurRow'
        @deleteDept='deleteDept'
        @loadTree='loadDeptByParentId'></tree-grid>-->
      <!-- 表格Tree END -->

    <el-table
      :data="data"
      border
      style="width: 100%"
      highlight-current-row
      @row-click='sendRowData'
      :row-style="showTr">
      <el-table-column v-for="(column, index) in columns" :key="column.dataIndex" :label="column.text" :align="column.align" :width='column.width'>
        <template scope="scope">
          <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space" :key='levelIndex'></span>
          <span class="button is-outlined is-primary is-small" v-if="toggleIconShow(index,scope.row)">
            <i v-if="!scope.row._expanded" class="el-icon-arrow-right t-icon" aria-hidden="true"></i>
            <i v-if="scope.row._expanded" class="el-icon-arrow-down t-icon" aria-hidden="true"></i>
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

      <el-table-column label="操作" v-if="treeType === 'normal'" align="center">
        <template scope="scope">
          <el-button size='mini' @click.stop='deptEdit(scope.row,scope.$index)'>修改</el-button>
          <el-button size='mini' @click.stop="deleteDept(scope.$index,scope.row)">删除 {{scope.$index}}</el-button>
          <el-button size='mini' 
            @click.stop='disableDept(!scope.row["isEnable"],scope.row,scope.$index)'>{{scope.row["isEnable"] ? '禁用' : '启用'}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import DeptApi from '@/api/dept';
import Utils from '../utils/index.js';
//  import Vue from 'vue'
export default {
  name: 'tree-grid',
  props: {
    // 这是相应的字段展示
    columns: {
      type: Array,
      default: function() {
        return [];
      },
    },
    // 这是数据源
    dataSource: {
      type: Array,
      default: function() {
        return [];
      },
    },
    // 这个是是否展示操作列
    treeType: {
      type: String,
      default: function() {
        return 'normal';
      },
    },
    // 是否默认展开所有树
    defaultExpandAll: {
      type: Boolean,
      default: function() {
        return false;
      },
    },
  },
  data() {
    return {
      activeTr: '',
    };
  },
  components: {},
  computed: {
    // 格式化数据源
    data() {
      /**
       * 组装成 Tree 结构
       */
      let list = this.dataSource;
      if (!list.length) return [];

      const [treeMap, returnTree] = [{}, []];

      for (let i = 0, len = list.length; i < len; i += 1) {
        treeMap[list[i].code] = list[i];
      }

      for (let i = 0, len = list.length; i < len; i += 1) {
        if (list[i].isAdd) continue; // 阻止重复添加
        const item = list[i];
        const parent = treeMap[item.parentCode];

        if (parent) {
          (parent.children || (parent.children = [])).push(item);
          item.isAdd = true;
        } else {
          returnTree.push(item);
        }
      }
      return Utils.MSDataTransfer.treeToArray(returnTree, null, null, this.defaultExpandAll);
    },
  },
  methods: {
    // 显示行
    showTr: function(row, index) {
      row = row.row;
      let show = row._parent ? row._parent._expanded && row._parent._show : true;
      row._show = show;
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
    deleteDept(index, row) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'error',
      })
        .then(() => {
          this.deleteChildren(row.children, this.data);
          this.data.splice(index, 1);
          this.$emit('deleteDept', this.data);
          this.$message({
            type: 'success',
            message: '删除成功!',
          });
        })
        .catch(() => {});
    },
    deleteChildren(children, list) {
      if (!children || !children.length) return;
      for (let i = 0, len = children.length; i < len; i++) {
        let childItem = children[i];
        for (let j = 0; j < list.length; j++) {
          let dataItem = list[j];

          if (childItem.pid == dataItem.pid) {
            list.splice(j, 1);
            break;
          }
        }

        if (childItem.children) {
          this.deleteChildren(childItem.children, list);
        }
      }
    },
    /**
     * 选中行发生变化时，向父组件发送选中行的数据
     */
    sendRowData(curRow) {
      curRow._expanded = !curRow._expanded;
      this.activeTr = curRow;
      this.$emit('curRow', curRow);
      if (curRow.isLoaded) return;
      this.$emit('loadTree', curRow.code);
      curRow.isLoaded = true;
    },

    /**
     * 更新组织机构信息
     */
    deptEdit(row, index) {
      this.$emit('edit', row);
    },
    /**
     * 禁用组织机构
     * @param state true 启用  false 禁用
     */
    disableDept(state, row, index) {
      // TODO: 必须先将组织机构下所有启用账号迁移到新部门，才能禁用该组织机构; 调用接口判断

      this.$confirm(`是否${state ? '启用' : '禁用'}组织机构?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          DeptApi.setDeptDisable(row.id, state).then(res => {
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
        })
        .catch(() => {});
    },

    setParentsState(row, state) {
      let parent = row._parent;
      while (parent) {
        parent.isEnable = state;
        parent = parent._parent;
      }
    },
    setChildrensState(list, state) {
      if (!list || !list.length) return;
      for (let i = 0, len = list.length; i < len; i++) {
        let item = list[i];
        item.isEnable = state;

        if (item.children && item.children.length) {
          this.setChildrensState(item.children, state);
        }
      }
    },
  },
};
</script>


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

<style scoped>
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
</style>
