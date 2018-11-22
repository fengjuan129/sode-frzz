<!-- 选择服务公共页面 -->
<template>
  <el-dialog :title='title' :visible='isVisible' width="60%" :before-close="close">

    <div class="search-bar">
      <el-form :inline="true">
        <el-form-item label="服务名称">
          <el-input v-model.trim="formApi.name" size='mini'></el-input>
        </el-form-item>

        <el-form-item label="服务编码">
          <el-input v-model.trim="formApi.code" size='mini'></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type='primary' size='mini' @click='loadApi'>查询</el-button>
        </el-form-item>

        <el-form-item>
          <el-button size='mini' @click="loadApi(true)">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <!-- 搜索框 END -->
    <zk-table
      v-loading='loading'
      :columns='columns'
      :data='treeData'
      :expandType='false'
      border
      :show-row-hover='true'
      :isFold='false'
      :selection-type='true'

      ref='apiTree'>
    </zk-table>
    <!-- tree grid end -->
    <span slot="footer" class='dialog-footer'>
        <el-button @click='close'>取 消</el-button>
        <el-button type='primary' @click='sendSelect'>确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import ZkTable from 'vue-table-with-tree-grid';
import * as Utils from '@/libs/utils';
import * as resApi from '@/api/resources';

export default {
  name: 'SelectApi',
  components: {
    ZkTable,
  },
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
    },
  },
  data() {
    return {
      isVisible: true,
      loading: false,
      columns: [
        {
          label: '服务名称',
          prop: 'name',
        },
        {
          label: '服务编码',
          prop: 'code',
          width: 200,
        },
        {
          label: '服务路径',
          prop: 'url',
        },
      ],
      apiList: [],
      formApi: {
        name: '',
        code: '',
      },
    };
  },
  computed: {
    treeData() {
      return Utils.data2treeArr([...this.apiList], 'id', 'pid');
    },
  },
  created() {
    this.loadApi();
  },

  methods: {
    // 获取服务列表
    loadApi(isClear) {
      if (isClear) {
        this.formApi = {};
      }
      this.loading = true;
      resApi.getApiListByOption(this.formApi).then(res => {
        this.loading = false;
        this.apiList = res;
      });
    },
    sendSelect() {
      const apiMap = {};
      const selectedIds = this.$refs.apiTree.getCheckedProp('id');
      const sendData = [];
      this.$refs.apiTree.bodyData.forEach(item => {
        apiMap[item.id] = item;
      });

      selectedIds.forEach(id => {
        sendData.push(apiMap[id]);
      });
      // 返回完整对象
      this.$emit('select', sendData);
      this.close();
    },
    close() {
      this.$emit('close');
    },
  },
};
</script>
<style lang='less' scoped>
</style>
