<template>
  <div id="bulk-submission" style="min-width: 1100px">
    <el-form
      :label-position="labelPosition"
      label-width="80px"
      :model="formLabelAlign"
    >
      <el-form-item
        label="课程ID"
        :rules="[
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字值' },
        ]"
      >
        <el-input v-model="courseid"></el-input>
      </el-form-item>
      <el-form-item
        label="题目ID"
        :rules="[
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字值' },
        ]"
      >
        <el-input v-model="questionid"></el-input>
      </el-form-item>
      <el-form-item label="语言">
        <el-select v-model="language" placeholder="">
          <el-option
            v-for="item in languageOptions"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="Upload Time"
        :rules="[
          { required: true, message: '不能为空' },
          { type: 'number', message: '必须为数字值' },
        ]"
      >
        <el-input v-model="times"></el-input>
      </el-form-item>
      <el-form-item label="代码文件">
        <el-upload
          class="upload-code"
          ref="upload"
          multiple
          :limit="20"
          action="https://jsonplaceholder.typicode.com/posts/"
          :before-remove="beforeCodeRemove"
          :on-change="handleCodeFileChange"
          :on-remove="handleCodeFileRemove"
          :on-exceed="handleCodeExceed"
          :file-list="fileList"
          :auto-upload="false"
        >
          <el-button
            slot="trigger"
            type="primary"
            round
            size="small"
            icon="el-icon-folder-opened"
            >选择文件</el-button
          >
          <el-button
            style="margin-left: 10px"
            round
            size="small"
            type="success"
            icon="el-icon-upload2"
            @click="handleCodeFileUpload"
            >提交文件</el-button
          >
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import axios from "axios";
import { Message } from "element-ui";
import API from "@/axios/API.js";
import login from "@/axios/login.js";

export default {
  name: "UniLabBulkSubmission",
  data() {
    return {
      courseid: 0,
      questionid: 0,
      language: "c++11",
      times: 0,
      languageOptions: [
        {
          key: "c",
          value: "c",
          label: "C",
          disabled: false,
          lint: "text/x-csrc",
          type: "c",
        },
        {
          key: "c++11",
          value: "c++11",
          label: "C++ 11",
          disabled: false,
          lint: "text/x-c++src",
          type: "c++",
        },
        {
          key: "c++14",
          value: "c++14",
          label: "C++ 14",
          disabled: false,
          lint: "text/x-c++src",
          type: "c++",
        },
        {
          key: "c++17",
          value: "c++17",
          label: "C++ 17",
          disabled: false,
          lint: "text/x-c++src",
          type: "c++",
        },
        {
          key: "c++20",
          value: "c++20",
          label: "C++ 20",
          disabled: false,
          lint: "text/x-c++src",
          type: "c++",
        },
        {
          key: "python2",
          value: "python2",
          label: "Python 2.7",
          disabled: false,
          lint: "text/x-python",
          type: "python2",
        },
        {
          key: "python3",
          value: "python3",
          label: "Python 3.10",
          disabled: false,
          lint: "text/x-python",
          type: "python3",
        },
        {
          key: "java8",
          value: "java8",
          label: "Java 8",
          disabled: false,
          lint: "text/x-java",
          type: "java",
        },
        {
          key: "java11",
          value: "java11",
          label: "Java 11",
          disabled: false,
          lint: "text/x-java",
          type: "java",
        },
        {
          key: "java14",
          value: "java14",
          label: "Java 14",
          disabled: false,
          lint: "text/x-java",
          type: "java",
        },
        {
          key: "java17",
          value: "java17",
          label: "Java 17",
          disabled: false,
          lint: "text/x-java",
          type: "java",
        },
        {
          key: "rust",
          value: "rust",
          label: "Rust",
          disabled: false,
          lint: "text/x-rustsrc",
          type: "rust",
        },
        {
          key: "go",
          value: "go",
          label: "Go",
          disabled: false,
          lint: "text/x-go",
          type: "go",
        },
        {
          key: "js",
          value: "js",
          label: "JavaScript",
          disabled: false,
          lint: "text/javascript",
          type: "js",
        },
      ],
      exportFileNames: {
        "text/x-csrc": "main.c",
        "text/x-c++src": "main.cpp",
        "text/x-java": "Main.java",
        "text/x-go": "main.go",
        "text/x-python": "main.py",
        "text/javascript": "main.js",
        "text/x-rustsrc": "main.rs",
      },
      fileList: [],
    };
  },
  methods: {
    handleCodeFileUpload() {
      if (this.fileList.length <= 0) {
        return Message.warning("请选择文件上传");
      }
      const formData = new FormData();
      formData.append("courseid", this.courseid);
      formData.append("questionid", this.questionid);
      formData.append("language", this.language);
      this.fileList.forEach((element) => {
        const filesize = element.size / 1024 / 1024;
        if (filesize > 5.0) {
          return Message.warning("单个文件大小不能超过5MB!");
        }
        console.log(element.raw);
        formData.append("file", element.raw);
      });
      for (var i = 0; i < this.times; i += 1) {
        axios({
          method: API.SUBMIT_CODE.method,
          url: "/admin/submit-code",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("Authorization")
              ? localStorage.getItem("Authorization")
              : "",
          },
          data: formData,
        })
          .then((res) => {
            if (res.status === 200 && res.data.code === 200) {
              // this.$refs.upload.clearFiles();
              // this.fileList = []
              console.log("succ ", i);
            } else {
              console.log(res);
              Message.error("文件提交失败: ", i, "th trys.");
            }
          })
          .catch((err) => {
            // 请求失败处理
            if (err.response.status === 401) {
              this.CHANGE_LOCALSTORAGE_ON_LOGOUT();
              Message.error("UNAUTHORIZED: 请重新登录");
              login();
            } else {
              console.log(err);
              Message.error("文件提交失败: ", i, "th trys.");
            }
          });
      }
    },
    handleCodeExceed(files, fileList) {
      Message.warning(
        `当前限制选择 20 个文件，本次共选择了 ${
          files.length + fileList.length
        } 个文件`
      );
    },
    beforeCodeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}?`);
    },
    handleCodeFileChange(file, fileList) {
      this.fileList = fileList;
    },
    handleCodeFileRemove(file, fileList) {
      this.fileList = fileList;
    },
  },
};
</script>

<style scoped>
.display {
  width: 100%;
}
.el-row {
  margin-top: 10px;
}
</style>
