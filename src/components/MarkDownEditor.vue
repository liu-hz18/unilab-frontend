<template>
  <div class="markdown-editor">
    <div class="upload-progress" :style="`width:${progress}%`" />
    <div class="markdown-editor-inner">
      <MarkdownPro
        v-model="content"
        :toolbars="toolbars"
        theme="oneDark"
        @on-ready="ready"
        @on-upload-image="upImg"
        style="height: 500px; text-align: left"
      />
    </div>
  </div>
</template>

<script>
import { MarkdownPro } from "vue-meditor";
const editor = {};

export default {
  name: "MarkDownEditor",
  components: { MarkdownPro },
  props: {
    value: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      content: this.value,
      toolbars: {
        uploadImage: true,
        split: true,
      },
      progress: 0,
    };
  },
  watch: {
    value(val) {
      this.content = val;
    },
    content(val) {
      this.$emit("markdown-input", val);
    },
  },
  methods: {
    ready(el) {
      editor.vm = el.vm;
      editor.insert = el.insertContent;
    },
    upImg(file) {
      console.log(file);
      const formData = new FormData();
      formData.set("file", file);
      const xhr = new XMLHttpRequest();
      xhr.open("post", "https://jsonplaceholder.typicode.com/posts/");
      xhr.onload = () => {
        if (xhr.status === 200) {
          const res = JSON.parse(xhr.response || xhr.responseText);
          if (res.status === 0) {
            const imgMdStr = `\n![${file.name}](${res.data.path})\n`;
            editor.insert(imgMdStr);
          } else {
            this.$message.error("图片上传失败");
          }
          this.progress = 0;
        } else {
          this.$message.error("图片上传失败");
          this.progress = 0;
        }
        console.log(xhr.status);
      };
      xhr.upload.onprogress = (e) => {
        // 上传进度
        if (e.lengthComputable) {
          this.progress = ~~((e.loaded / e.total) * 100);
        }
      };
      xhr.send(formData);
    },
  },
};
</script>

<style scoped>
.markdown-editor {
  position: relative;
  padding-top: 2px;
}
.upload-progress {
  position: absolute;
  top: 0;
  left: 0;
  height: 2px;
  background: green;
}
.CodeMirror {
  height: 460px;
}
.markdown-editor-inner {
  line-height: 19px !important;
}
.cm-s-default .cm-header {
  color: #fff !important;
}
</style>
