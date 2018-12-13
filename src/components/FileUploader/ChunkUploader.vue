<!-- 文件分片上传组件 -->
<template>
  <div>
    <el-card class="box-card">
      <!-- 上传组件 -->
      <uploader
        ref="uploader"
        v-bind="uploaderProps"
        @file-queued="onFileQueued"
        @upload-start="onUploadStart"
        @upload-progress="onUploadProgress"
        @upload-success="onUploadSuccess"
        @upload-error="onUploadError"
        @upload-complete="onUploadComplete"
        @upload-finished="onUploadFinished"
      >
        <!-- 操作按钮栏 -->
        <div class="clearfix">
          <div id="chunkUploaderPicker" class="fl mr10">选择文件</div>
          <el-button v-if="showUploadButton" size="small" class="fl" @click="upload">开始上传</el-button>
        </div>

        <!-- 文件列表 -->
        <el-table :data="files" highlight-current-row>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="name" label="文件名">
            <template slot-scope="{ row: file }">
              <!-- 为文件添加类型图标 -->
              <font-awesome-icon
                :icon="getFileIcon(file.ext)"
                style="font-size:1.5em;margin-right:5px;"
              />
              {{ file.name }}
            </template>
          </el-table-column>
          <el-table-column prop="size" label="文件大小">
            <template slot-scope="{ row: file }">{{file.size | fileSize}}</template>
          </el-table-column>
          <el-table-column prop="progress" label="上传进度">
            <template slot-scope="{ row: file}">{{file.progress | progress(file._status)}}</template>
          </el-table-column>
          <el-table-column prop="operation" label="操作">
            <template slot-scope="{ row: file }">
              <el-button v-if="file._status === 'WAITING'" type="text" @click="removeFile(file)">移除</el-button>
              <el-button v-if="file._status === 'FAILURE'" type="text" @click="retry(file)">重试</el-button>
              <!-- 取消上传前给出确认提示 -->
              <el-popover
                v-if="file._status === 'UPLOADING' || file._status === 'PREPARING' || file._status === 'FAILURE'"
                placement="top"
                v-model="file.showCancelPopOver"
                class="ml10"
              >
                <p>确定取消上传此文件？</p>
                <div style="text-align: right;">
                  <el-button size="mini" type="text" @click="file.showCancelPopOver = false">取消</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="file.showCancelPopOver = false; cancelFile(file);"
                  >确定</el-button>
                </div>
                <el-button type="text" slot="reference">取消上传</el-button>
              </el-popover>
              <el-button
                v-if="file._status === 'SUCCESS'"
                type="text"
                @click="downloadFile(file)"
              >下载</el-button>
              <!-- 删除文件前给出确认提示 -->
              <el-popover
                v-if="file._status === 'SUCCESS'"
                placement="top"
                v-model="file.showDelPopOver"
                class="ml10"
              >
                <p>确定删除此文件？</p>
                <div style="text-align: right;">
                  <el-button size="mini" type="text" @click="file.showDelPopOver = false">取消</el-button>
                  <el-button
                    type="primary"
                    size="mini"
                    @click="file.showDelPopOver = false; deleteFile(file);"
                  >确定</el-button>
                </div>
                <el-button type="text" slot="reference">删除</el-button>
              </el-popover>
            </template>
          </el-table-column>
        </el-table>
      </uploader>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
import Uploader from './Uploader.vue';

/** 文件上传状态 */
const UPLOAD_STATUS = {
  /** 待上传 */
  WAITING: 'WAITING',
  /** 准备中（计算MD5） */
  PREPARING: 'PREPARING',
  /** 正在上传 */
  UPLOADING: 'UPLOADING',
  /** 上传成功 */
  SUCCESS: 'SUCCESS',
  /** 上传失败 */
  FAILURE: 'FAILURE',
};

export default {
  name: 'ChunkUploader',
  components: { Uploader },
  filters: {
    /**
     * 上传进度字段渲染方法
     * @param {number} value 进度（0~1）
     * @param {string} status 上传状态
     * @returns {string} 显示文本
     */
    progress(value, status) {
      console.log('上传进度渲染', value, status);
      if (status === UPLOAD_STATUS.WAITING) {
        return '待上传';
      } else if (status === UPLOAD_STATUS.PREPARING) {
        return '文件读取中';
      } else if (status === UPLOAD_STATUS.UPLOADING) {
        return value ? `${(value * 100).toFixed(2)}%` : '文件读取中';
      } else if (status === UPLOAD_STATUS.SUCCESS) {
        return '上传成功';
      } else if (status === UPLOAD_STATUS.FAILURE) {
        return '上传失败';
      }
      return value;
    },
  },
  props: {
    // 业务对象id
    objectId: {
      type: String,
      required: true,
    },
    // 业务类型
    businessType: {
      type: String,
    },
    // 子业务类型
    childBusType: {
      type: String,
    },
    // 是否显示上传按钮
    showUploadButton: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      files: [], // 文件列表数据
      // 上传组件配置
      uploaderProps: {
        pick: '#chunkUploaderPicker', // 选择文件的按钮容器
        server: '/api/v1/file/upload', // 文件接收服务端
        // threads: 1, // 上传并发数（暂时设置为1，避免不同文件间的影响）
        chunked: true, // 分片上传
        duplicate: true, // 去重
        prepareNextFile: true, // 分片传输时提前准备下一分片
        beforeSendFile: this.beforeSendFile, // 文件上传前回调
        beforeSend: this.beforeSend, // 分片上传前回调
        afterSendFile: this.afterSendFile, // 文件所有分片上传完成回调
      },
    };
  },
  computed: {
    // webuploader上传控件对象
    uploader() {
      return this.$refs.uploader.uploader;
    },
  },
  methods: {
    /**
     * 文件上传前回调
     * @param {object} file 文件对象
     * @param {object} uploader 上传控件实例
     * @param {object} WebUploader WebUploader上传工具
     */
    beforeSendFile(file, uploader, WebUploader) {
      console.log('beforeSendFile');
      file._status = UPLOAD_STATUS.PREPARING;
      const deferred = WebUploader.Deferred();
      // 计算文件的唯一标记，用于断点续传
      uploader
        .md5File(file, 0, 10 * 1024 * 1024)
        .progress(() => {})
        .then(val => {
          console.log(`md5计算完成：${val}`);
          file.fileMd5 = val;
          // 访问后端确认文件是否已上传过
          $.ajax({
            type: 'GET',
            url: '/api/v1/file/existence',
            data: {
              fileMd5: val,
            },
            // dataType: 'json',
            success: res => {
              if (res) {
                console.log('文件已存在', res);
                // file.path = res.path;
                // 如果文件已上传过，调用控件方法跳过该文件
                uploader.skipFile(file);
                // 修改文件状态为上传成功
                file._status = UPLOAD_STATUS.SUCCESS;
                deferred.resolve();
              } else {
                console.log('文件不存在，开始分片上传');
                // 文件不存在，开始分片上传
                deferred.resolve();
              }
            },
            error: e => {
              console.log('文件秒传校验失败', e);
              // 调用接口失败时修改文件状态为上传失败
              file._status = UPLOAD_STATUS.FAILURE;
              deferred.reject();
            },
          });
        });
      return deferred.promise();
    },
    /**
     * 分片上传前回调
     * @param {object} block 分片对象
     * @param {object} uploader 上传控件实例
     * @param {object} WebUploader WebUploader上传工具
     */
    beforeSend(block, uploader, WebUploader) {
      console.log(`准备上传分块${block.chunk}`);
      const deferred = WebUploader.Deferred();
      // 访问后端确认当前分片是否已经上传过
      $.ajax({
        type: 'GET',
        url: '/api/v1/file/chunk/existence',
        data: {
          fileMd5: block.file.fileMd5, // 文件唯一标记
          chunk: block.chunk, // 当前分块下标
          chunkSize: block.end - block.start, // 当前分块大小
        },
        dataType: 'json',
        success: isExist => {
          console.log(`分块${block.chunk}是否已存在：${isExist}`);
          if (isExist) {
            // 分块存在，跳过
            deferred.reject();
          } else {
            // 分块不存在或不完整，重新发送该分块内容
            deferred.resolve();
          }
        },
        error: () => {
          console.log(`分块${block.chunk}校验失败`);
          // 访问出错，尝试重新发送该分块
          deferred.resolve();
        },
      });
      // 更新上传参数（分块序号以及文件的md5值）
      uploader.options.formData.chunk = block.chunk;
      uploader.options.formData.fileMd5 = block.file.fileMd5;
      return deferred.promise();
    },
    /**
     * 文件所有分片上传完成回调
     * @param {object} file 文件对象
     * @param {object} WebUploader WebUploader上传工具
     */
    afterSendFile(file, WebUploader) {
      console.log('afterSendFile');
      const deferred = WebUploader.Deferred();
      // 如果文件状态为上传成功（实际此处代表的应是文件在服务器已存在），不需要通知后端
      if (file._status === UPLOAD_STATUS.SUCCESS) {
        console.log('afterSendFile时检测到文件在服务器已存在');
        deferred.resolve();
      } else {
        // 通知后端将此前上传的分片合并为一个文件
        $.ajax({
          type: 'POST',
          url: '/api/v1/file/chunks/combination',
          data: {
            fileMd5: file.fileMd5, // 文件唯一标记
            fileName: file.name, // 文件名
          },
          dataType: 'json',
          success: res => {
            console.log('合并完成', res);
            // file.path = res.path;
            deferred.resolve();
          },
          error: () => {
            deferred.reject();
          },
        });
      }
      return deferred.promise();
    },
    /**
     * 文件加入上传队列
     * @param {object} file 文件对象
     */
    onFileQueued(file) {
      // 设置默认业务类型
      this.$set(file, 'businessType', this.businessType);
      this.$set(file, 'childBusType', this.childBusType);
      // 设置上传状态
      this.$set(file, '_status', UPLOAD_STATUS.WAITING);
      // 添加确认删除和确认取消的弹框提示标识
      this.$set(file, 'showDelPopOver', false);
      this.$set(file, 'showCancelPopOver', false);
      // 加入文件列表
      this.files.push(file);
      console.log('添加了文件', file);
    },
    /**
     * 某个文件开始上传前触发，一个文件只会触发一次
     * @param {object} file 文件对象
     */
    onUploadStart(file) {
      file._status = UPLOAD_STATUS.UPLOADING;
      console.log('文件开始上传', file);
    },
    /**
     * 上传过程中，携带上传进度
     * @param {object} file 文件对象
     * @param {number} percentage 进度值（0 ~ 1）
     */
    onUploadProgress(file, percentage) {
      this.$set(file, 'progress', percentage);
      console.log('上传进度更新', file, percentage);
    },
    /**
     * 文件上传成功
     * @param {object} file 文件对象
     */
    onUploadSuccess(file) {
      file._status = UPLOAD_STATUS.SUCCESS;
      // 文件上传成功后不再显示是否取消上传的提示框
      file.showCancelPopOver = false;
      console.log('文件上传成功', file);
    },
    /**
     * 文件上传出错
     * @param {object} file 文件对象
     */
    onUploadError(file) {
      file._status = UPLOAD_STATUS.FAILURE;
      console.log('文件上传失败', file);
    },
    /**
     * 不管成功或者失败，文件上传结束
     * @param {object} file 文件对象
     */
    onUploadComplete(file) {
      console.log('某文件上传结束（成功或失败都算结束）', file);
    },
    /**
     * 所有文件上传结束
     */
    onUploadFinished() {
      console.log('全部文件上传完成');
      this.$emit('upload-finished', this.files);
    },
    /**
     * 开始上传
     */
    upload() {
      this.uploader.upload();
    },
    /**
     * 根据文件后缀名获取图标
     * @param {string} ext 文件后缀名
     * @returns {string} 图标类名
     */
    getFileIcon(ext) {
      const fileIcons = {
        default: 'file',
        doc: 'file-word',
        docx: 'file-word',
        xls: 'file-excel',
        xlsx: 'file-excel',
        ppt: 'file-powerpoint',
        pptx: 'file-powerpoint',
        pdf: 'file-pdf',
        jpg: 'file-image',
        jpeg: 'file-image',
        png: 'file-image',
        gif: 'file-image',
        bmp: 'file-image',
        zip: 'file-archive',
        rar: 'file-archive',
        txt: 'file-alt',
        js: 'file-code',
        java: 'file-code',
        css: 'file-code',
        sql: 'file-code',
        xml: 'file-code',
        html: 'file-code',
        jsp: 'file-code',
        csv: 'file-csv',
      };
      return fileIcons[ext] ? fileIcons[ext] : fileIcons.default;
    },
    /**
     * 移除未上传的文件
     * @param {object} file 文件对象
     */
    removeFile(file) {
      // 从上传队列中移除该文件
      this.uploader.cancelFile(file);
      // 从界面列表中移除该文件
      this.files = this.files.filter(fileItem => fileItem.id !== file.id);
    },
    /**
     * 取消正在上传的文件
     * @param {object} file 文件对象
     */
    cancelFile(file) {
      // 从上传队列中移除该文件
      this.uploader.cancelFile(file);
      // 从界面列表中移除该文件
      this.files = this.files.filter(fileItem => fileItem.id !== file.id);
      // 调用接口删除已上传的分片
      $.ajax({
        type: 'DELETE',
        url: '/api/v1/file/cancel',
        contentType: 'application/json',
        data: file.fileMd5,
      });
    },
    /**
     * 重试上传
     * @param {object} file 文件对象
     */
    retry(file) {
      console.log('尝试重新上传文件', file, this.uploader);
      this.uploader.retry(file);
    },
    /**
     * 删除已上传文件
     * @param {object} file 文件对象
     */
    deleteFile(file) {
      console.log('准备删除已上传的文件', file);
    },
    /**
     * 下载文件
     * @param {object} file 文件对象
     */
    downloadFile(file) {
      console.log('准备下载文件', file);
    },
  },
};
</script>

<style>
.webuploader-container {
  display: inline-block;
}

.webuploader-element-invisible {
  position: absolute !important;
  clip: rect(1px 1px 1px 1px); /* IE6, IE7 */
  clip: rect(1px, 1px, 1px, 1px);
}

.webuploader-pick {
  position: relative;
  display: inline-block;
  cursor: pointer;
  color: #fff;
  text-align: center;
  border-radius: 3px;
  overflow: hidden;
  font-size: 12px;
  background-color: teal;
  border-color: teal;
  width: 80px;
  height: 32px;
  line-height: 32px;
}

.webuploader-pick-hover {
  background: #339999;
  border-color: #339999;
}

.webuploader-pick-disable {
  opacity: 0.6;
  pointer-events: none;
}
</style>
