<!-- 菜单选择公共页面 -->
<template>
  <el-dialog
    :title="title"
    :visible="isVisible"
    width="300px"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <el-tree
      :props="defaultProps"
      :data="treeData"
      :show-checkbox="multiple"
      node-key="id"
      :default-expand-all="selectedIds === undefined ? false : true"
      v-loading="loading"
      @check-change="onCheckChange"
      highlight-current
      ref="menuTree"
    ></el-tree>

    <span slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="sendSelect()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as Utils from '@/libs/utils';
import * as resApi from '@/api/res';

export default {
  props: {
    // 弹框标题
    title: {
      type: String,
      default: '菜单选择',
    },
    // 是否对选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 是否自动选中父节点
    autoCheckParent: {
      type: Boolean,
      default: false,
    },
    // 勾选对应ID
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
      isVisible: true,
      defaultProps: {
        children: 'children',
        label: 'name',
      },
      treeList: [],
    };
  },

  computed: {
    treeData() {
      return Utils.data2treeArr(this.treeList, 'id', 'parentId');
    },
    defaultSelectMap() {
      const defaultSelectMap = {};

      this.selectedIds.forEach(item => {
        defaultSelectMap[item] = true;
      });

      return defaultSelectMap;
    },
  },
  mounted() {
    this.getMenu();
  },

  methods: {
    /**
     * 获取菜单数据
     */
    getMenu() {
      this.loading = true;
      resApi.getMenuTree({ isEnable: true }).then(res => {
        this.loading = false;
        this.treeList = res;

        // 设置默认选中
        if (this.selectedIds && this.selectedIds.length) {
          this.$nextTick(() => {
            this.selectedIds.forEach(item => {
              if (this.multiple) {
                this.$refs.menuTree.setChecked(item, true, false);
              } else {
                this.$refs.menuTree.setCurrentKey(item);
              }
            });
          });
        }
      });
    },

    /**
     * checkBox 变化时，是否选中父节点
     */
    onCheckChange() {
      if (this.autoCheckParent === false) return;
      const parents = this.$refs.menuTree.getHalfCheckedKeys();
      parents.forEach(item => {
        this.$refs.menuTree.setChecked(item, true, false);
      });
    },

    /**
     * 向父组件发送选中项
     */
    sendSelect() {
      const select = this.$refs.menuTree[this.multiple ? 'getCheckedNodes' : 'getCurrentNode']();
      const filterData = this.filterDelAndSaveOption(select);
      // 单选返回对象，多选返回数组
      this.$emit('select', select, filterData.added, filterData.removed);
      this.close('close');
    },
    close() {
      this.$emit('close');
    },

    /**
     * 过滤新增、删除的选项
     * @param {Array} select 子组件返回勾选信息
     * @return {Object}  保存、删除集合
     */
    filterDelAndSaveOption(select) {
      select instanceof Array ? select : [select];
      const { defaultSelectMap } = this;
      const returnDate = {
        added: [],
        removed: [],
      };

      select.forEach(item => {
        if (defaultSelectMap[item.id]) {
          defaultSelectMap[item.id] = false; // 如果存在，表示不需要做修改操作
        } else {
          returnDate.added.push(item); // 新增项
        }
      });

      // 获取需要删除的选项
      returnDate.removed = this.treeList.filter(item => defaultSelectMap[item.id] === true);

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
</style>
