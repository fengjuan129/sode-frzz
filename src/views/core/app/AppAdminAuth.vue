<!-- 应用系统管理员授权页面 -->
<template>
  <div>
    <el-dialog
      width='400px'
      :visible="visible"
      title='应用系统管理员权限'
      :before-close="close"
      :close-on-click-modal='false'>

      <el-table style='width: 100%;' :data='roleList' v-loading='loading'>

        <el-table-column label="管理角色" prop='name'></el-table-column>
        <el-table-column label="账号">
          <template slot-scope="scope">
            <el-button type='text' @click="onAdminChange(scope.row)">[{{scope.row.userName || '选择'}}]</el-button>
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
      type: String,
      required: true,
    },
  },
  components: {
    SelectUser,
  },
  data() {
    return {
      loading: true,
      roleList: [],
      winSelectUser: {
        visible: false,
      },
      selection: '',
    };
  },

  created() {
    CoreApi.searchAdminAuth(this.appId).then(res => {
      this.loading = false;
      this.roleList = res;
    });
  },

  methods: {
    close() {
      this.$emit('close');
    },
    /**
     * 选中用户回调方法
     */
    setAdmin(user) {
      /**
       * 判断选中用户是否已经拥有管理员角色
       * 同一个账号不能同时担任两个及以上管理角色
       */
      const role = this.roleList.find(item => item.userId === user.id);
      if (role) {
        this.$message({
          message: `选中用户已经拥有【${role.name}】角色，请重新选择！`,
          type: 'warning',
        });
        return;
      }

      this.loading = true;
      // TODO 后端暂无接口,提交参数不明， 保存成功后后端返回完整数据
      CoreApi.saveAdminAuth(this.selection.id, user.id).then(() => {
        this.loading = false;

        this.selection.userName = user.name;
        this.selection.userId = user.id;

        this.$emit('save', { ...this.selection });
        this.$message({
          message: '保存成功',
          type: 'success',
        });
      });
    },
    /**
     * 保存当前选中行
     */
    onAdminChange(selection) {
      this.selection = selection;
      this.winSelectUser.visible = true;
    },
  },
};
</script>
<style lang='less' scoped>
</style>
