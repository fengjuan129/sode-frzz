<!-- 文件上传组件（不提供界面，由上级模块自行实现） -->
<template>
  <div>
    <!-- 控件不支持当前运行环境时的提示 -->
    <el-alert
      v-if="!supported"
      title="文件上传组件不支持您的浏览器！如果您使用的是 IE 浏览器，请尝试安装或升级 flash 播放器"
      type="error"
      show-icon
      :closable="false"
    ></el-alert>
    <!-- 控件支持当前运行环境时才显示插槽内容 -->
    <slot v-if="supported"></slot>
  </div>
</template>

<script>
/* eslint-disable no-undef */
import './lib/webuploader';

export default {
  name: 'Uploader',
  // 可用的组件属性继承自webuploader的options配置，API详情可查看：http://fex.baidu.com/webuploader/doc/index.html#WebUploader_Uploader_options
  props: {
    // 文件上传路径
    server: {
      type: String,
    },
    // 指定选择文件的按钮容器（选择符匹配）
    pick: {
      type: [String, Object],
      required: true,
    },
    // 指定接受哪些类型的文件（写法请参考API）
    accept: {
      type: Array,
    },
    // 设置为 true 后，不需要手动调用上传，有文件选择即开始上传
    auto: {
      type: Boolean,
    },
    // 指定运行时启动顺序。默认会想尝试 html5 是否支持，如果支持则使用 html5, 否则则使用 flash. 可以将此值设置成 flash，来强制使用 flash 运行时。
    runtimeOrder: {
      type: [String, Object],
    },
    // 是否要分片处理大文件上传
    chunked: {
      type: Boolean,
    },
    // 如果要分片，分多大一片？ 默认大小为5M
    chunkSize: {
      type: Number,
    },
    // 如果某个分片由于网络问题出错，允许自动重传多少次？默认2次
    chunkRetry: {
      type: Number,
    },
    // 上传并发数。允许同时最大上传进程数。默认3
    threads: {
      type: Number,
    },
    // TODO: 启用分片上传时校验分片上传三个阶段的回调函数是否已定义
    // 启用分片上传时，上传文件前的回调
    beforeSendFile: {
      type: Function,
    },
    // 启用分片上传时，上传某分片前的回调
    beforeSend: {
      type: Function,
    },
    // 启用分片上传时，文件所有分片均上传完成的回调
    afterSendFile: {
      type: Function,
    },
    // 指定Drag And Drop拖拽的容器
    dnd: {
      type: String,
    },
    // 是否禁掉整个页面的拖拽功能，如果不禁用，图片拖进来的时候会默认被浏览器打开
    disableGlobalDnd: {
      type: Boolean,
    },
    // 指定监听paste事件的容器，如果不指定，不启用此功能。此功能为通过粘贴来添加截屏的图片。建议设置为document.body
    paste: {
      type: String,
    },
    // 配置生成缩略图的选项（写法请参考API）
    thumb: {
      type: Object,
    },
    // 配置压缩的图片的选项。如果此选项为false, 则图片在上传前不进行压缩。（写法请参考API）
    compress: {
      type: [Object, Boolean],
    },
    // 是否允许在文件传输时提前把下一个文件准备好。 对于一个文件的准备工作比较耗时，比如图片压缩，md5序列化。 如果能提前在当前文件传输期处理，可以节省总体耗时。
    prepareNextFile: {
      type: Boolean,
    },
    // 文件上传请求的参数表，每次发送都会发送此对象中的参数
    formData: {
      type: Object,
    },
    // 设置文件上传域的name。默认'file'
    fileVal: {
      type: String,
    },
    // 文件上传方式，POST或者GET。默认POST
    method: {
      type: String,
    },
    // 是否已二进制的流的方式发送文件
    sendAsBinary: {
      type: Boolean,
    },
    // 验证文件总数量, 超出则不允许加入队列
    fileNumLimit: {
      type: Number,
    },
    // 验证文件总大小是否超出限制, 超出则不允许加入队列
    fileSizeLimit: {
      type: Number,
    },
    // 验证单个文件大小是否超出限制, 超出则不允许加入队列
    fileSingleSizeLimit: {
      type: Number,
    },
    // 去重， 根据文件名字、文件大小和最后修改时间来生成hash Key
    duplicate: {
      type: Boolean,
    },
    // 认所有 Uploader.register 了的 widget 都会被加载，如果禁用某一部分，请通过此 option 指定黑名单
    disableWidgets: {
      type: [String, Array],
    },
  },
  data() {
    return {
      uploader: null, // 上传控件对象
      supported: true, // 上传控件是否支持当前环境
    };
  },
  mounted() {
    const that = this;
    // 判断控件是否支持当前运行环境
    if (!WebUploader.Uploader.support()) {
      this.supported = false;
      return;
    }
    // 启用分片上传时对分片处理方法进行初始化
    if (this.chunked) {
      WebUploader.Uploader.register(
        {
          'before-send-file': 'beforeSendFile',
          'before-send': 'beforeSend',
          'after-send-file': 'afterSendFile',
        },
        {
          /**
           * 文件上传前回调
           * @param {object} file 文件对象
           */
          beforeSendFile(file) {
            return that.beforeSendFile(file, that.uploader, WebUploader);
          },
          /**
           * 分片上传前回调
           * @param {object} chunk 分片对象
           */
          beforeSend(chunk) {
            return that.beforeSend(chunk, that.uploader, WebUploader);
          },
          /**
           * 文件所有分片上传完成回调
           * @param {object} file 文件对象
           */
          afterSendFile(file) {
            return that.afterSendFile(file, WebUploader);
          },
        }
      );
    }
    // 创建上传组件实例
    this.uploader = WebUploader.create({
      // swf文件路径
      // TODO: 验证此路径是否生效
      swf: './lib/Uploader.swf',
      // 传入的其他配置项
      ...this.$props,
    });

    const { uploader } = this;

    // 对外暴露事件
    // 拖拽添加文件
    uploader.on('dndAccept', items => {
      this.$emit('dnd-accept', items);
    });
    // 当文件被加入队列之前触发
    uploader.on('beforeFileQueued', file => {
      console.log('beforeFileQueued', file);
      this.$emit('before-file-queued', file);
    });
    // 文件加入上传队列
    uploader.on('fileQueued', file => {
      console.log('before emit fileQueued');
      this.$emit('file-queued', file);
      console.log('after emit fileQueued', file);
    });
    // 一批文件加入上传队列
    uploader.on('filesQueued', files => {
      this.$emit('files-eueued', files);
    });
    // 当文件被移除队列后触发
    uploader.on('fileDequeued', file => {
      this.$emit('file-dequeued', file);
    });
    // 当 uploader 被重置的时候触发
    uploader.on('reset', () => this.$emit('reset'));
    // 当开始上传流程时触发
    uploader.on('startUpload', () => this.$emit('start-upload'));
    // 当开始上传流程暂停时触发
    uploader.on('stopUpload', () => this.$emit('stop-upload'));
    // 当所有文件上传结束时触发
    uploader.on('uploadFinished', () => this.$emit('upload-finished'));
    // 某个文件开始上传前触发，一个文件只会触发一次
    uploader.on('uploadStart', file => {
      this.$emit('upload-start', file);
    });
    // 当某个文件的分块在发送前触发，大文件在开启分片上传的前提下此事件可能会触发多次
    uploader.on('uploadBeforeSend', (object, data, headers) => {
      this.$emit('upload-before-send', object, data, headers);
    });
    // 当某个文件上传到服务端响应后，会派送此事件来询问服务端响应是否有效
    uploader.on('uploadAccept', (object, ret) => {
      this.$emit('upload-accept', object, ret);
    });
    // 上传过程中触发，携带上传进度
    uploader.on('uploadProgress', (file, percentage) => {
      this.$emit('upload-progress', file, percentage);
    });
    // 当文件上传出错时触发
    uploader.on('uploadError', (file, reason) => {
      this.$emit('upload-error', file, reason);
    });
    // 当文件上传成功时触发
    uploader.on('uploadSuccess', (file, response) => {
      this.$emit('upload-success', file, response);
    });
    // 不管成功或者失败，文件上传结束时触发
    uploader.on('uploadComplete', file => {
      this.$emit('upload-complete', file);
    });
    // 当validate不通过时，会以派送错误事件的形式通知调用者
    uploader.on('error', type => {
      this.$emit('error', type);
    });
  },
  beforeDestroy() {
    // 组件销毁前销毁上传控件
    if (this.uploader) {
      this.uploader.destroy();
    }
  },
};
</script>
