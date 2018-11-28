<!-- 选择服务公共页面 -->
<template>
  <el-dialog
    :title="title"
    visible
    width="900px"
    :before-close="close"
    :close-on-click-modal="false"
  >
    <div class="search-bar">
      <el-form :inline="true">
        <el-form-item label="服务名称">
          <el-input v-model.trim="formApi.name" size="mini"></el-input>
        </el-form-item>

        <el-form-item label="服务编码">
          <el-input v-model.trim="formApi.code" size="mini"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="mini" @click="loadApi(false)">查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" @click="loadApi(true)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索框 END -->
    <el-table
      :data="treeData"
      width="100%"
      highlight-current-row
      border
      @row-click="onClickCacheRow"
      v-loading="loading"
      ref="tbaleApi"
    >
      <el-table-column label="服务名称">
        <template slot-scope="scope">
          <span class="ms-tree-space" v-for="(item,index) in scope.row.level" :key="index"></span>
          <el-checkbox
            class="m-5"
            v-if="multiple"
            :indeterminate="scope.row.isIndeterminate"
            v-model="scope.row.isChecked"
            @change="onChangeChecked(scope.row)"
          ></el-checkbox>
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="服务编码" prop="code"></el-table-column>
      <el-table-column label="服务路径" prop="url"></el-table-column>
    </el-table>
    <!-- tree grid end -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sendSelect">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as Utils from '@/libs/utils';
import * as resApi from '@/api/res';

export default {
  name: 'SelectApi',
  props: {
    title: {
      type: String,
      default: '系统服务分配',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    selectedIds: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      loading: false,
      apiList: [],
      formApi: {
        name: '',
        code: '',
      },
      cacheCurRow: {}, // 单选缓存选中行
    };
  },
  computed: {
    defaultSelectMap() {
      const defaultSelectMap = {};

      this.selectedIds.forEach(item => {
        defaultSelectMap[item] = true;
      });

      return defaultSelectMap;
    },
    // 组装树结构
    treeData() {
      const returnTree = Utils.data2treeGridArr(this.apiList, 'id', 'pid', true);

      returnTree.forEach(item => {
        if (item.children && item.children.length) {
          this.$set(item, 'isIndeterminate', false); // 设置父节点办选状态
        }
        this.$set(item, 'isChecked', false);
      });

      // ! 默认选中
      if (this.apiList.length) {
        this.$nextTick(() => {
          if (this.multiple) {
            returnTree.forEach(item => {
              if (this.defaultSelectMap[item.id]) {
                item.isChecked = true;
                this.setChildChecked(item.children, true);
                this.setParentsChecked(item.parent);
              }
            });
          } else if (this.selectedIds.length) {
            const targetRow = returnTree.find(item => !!this.defaultSelectMap[item.id]);
            this.$refs.tbaleApi.setCurrentRow(targetRow);
          }
        });
      }
      return returnTree;
    },
  },

  created() {
    this.loadApi();
  },

  methods: {
    /**
     * 获取服务列表
     */
    loadApi(isClear) {
      if (isClear) {
        this.formApi = {};
      }
      this.loading = true;
      resApi
        .getApisTree(this.formApi)
        .then(res => {
          // 没查询到数据时，后端返回 null
          this.apiList = res || [];
        })
        .catch(this.$errorHandler)
        .finally(() => {
          this.loading = false;
        });
    },

    /**
     * 向父组件发送选中数据
     */
    sendSelect() {
      let selection = [];

      if (this.multiple) {
        // 只返回选中的子类
        this.apiList.forEach(item => {
          if (item.isChecked && item.children === undefined) {
            selection.push(item);
          }
        });
      } else {
        // 只能选择目标服务
        if (this.cacheCurRow.children && this.cacheCurRow.children.length) {
          this.$message({
            message: '请正确选择系统服务',
            type: 'warning',
          });
          return;
        }
        selection = this.cacheCurRow;
      }

      const filterData = this.filterDelAndSaveOption(selection);

      // 返回完整对象,单选返回对象，多选返回数组
      this.$emit('select', selection, filterData.added, filterData.removed);
      this.close();
    },
    close() {
      this.$emit('close');
    },

    /**
     * checkBox状态发生变化时
     */
    onChangeChecked(row) {
      // 设置子孙勾选状态
      this.setChildChecked(row.children, row.isChecked);

      // 点击root节点
      if (row.isIndeterminate !== undefined && row.parent === undefined) {
        row.isIndeterminate = false;
      } else {
        this.setParentsChecked(row.parent);
      }
    },

    /**
     * 设置子孙选中状态
     */
    setChildChecked(children, isCheck) {
      if (children === undefined || children.lenght === 0) return;
      children.forEach(item => {
        item.isChecked = isCheck;
        if (item.isIndeterminate && isCheck === false) {
          item.isIndeterminate = false;
        }
        this.setChildChecked(item.children, isCheck);
      });
    },

    /**
     * 设置父、爷选中状态
     */
    setParentsChecked(father) {
      while (father) {
        if (father.children && father.children.length) {
          const isCheck = father.children.every(item => item.isChecked === true);

          father.isChecked = isCheck;
          // 如果全选中或没选中项，半选状态不显示，有选中项 显示半选状态
          father.isIndeterminate =
            father.children.find(item => item.isChecked === true) === undefined ? false : !isCheck;
        }

        father = father.parent;
      }
    },

    /**
     * 单选时保存当前选中行
     */
    onClickCacheRow(row) {
      if (this.multiple) return;
      this.cacheCurRow = row;
    },

    /**
     * 查找需要删除的选项
     * @param {Array} select 子组件返回勾选信息
     * @return {Object}  保存、删除集合
     */
    filterDelAndSaveOption(select) {
      select = select instanceof Array ? select : [select];
      const returnDate = {
        added: [],
        removed: [],
      };
      const { defaultSelectMap } = this;

      select.forEach(item => {
        if (defaultSelectMap[item.id]) {
          defaultSelectMap[item.id] = false; // 如果存在，表示不需要做修改操作
        } else {
          returnDate.added.push(item); // 新增项
        }
      });

      // 获取需要删除的选项
      returnDate.removed = this.apiList.filter(item => defaultSelectMap[item.id] === true);
      // 单选返回对象
      if (!this.multiple) {
        returnDate.added = { ...returnDate.added[0] };
        returnDate.removed = { ...returnDate.removed[0] };
      }

      return returnDate;
    },
  },
};
</script>
<style lang='less' scoped>
.m-5 {
  margin: 0 5px;
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
</style>
