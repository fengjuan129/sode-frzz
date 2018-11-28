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
        <template slot-scope='scope'>
          <span v-if="index === 0 ? true : false" v-for="(space, levelIndex) in scope.row.level" class="ms-tree-space" :key='levelIndex'></span>
          <span class="button is-outlined is-primary is-small" v-if="toggleIconShow(index,scope.row)">
            <i v-if="!scope.row.expanded" class="el-icon-arrow-right t-icon" aria-hidden="true"></i>
            <i v-if="scope.row.expanded" class="el-icon-arrow-down t-icon" aria-hidden="true"></i>
          </span>

          <span v-else-if="index === 0" class="ms-tree-space"></span>

          <span v-if='col.key == "isEnable" && scope.row.id !== -1'>
            <i :class='scope.row[col.key] ?
                "fs-20 success el-icon-circle-check" : "fs-20 danger el-icon-circle-close"'>
            </i>
          </span>

          <span>{{formatColumn(scope.row,col.key)}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" >
        <template slot-scope='scope' class='t-btns-container'>
          <el-button type='text' @click.stop='editMenu("new",scope.row)'>新增菜单</el-button>
          <el-button type='text' @click.stop='editMenu("update",scope.row)' v-if='scope.$index > 0'>编辑</el-button>
          <el-button type='text' @click.stop='delMenu(scope.row,scope.$index)' v-if='scope.$index > 0'>删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- components -->
    <MenuEdit v-if='dialogs.menuEdit'
      :parentMenu='catchData.curMenu.id'
      :menu='catchData.curMenu.menu'
      @close='dialogs.menuEdit = false'
      @save='subMenu'/>
  </div>
</template>

<script>
import { getMenuTree, setMenu, deleteMenu } from '@/api/res'; // 接口
import Dic from '@/api/mockDictionary'; // 假数据字典
import { data2treeGridArr } from '@/libs/utils';
import MenuEdit from './MenuEdit.vue';

export default {
  name: 'MenuManage',
  data() {
    return {
      columns: [
        { text: '菜单名称', key: 'name', width: 200 },
        { text: '菜单类型', key: 'menuType' },
        { text: '授权方式', key: 'authType' },
        { text: '菜单路径', key: 'url', width: 200 },
        { text: '图标', key: 'imagePath', width: 50, align: 'center' },
        { text: '是否启用', key: 'isEnable', width: 80, align: 'center' },
        { text: '是否显示', key: 'isVisible' },
        { text: '排序', key: 'sort', width: 50, align: 'center' },
      ],
      // 功能菜单为虚根节点
      menuList: [{ id: -1, name: '功能菜单', expanded: true }],
      // 弹框管理
      dialogs: {
        menuEdit: false,
      },
      // 缓存数据
      catchData: {
        // 保存选中行信息
        curMenu: {
          id: '',
          menu: {},
        },
      },
      isEnable: Dic.isEnable, // TODO 是否启用为数据字典
      isVisible: Dic.isVisible, // TODO 是否可见为数据字典
      authType: Dic.authType, // TODO 授权方式为数据字典
      menuType: Dic.menuType, // TODO 菜单类型为数据字典
    };
  },

  components: {
    MenuEdit,
  },

  computed: {
    treeData() {
      return data2treeGridArr(this.menuList, 'id', 'parentId', false);
    },
  },
  mounted() {
    getMenuTree()
      .then(res => {
        this.menuList = [...this.menuList, ...res];
      })
      .catch(this.$errorHandler);
  },
  methods: {
    // 控制表格显示、隐藏
    showTr(row) {
      const curRow = row.row;
      const show = curRow.parent ? curRow.parent.expanded && curRow.parent.show : true;
      curRow.show = show;
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
      curRow.expanded = !curRow.expanded;
    },
    // 提交保存
    subMenu(data) {
      setMenu(data.id, data)
        .then(res => {
          const { curMenu } = this.catchData;
          let message = '';
          // 有ID 新增，无 ID 修改
          if (curMenu.id) {
            this.menuList = [...this.menuList, res];
            message = '新增成功';

            this.$nextTick(() => {
              if (data.parent) {
                data.parent.expanded = true;
              }
            });
          } else {
            curMenu.menu = Object.assign(curMenu.menu, res);
            message = '修改成功';
          }

          this.$message({
            message,
            type: 'success',
          });
        })
        .catch(this.$errorHandler);
    },
    // 删除菜单
    delMenu(curRow) {
      this.$confirm('此操作将删除该菜单，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      })
        .then(() => {
          const { children, parent } = curRow;
          deleteMenu(curRow.id)
            .then(() => {
              if (parent && parent.children && parent.children.length) {
                for (let i = 0, len = parent.children.length; i < len; i += 1) {
                  const item = parent.children[i];
                  if (item.id === curRow.id) {
                    parent.children.splice(i, 1);
                    break;
                  }
                }
              }

              if (children && children.length) {
                curRow.children.splice(0, curRow.children.length);
              }
              this.deleteDeptById(curRow.id);

              this.$message({
                message: '删除成功',
                type: 'success',
              });
            })
            .catch(this.$errorHandler);
        })
        .catch(() => {});
    },
    /**
     * 编辑菜单
     * @param {string} type 标明修改或新增 new、update
     * @param {object} curRow 选中行信息
     */
    editMenu(type, curRow) {
      const { curMenu } = this.catchData;

      if (type === 'new') {
        curMenu.id = curRow.id;
        curMenu.menu = {};
      } else if (type === 'update') {
        curMenu.id = '';
        curMenu.menu = curRow;
      }

      this.dialogs.menuEdit = true;
    },
    /**
     * 过滤表格
     */
    formatColumn(row, key) {
      let str = '';
      if (row[key] === undefined) {
        return str;
      }
      switch (key) {
        case 'menuType':
        case 'authType':
        case 'isVisible':
          for (let i = 0, len = this[key].length; i < len; i += 1) {
            if (this[key][i].value === row[key]) {
              str = this[key][i].name;
              break;
            }
          }
          break;
        case 'isEnable':
          str = '';
          break;
        default:
          str = row[key];
      }
      return str;
    },
    deleteDeptById(id, list = this.menuList) {
      for (let i = 0; i < list.length; i += 1) {
        const item = list[i];

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
