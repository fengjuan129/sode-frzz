<template>
  <file-uploader :objectId="objectId" showUploadButton @upload-finished="onUploadFinished"/>
</template>

<script>
import FileUploader from '@/components/FileUploader';

export default {
  name: 'demo',
  components: { FileUploader },
  data() {
    return {
      objectId: 'xxxxxxx',
    };
  },
  methods: {
    onUploadFinished(files) {
      console.log('业务组件接收到所有文件上传完成事件', files);
    },
  },
};
</script>
