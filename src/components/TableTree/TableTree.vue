<template>
  <div class="table-box">
    <el-table
      :data="treeData"
      border
      fit
      style="width: 100%"
      :row-style="showTr"
      tooltip-effect="dark"
      class="tree-table"
      ref="treeGrid"
      @cell-dblclick="rowDoubleClick"
      >
        <el-table-column v-for="(column, index) in columns" :key="column.prop" v-bind="column"
           :min-width="firstWidth(index)" show-overflow-tooltip :align="firstAlign(index)">
          <template slot-scope="scope">
              <template v-if="!column.isCustom">
                  <span v-if="spaceIconShow(index)" v-for="(space, levelIndex) in scope.row.level" class="ms-tree-space" :key="levelIndex"></span>
                  <span class="button" v-if="toggleIconShow(column.prop,scope.row)" @click="toggle(scope.$index)">
                    <i v-if="!scope.row.expanded" class="el-icon-caret-right" aria-hidden="true"></i>
                    <i v-if="scope.row.expanded" class="el-icon-caret-bottom" aria-hidden="true"></i>
                  </span>
                  <span v-else-if="index===0" class="ms-tree-space"></span>
              </template>
              <template v-else>
                <slot v-bind= 'scope' :name="column.slotName"></slot>
              </template>
              {{scope.row[column.prop]}}
          </template>
        </el-table-column>

    </el-table>
  </div>
</template>
<script>
import { data2treeGridArr } from '@/libs/utils';

// TODO: 支持懒加载
export default {
  name: 'TableTree',
  props: {
    // 树形列字段
    treeColumn: {
      type: String,
    },
    // 子父关联KEY
    idField: {
      type: String,
      required: true,
    },
    // 子父关联KEY
    parentField: {
      type: String,
      required: true,
    },
    // 双击节点展开收缩
    expandOnDblClick: {
      type: Boolean,
      default: true,
    },
    // 表格列对象
    columns: {
      type: Array,
      default: () => [],
    },
    // 表格数据源
    dataSource: {
      type: Array,
      default: () => [],
    },
    // 第一个节点展开的级数
    expandedLevel: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      treeList: {}, // 对象表格数据
    };
  },
  computed: {
    // 格式化数据源
    treeData() {
      return data2treeGridArr(this.dataSource, this.idField, this.parentField, false);
    },
  },
  created() {
    this.setExpendNumber();
  },
  methods: {
    /**
     * 设置第一个表格树节点展开的级数
     */
    setExpendNumber() {
      if (this.expandedLevel > 0) {
        this.treeData[0].expanded = true;
        this.expandedLevel = this.expandedLevel - 1;
        if (this.expandedLevel > 0) {
          this.treeData.forEach(item => {
            this.treeList[item.id] = item;
          });
          const { children } = this.treeData[0];
          const childIds = children.map(item => item.id);
          this.expandedNode(this.expandedLevel, childIds);
        }
      }
    },
    /**
     *展开节点（递归）
     *params num 还需展开的节点级数 childIds 当前需展开节点的id集合
     */
    expandedNode(num, childIds) {
      const idArr = []; //  当前展开节点的子节点id集合
      num -= 1;
      childIds.forEach(id => {
        this.treeList[id].expanded = true;
        const child = this.treeList[id].children;
        if (num > 0 && child.length > 0) {
          const ids = child.map(item => item.id);
          idArr.push(...ids);
        }
      });
      if (num > 0 && idArr.length > 0) {
        return this.expandedNode(num, idArr);
      }
      return false;
    },
    // 判断是否显示行
    showTr(rows) {
      const { row } = rows;
      const show = row.parent ? row.parent.expanded && row.parent.Show : true;
      row.Show = show;
      return show ? '' : 'display:none;';
    },
    // 展开、收缩下级节点
    toggle(trIndex) {
      console.log(trIndex);
      const record = this.treeData[trIndex];
      record.expanded = !record.expanded;
    },
    // 显示层级关系的空格和图标
    spaceIconShow(index) {
      if (index === 0) {
        return true;
      }
      return false;
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow(treeColumn, record) {
      if (treeColumn === this.treeColumn && record.children && record.children.length > 0) {
        return true;
      }
      return false;
    },
    /**
     * 双击表格行展开收缩表格列中的树
     */
    rowDoubleClick(record) {
      record.expanded = !record.expanded;
    },
    firstWidth(index) {
      if (index === 0) {
        return '200';
      }
      return '100';
    },
    firstAlign(index) {
      if (index === 0) {
        return 'left';
      }
      return 'center';
    },
  },
};
</script>
<style scoped>
.table-box {
  width: 100%;
  height: 100%;
}
.header-box {
  padding: 8px 0;
  margin: 0;
  text-align: center;
  font-weight: bold;
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
.button {
  font-size: 20px;
  cursor: pointer;
}
.firstWidth {
  min-width: 150px;
}
.pd15 {
  padding: 15px;
}
</style>
<style>
.tree-table .el-table__body-wrapper {
  overflow-y: auto;
}
</style>
