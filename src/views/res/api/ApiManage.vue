<!-- 服务管理页面 -->
<template>
  <div>
    <el-row :gutter="30">
      <el-col :span='4'>
        <div class="t-pane">
          <div class="pane-tit">
            <el-button size='mini' @click='editApiType(true)'>新增分类</el-button>
          </div>

          <div class='pane-container'>
              <el-tree
                :data="treeData"
                :props="defaultProps"
                @node-click="clickTreeNode"
                highlight-current
                :default-expanded-keys="cacheData.expandedKeys"
                node-key="id"
                ref='apiTypeTree'>
                <span class="custom-tree-node" slot-scope="{ node, data }">
                  <span>{{ node.label }}</span>
                  <i v-if='data.id !== -1' class='el-icon-edit t-edit-icon' @click.stop='editApiType(false,data)'></i>
                </span>
              </el-tree>
              <!-- 服务类型 Tree END -->
          </div>
        </div>
      </el-col>
      <!-- Tree END -->

      <el-col :span='20'>
        <div class="t-pane">
          <div class="pane-tit">
            <el-button size='mini' @click='editApi(true)'>新增服务</el-button>
          </div>

          <div class="pane-container">
            <div class="search-option-container">
                <el-form :inline="true" :model="searchForm" class="demo-form-inline">
                  <el-form-item label="服务名称">
                    <el-input v-model="searchForm.name" size="mini"></el-input>
                  </el-form-item>
                  <el-form-item label='服务编码'>
                    <el-input v-model="searchForm.code" size='mini'></el-input>
                  </el-form-item>
                  <el-form-item label='服务路径'>
                    <el-input v-model="searchForm.url" size='mini'></el-input>
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" size='mini' @click='getApiList(false)'>查询</el-button>
                  </el-form-item>
                  <el-form-item>
                    <el-button size='mini' @click='getApiList(true)'>重置</el-button>
                  </el-form-item>
                </el-form>
            </div>
            <!-- 条件搜索 END -->

            <el-table
              :data='apiList'
              highlight-current-row
              border
              style='width: 100%;'>
                <el-table-column
                  type='index'
                  label="序号"
                  width="50">
                </el-table-column>

                <el-table-column label="服务名称" property='name'></el-table-column>
                <el-table-column label="服务编码" property='code' align='center' width='100'></el-table-column>
                <el-table-column label="授权类型" align="center" width='100'>
                  <template slot-scope='scope'>
                    {{formatAuthType(scope.row.authType)}}
                  </template>
                </el-table-column>
                <el-table-column label='服务路径' property='url'></el-table-column>
                <el-table-column label='排序' property='sort' align="center" width="60"></el-table-column>
                <!-- <el-table-column label='配置' property='url'> -->
                  <!-- <template> -->
                    <!--  暂时不做，后期实现  -->
                  <!-- </template> -->
                <!-- </el-table-column> -->
                <el-table-column label='操作'>
                  <template slot-scope='scope'>
                    <a href="javascript: void(0)" class="m-5" @click='editApi(false,scope.row)'>编辑</a>
                    <a href="javascript: void(0)" class="m-5" @click='delApi(scope.row,scope.$index)'>删除</a>
                  </template>
                </el-table-column>
            </el-table>
            <!-- 服务列表 END -->

            <el-pagination
              @size-change="pageSizeChange"
              @current-change="pageCurrentChange"
              :current-page="page.current"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="page.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page.total"
              style='text-align:right; padding: 11px 15px;'>
            </el-pagination>
            <!-- 分页 END -->
          </div>
        </div>

      </el-col>
      <!-- 详情 END -->
    </el-row>

    <!-- 服务类型 -->
    <ApiTypeEdit
      v-if='dialogs.apiTypeEdit'
      :parentType='cacheData.parentType'
      :apiType='cacheData.activeTreeNode'
      :isNew='cacheData.isNewApiType'
      @close='dialogs.apiTypeEdit = false'
      @save='appendApiType2Tree'
      @delete='deleteApiType'/>
    <!-- 服务 -->
    <ApiEdit
      v-if='dialogs.apiEdit'
      :api='cacheData.activeApi'
      :isNew='cacheData.isNewApi'
      @save='appendApi2List'
      @close='dialogs.apiEdit = false'/>
    <!-- 弹框 end -->
  </div>
</template>

<script>
import Dic from '@/api/mockDictionary';
import { getApiTypeTree, getApiListByOption, deleteApi } from '@/api/resources';
import { data2treeArr } from '@/libs/utils';
import ApiTypeEdit from './ApiTypeEdit.vue';
import ApiEdit from './ApiEdit.vue';

export default {
  name: 'ApiManage',
  data() {
    return {
      // 服务类型集合
      apiTypeList: [{ name: '服务分类', id: -1 }],
      defaultProps: {
        label: 'name',
        children: 'children',
      },
      searchForm: {},
      apiList: [], // 服务集合
      cacheData: {
        activeTreeNode: null,
        isNewApiType: '', // 用于标记新增、修改
        parentType: '', // 保存当前选中节点父 name
        isNewApi: '', // 用于判断 服务是 修改还是新增
        activeApi: null, // 保存选中的服务
        expandedKeys: [-1], // 控制 Tree 展开的目标 key 初始化展开 ROOT 节点
      },
      // 数据字典
      dataDictionary: {
        authType: Dic.authType,
      },
      // 管理Dialog 状态
      dialogs: {
        apiTypeEdit: false,
        apiEdit: false,
      },
      page: {
        current: 1,
        total: 0,
        pageSize: 20,
      },
    };
  },

  components: {
    ApiTypeEdit,
    ApiEdit,
  },

  computed: {
    treeData() {
      return data2treeArr(this.apiTypeList, 'id', 'pid');
    },
  },
  mounted() {
    this.getApiTypeData();
  },

  methods: {
    // 获取服务类型 Tree 数据
    getApiTypeData() {
      getApiTypeTree().then(res => {
        this.apiTypeList = [...this.apiTypeList, ...res];
        if (res.length > 0) {
          const firstObj = res[0];
          this.cacheData.activeTreeNode = firstObj;
          this.cacheData.parentType = firstObj.name;
        } else {
          const firstObj = this.apiTypeList[0];
          this.cacheData.activeTreeNode = firstObj;
          this.cacheData.parentType = firstObj.name;
        }
        // ! DOM 更新后才能正常设置 Tree 选中项
        this.$nextTick(() => {
          this.$refs.apiTypeTree.setCurrentKey(res.length > 0 ? res[0].id : -1);
        });
        this.getApiList();
      });
    },
    // 点击 tree
    clickTreeNode(data) {
      if (data.id === this.cacheData.activeTreeNode.id) return;

      this.cacheData.activeTreeNode = data;

      // 保存父节点名称
      if (data.id === -1) {
        this.cacheData.parentType = '服务分类';
      } else {
        const parent = this.findObjByid(data.pid);
        this.cacheData.parentType = parent.data.name;
      }
      this.getApiList();
    },
    /**
     * 编辑服务类型
     * @param {boolean} isNew true 新增，false 修改
     *
     */
    editApiType(isNew, data) {
      const { cacheData } = this;

      console.log(cacheData.activeTreeNode);

      if (data !== undefined) {
        cacheData.activeTreeNode = data;
        this.$refs.apiTypeTree.setCurrentKey(data.id);
      }
      // 新增
      if (isNew === true) {
        cacheData.parentType = cacheData.activeTreeNode.name;
      } else if (cacheData.activeTreeNode.id === -1) {
        cacheData.parentType = '服务分类';
      } else {
        const parent = this.findObjByid(cacheData.activeTreeNode.pid);
        cacheData.parentType = parent.data.name;
      }

      cacheData.isNewApiType = isNew;
      this.dialogs.apiTypeEdit = true;
    },
    // 新增分类
    appendApiType2Tree(data) {
      if (this.cacheData.isNewApiType) {
        this.apiTypeList = [...this.apiTypeList, Object.assign({}, data)];
        this.cacheData.expandedKeys = [this.cacheData.activeTreeNode.id];

        // dom 更新后选中新添加节点
        this.$nextTick(() => {
          this.$refs.apiTypeTree.setCurrentKey(data.id);
        });

        // 清除 服务列表、搜索条件、分页信息
        this.apiList = [];
        this.searchForm = {};
        this.page.current = 1;
        this.page.pageSize = 20;
        this.page.total = 0;
      } else {
        // view 只显示 name
        this.cacheData.activeTreeNode.name = data.name;
      }
    },
    // 删除分类
    deleteApiType(id) {
      const target = this.findObjByid(id);
      const parent = this.findObjByid(target.data.pid).data;
      // 删除parent.children数据引用
      for (let i = 0, len = parent.children.length; i < len; i += 1) {
        const item = parent.children[i];
        if (item.id === id) {
          parent.children.splice(i, 1);
          break;
        }
      }

      this.apiTypeList.splice(target.index, 1);
    },
    // 根据 ID 查找数据
    findObjByid(id, list = this.apiTypeList) {
      const returnObj = {};
      for (let i = 0, len = list.length; i < len; i += 1) {
        const item = list[i];
        if (`${item.id}` === `${id}`) {
          returnObj.index = i;
          returnObj.data = item;
          break;
        }
      }
      return returnObj;
    },

    /**
     * 获取 服务列表
     * @param {boolean} isClear 是否重置
     */
    getApiList(isClear) {
      if (isClear) {
        this.searchForm = {};
        this.page.current = 1;
      }
      // 类型ID关联
      const searchOption = Object.assign({}, this.searchForm, {
        resAffiliationType: this.cacheData.activeTreeNode.id,
        current: this.page.current,
        pageSize: this.page.pageSize,
      });
      getApiListByOption(searchOption).then(res => {
        this.page.current = res.current;
        this.page.total = res.total;
        this.page.pageSize = res.pageSize;
        this.apiList = res.resApis;
      });
    },
    // 监听当前页发生变化
    pageCurrentChange(val) {
      this.page.current = val;
      this.getApiList();
    },
    // 监听分页条数发生变化
    pageSizeChange(val) {
      this.page.pageSize = val;
      this.getApiList();
    },
    // 删除 服务
    delApi(row, index) {
      this.$confirm('删除后将无法恢复，确定删除此服务?', '提示', { type: 'warning' }).then(
        () => {
          deleteApi(row.id).then(() => {
            this.apiList.splice(index, 1);

            if (this.apiList.length === 0 && this.page.current > 1) {
              this.page.current -= 1;
              this.getApiList();
            }

            this.$message({
              message: '删除成功',
              type: 'success',
            });
          });
        },
        () => {}
      );
    },
    // 编辑服务
    editApi(isNew, data) {
      this.cacheData.isNewApi = isNew;
      if (isNew) {
        this.cacheData.activeApi = { resAffiliationType: this.cacheData.activeTreeNode.id };
      } else {
        this.cacheData.activeApi = data;
      }

      this.dialogs.apiEdit = true;
    },
    // 子组件保存成功后回调
    appendApi2List(data) {
      if (this.cacheData.isNewApi) {
        this.apiList.unshift(data);
        this.page.total += 1;
      } else {
        this.cacheData.activeApi = Object.assign(this.cacheData.activeApi, data);
      }
    },
    // 过滤收取类型
    formatAuthType(val) {
      let targetAuthType = '';

      for (let i = 0, len = this.dataDictionary.authType.length; i < len; i += 1) {
        const item = this.dataDictionary.authType[i];

        if (item.value === val) {
          targetAuthType = item.name;
          break;
        }
      }

      return targetAuthType;
    },
  },
};
</script>
<style lang='less' scoped>
.m-5 {
  margin: 0 5px;
}
.t-pane {
  @borderColor: #e9e9e9;
  border: 1px solid @borderColor;
  .pane-tit {
    border-bottom: 1px solid @borderColor;
    padding: 11px 15px;
  }

  .search-option-container {
    padding: 11px 15px 0 15px;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  .t-edit-icon {
    display: none;
    -webkit-transition: color 0.3s;
    -moz-transition: color 0.3s;
    -ms-transition: color 0.3s;
    -o-transition: color 0.3s;
    transition: color 0.3s;
    &:hover {
      color: teal;
    }
  }
  &:hover .t-edit-icon {
    display: block;
  }
}
</style>
