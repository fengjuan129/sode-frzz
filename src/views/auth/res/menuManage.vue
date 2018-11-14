<!-- 菜单管页面 -->
<template>
  <div>
    <el-table style='width: 100%' 
      :data='treeData' 
      :row-style="showTr" 
      @row-click='activeRow'
      highlight-current-row 
      border>
      <el-table-column v-for='(col,index) in columns' 
        :key='index'
        :label='col.text'
        :width='col.width'
        :align="col.align || 'left'">
        <template scope='scope'>
          <span v-if="index === 0 ? true : false" v-for="(space, levelIndex) in scope.row._level" class="ms-tree-space" :key='levelIndex'></span>
          <span class="button is-outlined is-primary is-small" v-if="toggleIconShow(index,scope.row)">
            <i v-if="!scope.row._expanded" class="el-icon-arrow-right t-icon" aria-hidden="true"></i>
            <i v-if="scope.row._expanded" class="el-icon-arrow-down t-icon" aria-hidden="true"></i>
          </span>

          <span v-else-if="index === 0" class="ms-tree-space"></span>

          <span v-if='col.key == "isEnable"'>
            <i :class='scope.row[col.key] ? 
                "fs-20 success el-icon-circle-check" : "fs-20 danger el-icon-circle-close"'>
            </i>
          </span>

          <span>{{scope.row[col.key]}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" >
        <template scope='scope' class='t-btns-container'>
          <a href="javascript: void(0)" class='m-5' @click.stop='editMenu("new",scope.row)'>新增菜单</a>
          <a href="javascript: void(0)" class='m-5' @click.stop='editMenu("update",scope.row)' v-if='scope.$index > 0'>编辑</a>
          <a href="javascript: void(0)" class='m-5' @click.stop='delMenu(scope.row,scope.$index)' v-if='scope.$index > 0'>删除</a>
        </template>  
      </el-table-column>
    </el-table>

    <!-- components -->
    <MenuEdit v-if='dialogs.menuEdit' 
      @close='dialogs.menuEdit = false' 
      @save='subMenu'/>
  </div>
</template>

<script>
import { data2treeArr } from '@/libs/utils';
import MenuEdit from './menuEdit.vue';

// 接口
import { getMenuTree, setMenu, deleteMenu } from '@/api/resources.js';
// 假数据字典
import Dic from '@/api/mockDictionary.js';
export default {
  data() {
    return {
      columns: [
        { text: '菜单名称', key: 'name', width: 200 },
        { text: '菜单类型', key: 'menuType' },
        { text: '授权方式', key: 'authType' },
        { text: '菜单路径', key: 'url', width: 200 },
        { text: '图标', key: 'icon', width: 50, align: 'center' },
        { text: '是否启用', key: 'isEnable', width: 80, align: 'center' },
        { text: '是否显示', key: 'isVisible' },
        { text: '排序', key: 'sort', width: 50, align: 'center' },
      ],
      // 功能菜单为虚根节点
      menuList: [
        { id: -1, name: '功能菜单' },
        { id: 1, name: '菜单1', parentId: -1 },
        { id: 2, name: '菜单2', parentId: 1 },
        { id: 6, name: '菜单2', parentId: 2 },
        { id: 3, name: '功能菜单2', parentId: -1 },
        { id: 4, name: '菜单2-1', parentId: 3 },
        { id: 5, name: '菜单2-2', parentId: 3 },
      ],
      // 弹框管理
      dialogs: {
        menuEdit: false,
      },
      // TODO 是否启用为数据字典
      isEnable: Dic['isEnable'],
    };
  },

  components: {
    MenuEdit,
  },

  computed: {
    treeData() {
      return this.tree2treeGirdArr(data2treeArr(this.menuList, 'id', 'parentId'));
    },
  },
  mounted() {},
  methods: {
    /**
     * 将 tree 结构数据转为 treeGird 数据
     */
    tree2treeGirdArr(data, parent, expandedAll = false) {
      let tmp = [];
      Array.from(data).forEach(record => {
        if (record._expanded === undefined) {
          this.$set(record, '_expanded', expandedAll);
        }
        if (parent !== null && parent !== undefined) {
          this.$set(record, '_parent', parent);
          this.$set(record, '_level', parent._level + 1);
        } else {
          this.$set(record, '_level', 0);
        }

        tmp.push(record);

        if (record.children && record.children.length > 0) {
          let children = this.tree2treeGirdArr(record.children, record, expandedAll);
          tmp = [...tmp, ...children];
        }
      });
      return tmp;
    },
    // 控制表格显示、隐藏
    showTr(row, index) {
      row = row.row;
      let show = row._parent ? row._parent._expanded && row._parent._show : true;
      row._show = show;
      return show
        ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        : 'display:none;';
    },
    // 点击展开和关闭的时候，图标的切换
    toggleIconShow(index, record) {
      if (index === 0 && record.children && record.children.length > 0) {
        return true;
      }
      return false;
    },
    // 点击行事件
    activeRow(curRow) {
      curRow._expanded = !curRow._expanded;
    },
    // 提交保存
    subMenu(data) {
      console.log(data);
    },
    // 删除菜单
    delMenu(curRow, index) {
      this.$confirm('此操作将删除该菜单，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          let { children, _parent } = curRow;
          // deleteMenu(curRow.id).then(res => {
          if (_parent && _parent.children && _parent.children.length) {
            for (let i = 0, len = _parent.children.length; i < len; i++) {
              let item = _parent.children[i];
              if (item.id === curRow.id) {
                _parent.children.splice(i, 1);
                break;
              }
            }
          }
          children && delete curRow.children;
          this.deleteDeptById(curRow.id);

          this.$message({
            message: '删除成功',
            type: 'success',
          });
          // })
        })
        .catch(() => {});
    },
    /**
     * 编辑菜单
     * @param {string} type 标明修改或新增
     * @param {object} curRow 选中行信息
     */
    editMenu(type, curRow) {
      this.dialogs.menuEdit = true;
    },

    deleteDeptById(id, list = this.menuList) {
      for (let i = 0; i < list.length; i++) {
        let item = list[i];

        if (item.id === id) {
          list.splice(i, 1);
          break;
        }
      }
    },
  },
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
.m-5 {
  margin: 0 5px;
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