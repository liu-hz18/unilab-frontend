<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/> -->
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
              <el-button style="margin-left: 10px;" round size="small" type="primary" icon="el-icon-download" @click="handleFileUpload">导出代码</el-button>
            </el-row>
            
            <el-row>
              <el-col :span="10">
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  multiple
                  :limit="20"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :before-upload="handleBeforeUpload"
                  :on-change="handleFileChange"
                  :on-exceed="handleExceed"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :http-request="httpRequest"
                  :file-list="fileList"
                  :auto-upload="false">
                  <el-button slot="trigger" type="primary" round size="small" icon="el-icon-folder-opened">选择文件</el-button>
                  <el-button style="margin-left: 10px;" round size="small" type="success" icon="el-icon-upload2" @click="handleFileUpload">提交文件</el-button>
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
              <el-button type="success" round size="small" icon="el-icon-magic-stick" @click="handleCodeSubmit">提交报告</el-button>
              <el-button style="margin-left: 10px;" round size="small" type="primary" icon="el-icon-download" @click="handleFileUpload">导出报告</el-button>
            </el-row>
            
            <el-row>
              <el-col :span="10">
                <el-upload
                  class="upload-markdown-demo"
                  ref="upload-markdown"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  multiple
                  :limit="20"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-remove="beforeRemove"
                  :auto-upload="false"
                  :on-change="handleFileChange"
                  :on-exceed="handleExceed"
                  :on-success="handleSuccess"
                  :on-error="handleError"
                  :http-request="httpRequest"
                  :file-list="fileList">
                  <el-button slot="trigger" type="primary" round size="small" icon="el-icon-folder-opened">选择文件</el-button>
                  <el-button style="margin-left: 10px;" round size="small" type="success" icon="el-icon-upload2" @click="handleFileUpload">提交文件</el-button>
                  <div slot="tip" class="el-upload__tip">大小不超过1MB</div>
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

export default {
  name: 'UniLab',
  components: {
    codemirror,
    MarkdownPro
  },
  data() {
    return {
      activeIndex: '1',
      activeIndex2: '1',
      code: '\n\n\n\n\n\n\n\n\n',
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
      fileList: [

      ],
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
    handleCodeSubmit() {
      console.log("code submit", this.code);
    },
    handleFileUpload() {
      console.log("file upload", this.fileList);
      if (this.fileList.length <= 0) {
        this.$message.warning('请选择文件上传')
        return false
      }
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
      console.log("remove", file, fileList);
    },
    handlePreview(file) {
      console.log("handlePreview", file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 20 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    handleBeforeUpload(file) {
      console.log(file)
    },
    beforeRemove(file) {
      console.log("beforeRemove", file);
      return this.$confirm(`确定移除 ${ file.name }?`);
    },
    handleSuccess(response, file, fileList) {
      console.log("handleSuccess", response, file, fileList);
    },
    handleError(err, file, fileList) {
      console.log("handleError", err, file, fileList);
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList;
    },
    httpRequest() {
      console.log(this.fileList);
      const formData = new FormData();
      formData.append('name', 'liuhz');
      formData.append('id', '2018011446');
      this.fileList.forEach(element => {
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
        if (res.code == 201) {
          this.$refs.upload.clearFiles();
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

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  color: #2c3e50;
  margin-top: 10px;
}
.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
</style>

