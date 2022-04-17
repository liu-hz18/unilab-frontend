<template>
  <div id="editor" style="min-width: 1100px;">
    <el-container>
    
      <el-header>
        <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
          <el-menu-item index="1">我的课程</el-menu-item>
          <el-submenu index="2">
            <template slot="title">已结束课程</template>
            <el-menu-item index="2-1">选项1</el-menu-item>
            <el-menu-item index="2-2">选项2</el-menu-item>
            <el-menu-item index="2-3">选项3</el-menu-item>
            <el-submenu index="2-4">
              <template slot="title">选项4</template>
              <el-menu-item index="2-4-1">选项1</el-menu-item>
              <el-menu-item index="2-4-2">选项2</el-menu-item>
              <el-menu-item index="2-4-3">选项3</el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-menu-item index="4"><a href="https://learn.tsinghua.edu.cn/f/login" target="_blank">网络学堂</a></el-menu-item>
        </el-menu>
      </el-header>

      <el-container>
        <el-aside width="200px">
          <el-menu
            default-active="1"
            @select="handleMenuSelect"
            class="el-menu-vertical-demo">

            <el-menu-item index="1">
              <template slot="title">
                <i class="el-icon-s-opportunity"></i>
                <span>代码编辑</span>
              </template>
              <!-- <el-menu-item-group>
                <template slot="title">分组一</template>
                <el-menu-item index="1-1">选项1</el-menu-item>
                <el-menu-item index="1-2">选项2</el-menu-item>
              </el-menu-item-group>
              <el-menu-item-group title="分组2">
                <el-menu-item index="1-3">选项3</el-menu-item>
              </el-menu-item-group>
              <el-submenu index="1-4">
                <template slot="title">选项4</template>
                <el-menu-item index="1-4-1">选项1</el-menu-item>
              </el-submenu> -->
            </el-menu-item>
            <el-menu-item index="2">
              <i class="el-icon-menu"></i>
              <span slot="title">markdown编辑</span>
            </el-menu-item>
            <el-menu-item index="3" disabled>
              <i class="el-icon-document"></i>
              <span slot="title">实验</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        

        <el-container v-if="selectModule==1">
          <el-header>
            <el-select v-model="mode" placeholder="C++">
              <el-option
                v-for="item in languageOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-header>
          <el-main>
            <codemirror 
              v-model="code" 
              :options="options"
              ref="myEditor"
              @change="codeChangeMethod"
            ></codemirror>
          </el-main>

          <el-footer>
            <el-row>
              <el-button type="success" round size="small" icon="el-icon-magic-stick" @click="handleCodeSubmit">提交代码</el-button>
              <el-button style="margin-left: 10px;" round size="small" type="primary" icon="el-icon-download" @click="handleCodeFileDownload">导出代码</el-button>
            </el-row>
            
            <el-row>
              <el-col :span="10">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  multiple
                  :limit="20"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handleCodePreview"
                  :on-remove="handleCodeRemove"
                  :before-remove="beforeCodeRemove"
                  :before-upload="handleBeforeCodeUpload"
                  :on-change="handleCodeFileChange"
                  :on-exceed="handleCodeExceed"
                  :on-success="handleCodeSuccess"
                  :on-error="handleCodeError"
                  :file-list="fileList"
                  :auto-upload="false">
                  <el-button slot="trigger" type="primary" round size="small" icon="el-icon-folder-opened">选择文件</el-button>
                  <el-button style="margin-left: 10px;" round size="small" type="success" icon="el-icon-upload2" @click="handleCodeFileUpload">提交文件</el-button>
                  <div slot="tip" class="el-upload__tip">大小不超过1MB</div>
                </el-upload>
                <!-- <el-button type="primary" round icon="el-icon-folder-opened" @click="handleFileUpload">上传文件</el-button> -->
              </el-col>
            </el-row>
          </el-footer>
        </el-container>

        <el-container v-else-if="selectModule==2">
          <el-main>
            <MarkdownPro 
              v-model="markdownContent"
              :height="450"
              :theme="gitHub"
            ></MarkdownPro>
          </el-main>
          <el-footer>
            <el-row>
              <el-button type="success" round size="small" icon="el-icon-magic-stick" @click="handleMarkdownSubmit">提交报告</el-button>
              <el-button style="margin-left: 10px;" round size="small" type="primary" icon="el-icon-download" @click="handleMarkdownFileDownload">导出报告</el-button>
            </el-row>
            
            <el-row>
              <el-col :span="10">
                <el-upload
                  class="upload-markdown-demo"
                  ref="upload-markdown"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  accept=".md, .pdf"
                  :limit="1"
                  :multiple="false"
                  :on-preview="handleMarkdownPreview"
                  :on-remove="handleMarkdownRemove"
                  :before-remove="beforeMarkdownRemove"
                  :auto-upload="false"
                  :on-change="handleMarkdownFileChange"
                  :on-exceed="handleMarkdownExceed"
                  :on-success="handleMarkdownSuccess"
                  :on-error="handleMarkdownError"
                  :file-list="markdownList">
                  <el-button slot="trigger" type="primary" round size="small" icon="el-icon-folder-opened">选择文件</el-button>
                  <el-button style="margin-left: 10px;" round size="small" type="success" icon="el-icon-upload2" @click="handleMarkdownFileUpload">提交文件</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传md/pdf文件, 且大小不超过10MB</div>
                </el-upload>
              </el-col>
            </el-row>
          </el-footer>
        </el-container>

      </el-container>

    </el-container>
  </div>
</template>


<script>
// TODO: auth login, user database, course list page, hw list page, question list page, question detail/edit page, announcements detail/edit page
// import HelloWorld from './components/HelloWorld.vue'
import { codemirror } from 'vue-codemirror-lite'
import 'codemirror/mode/clike/clike.js'
import 'codemirror/mode/python/python.js'
import 'codemirror/mode/rust/rust.js'
import 'codemirror/mode/go/go.js'


import 'codemirror/addon/hint/show-hint.js'
import 'codemirror/addon/hint/show-hint.css'
import 'codemirror/addon/hint/javascript-hint.js'

import 'codemirror/addon/selection/active-line'
import 'codemirror/theme/monokai.css'
import 'codemirror/theme/3024-day.css'

import { MarkdownPro } from 'vue-meditor'
import axios from "axios"

import { saveAs } from 'file-saver'

export default {
  name: 'UniLabEditor',
  components: {
    codemirror,
    MarkdownPro
  },
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      code: '',
      mode: 'text/x-c++src',
      languageOptions: [
        {value: 'text/x-csrc', label: 'C'},
        {value: 'text/x-c++src', label: 'C++'},
        {value: 'text/x-java', label: 'Java'},
        {value: 'text/x-go', label: 'Go'},
        {value: 'text/x-python', label: 'Python'}, 
        {value: 'text/javascript', label: 'JavaScript'}, 
        {value: 'text/x-rustsrc', label: 'Rust'},
      ],
      exportFileNames: {
        'text/x-csrc': "main.c",
        'text/x-c++src': "main.cpp",
        'text/x-java': "main.java",
        'text/x-go': "main.go",
        "text/x-python": "main.py",
        "text/javascript": "main.js",
        "text/x-rustsrc": "main.rs"
      },
      fileList: [],
      markdownList: [],
      selectModule: 1,
      markdownContent: ''
    };
  },
  computed: {
    editor() {
      // get current editor object
      return this.$refs.myEditor.editor
    },
    options() {
      return {
        mode: this.mode,
        tabSize: 4,
        indentUnit: 4,
        lineNumbers: true,
        lineWrapping: true,
        viewportMargin: Infinity,
        extraKeys: {
          'Ctrl-Space': 'autocomplete',
          'Tab': function(cm) { // replace tab with 4 spaces
            var spaces = Array(cm.getOption("indentUnit") + 1).join(" ");
            cm.replaceSelection(spaces);
          }
        },
        autoRefresh: true,
        styleActiveLine: true,
      }
    }
  },
  methods: {
    handleMenuSelect(index, indexPath) {
      console.log(index, indexPath);
      this.selectModule = index;
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    codeChangeMethod() {
      console.log(this.code, this.mode);
    },

    // code file functions
    handleCodeSubmit() {
      console.log("code submit", this.code);
      let str = new Blob([this.code], {
        type: 'text/plain; charset=utf-8'
      })
      let file = new File([str], this.exportFileNames[this.mode], {
        type: 'text/plain',
      });
      console.log(file, file.raw);
      const formData = new FormData();
      formData.append('name', 'liuhz');
      formData.append('id', '2018011446');
      formData.append('file', file);
      axios({
        method: 'post',
        url: 'http://localhost:1323/codeupload',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success("提交成功");
        } else {
          this.$message.error("提交失败");
        }
      }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    },
    handleCodeFileDownload() {
      console.log("code download", this.code);
      let str = new Blob([this.code], {
        type: 'text/plain; charset=utf-8'
      })
      saveAs(str, this.exportFileNames[this.mode])
    },
    handleCodeFileUpload() {
      console.log("file upload", this.fileList);
      if (this.fileList.length <= 0) {
        return this.$message.warning('请选择文件上传')
      }
      const formData = new FormData();
      formData.append('name', 'liuhz');
      formData.append('id', '2018011446');
      this.fileList.forEach(element => {
        const filesize = element.size / 1024 / 1024;
        if (filesize > 5.0) {
          return this.$message.warning('单个文件大小不能超过5MB!')
        }
        console.log(element.raw);
        formData.append('file', element.raw);
      })
      axios({
        method: 'post',
        url: 'http://localhost:1323/codeupload',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$refs.upload.clearFiles();
          this.fileList = []
          this.$message.success("上传成功");
        } else {
          this.$message.error("上传失败");
        }
      }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    },
    handleCodeRemove(file, fileList) {
      this.fileList = fileList;
      console.log("remove", file, fileList);
    },
    handleCodePreview(file) {
      console.log("handlePreview", file);
    },
    handleCodeExceed(files, fileList) {
      this.$message.warning(`当前限制选择 20 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleBeforeCodeUpload(file) {
      console.log(file)
    },
    beforeCodeRemove(file) {
      console.log("beforeRemove", file);
      return this.$confirm(`确定移除 ${ file.name }?`);
    },
    handleCodeSuccess(response, file, fileList) {
      console.log("handleSuccess", response, file, fileList);
    },
    handleCodeError(err, file, fileList) {
      console.log("handleError", err, file, fileList);
    },
    handleCodeFileChange(file, fileList) {
      this.fileList = fileList;
    },

    // markdown files funtions
    handleMarkdownSubmit() {
      console.log("markdown submit", this.markdownContent);
      let str = new Blob([this.markdownContent], {
        type: 'text/plain; charset=utf-8'
      })
      let file = new File([str], "report.md", {
        type: 'text/plain',
      });
      console.log(file, file.raw);
      const formData = new FormData();
      formData.append('name', 'liuhz');
      formData.append('id', '2018011446');
      formData.append('file', file);
      axios({
        method: 'post',
        url: 'http://localhost:1323/codeupload',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$message.success("提交成功");
        } else {
          this.$message.error("提交失败");
        }
      }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    },
    handleMarkdownFileDownload() {
      console.log("markdown download", this.markdownContent);
      let str = new Blob([this.markdownContent], {
        type: 'text/plain; charset=utf-8'
      })
      saveAs(str, "report.md")
    },
    handleMarkdownPreview(file) {
      console.log("markdown handlePreview", file);
    },
    handleMarkdownRemove(file, fileList) {
      this.markdownList = fileList;
    },
    beforeMarkdownRemove(file) {
      console.log("markdown beforeRemove", file);
      return this.$confirm(`确定移除 ${ file.name }?`);
    },
    handleMarkdownFileChange(file, fileList) {
      this.markdownList = fileList;
    },
    handleMarkdownExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleMarkdownSuccess(response, file, fileList) {
      console.log("markdown handleSuccess", response, file, fileList);
    },
    handleMarkdownError(err, file, fileList) {
      console.log("markdown handleError", err, file, fileList);
    },
    handleMarkdownFileUpload() {
      console.log("markdown upload", this.markdownList);
      if (this.markdownList.length <= 0) {
        return this.$message.warning('请选择文件上传')
      }
      const formData = new FormData();
      formData.append('name', 'liuhz');
      formData.append('id', '2018011446');
      this.markdownList.forEach(element => {
        const filesize = element.size / 1024 / 1024;
        if (filesize > 10.0) {
          return this.$message.warning('单个文件大小不能超过10MB!')
        }
        console.log(element.raw);
        formData.append('file', element.raw);
      })
      axios({
        method: 'post',
        url: 'http://localhost:1323/codeupload',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
      }).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.$refs.upload.clearFiles();
          this.markdownList = []
          this.$message.success("上传成功");
        } else {
          this.$message.error("上传失败");
        }
      }).catch(function (error) { // 请求失败处理
        console.log(error);
      });
    }
  },
  mounted() {
    // use editor object...
    this.editor.focus()
    console.log('this is current editor object', this.editor)
  }
}
</script>

<style scoped>
.el-row {
  margin-bottom: 10px;
}
.CodeMirror {
  font-family: monospace;
  height: 420px;
}
</style>
