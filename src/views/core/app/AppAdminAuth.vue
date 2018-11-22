<!-- 应用系统管理员授权页面 -->
<template>
  <div>
    <el-dialog width='400px' :visible="visible" title='应用系统管理员权限' :before-close="close">

      <el-table style='width: 100%;' :data='userList' v-loading='loading' @current-change="onCurrentChange">

        <el-table-column label="管理角色" prop='name'></el-table-column>
        <el-table-column label="账号">
          <template slot-scope="scope">
            <el-button type='text' @click="winSelectUser.visible = true;">[{{scope.row.userName || '选择'}}]</el-button>
          </template>
        </el-table-column>

      </el-table>

      <span slot="footer" class="dialog-footer">
        <!-- <el-button size='mini' type='primary' @click='save'>保存</el-button> -->
        <el-button size='mini' @click='close'>关闭</el-button>
      </span>
    </el-dialog>

    <!-- 弹框 -->
    <select-user
      v-bind='winSelectUser'
      v-if='winSelectUser.visible'
      @close='winSelectUser.visible = false'
      @select='setAdmin'></select-user>
  </div>
</template>

<script>
import * as CoreApi from '@/api/app';
import SelectUser from '@/components/SelectUser';

export default {
  name: 'AppAdminAuth',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    appId: {
      type: Number,
      required: true,
    },
  },
  components: {
    SelectUser,
  },
  data() {
    return {
      loading: true,
      userList: [],
      winSelectUser: {
        visible: false,
      },
      selection: '',
    };
  },

  created() {
    CoreApi.searchAdminAuth(this.appId).then(res => {
      this.loading = false;
      this.userList = res;
    });
  },

  methods: {
    close() {
      this.$emit('close');
    },
    setAdmin(user) {
      CoreApi.saveAdminAuth(this.selection.id, user.id).then(res => {
        console.log(res);
        // TODO 数据结构不清楚
        this.selection.userName = user.name;
        this.selection.userId = user.id;
        // TODO 保存成功后后端返回完整数据
        this.$emit('save', this.selection);
        this.close();
        this.$message({
          message: '保存成功',
          type: 'success',
        });
      });
      console.log(user);
    },
    onCurrentChange(selection) {
      this.selection = selection;
    },
  },
};
</script>
<style lang='less' scoped>
</style>
