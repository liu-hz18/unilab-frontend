<template>
    <div id="questionDisplay">
        <el-container>
            <el-header>
                <el-row>
                    <el-col :span="19">
                        <el-menu :default-active="activeIndex" class="course-menu" mode="horizontal" @select="handleSelect">
                            <el-menu-item index="0">
                                <i class="el-icon-s-home"></i>Home
                            </el-menu-item>
                            <el-menu-item index="1">本课程</el-menu-item>
                            <el-menu-item index="2">评测</el-menu-item>
                            <el-menu-item index="3">题库</el-menu-item>
                            <el-menu-item index="4">发布公告</el-menu-item>
                            <el-menu-item index="5">发布题目</el-menu-item>
                            <el-menu-item index="6">发布作业</el-menu-item>
                        </el-menu>
                    </el-col>
                    <el-col :span="3" style="margin-top: 9px;">
                        <div class="grid-content bg-purple">
                        <h2 style="font-size: 16px; text-align: right; line-height:1.5; color: #909399;">Hello {{ username }} !</h2>
                        </div>
                    </el-col>
                    <el-col :span="1" :offset="1" style="margin-top: 13px;">
                        <div class="grid-content bg-purple">
                        <el-tooltip class="item" effect="dark" content="退出登录" placement="top-start">
                            <el-button icon="el-icon-switch-button" circle @click="handleLogOut"></el-button>
                        </el-tooltip>
                        </div>
                    </el-col>
                </el-row>
            </el-header>
            
            <div class="display">
                <el-container style="height: 630px; border: 1px solid #eee">
                    <el-aside width="50%">
                        <el-container>
                            <el-header>
                                <h1 style="font-size: 25px; text-align: center; line-height:1.7;">{{ title }}</h1>
                            </el-header>
                            <el-main>
                                <MarkdownPreview v-bind:initialValue="content" theme="oneDark"/>
                            </el-main>
                        </el-container>
                    </el-aside>

                    <el-main>
                        <el-row>
                            <el-select v-model="mode" placeholder="C++">
                                <el-option
                                    v-for="item in languageOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-row>
                        <el-row>
                            <codemirror 
                                v-model="code" 
                                :options="options"
                                ref="myEditor"
                                @change="codeChangeMethod"
                                style="font-family: monospace; height: 420px;"
                            ></codemirror>
                        </el-row>
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
                    </el-main>
                </el-container>
            </div>
            
        </el-container>
    </div>
</template>


<script>
import { MarkdownPreview } from 'vue-meditor'

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

import axios from "axios"
import saveAs from 'file-saver'
import { mapMutations } from 'vuex'

const questionDesctriptionContent = "##  题目描述 \n\
\n\
##  输入样例 \n\
\n\
``` \n\
\n\
``` \n\
##  输出样例 \n\
\n\
``` \n\
\n\
``` \n\
##  数据范围与约定 \n\
##  提示 \n\
##  评分标准 \n\
##  评分标准 \n\
##  评分标准 \n\
##  评分标准 \n\
##  评分标准 \n\
##  评分标准 \n\
##  评分标准 \
";

export default {
    name: 'UniLabQuestionDisplay',
    components: {
        MarkdownPreview,
        codemirror,
    },
    data() {
        return {
            username: this.$store.state.UserName || 'unknown',
            activeIndex: '1', // '1' for later push
            selectIndex: '1',
            title: "题目 1",
            content: questionDesctriptionContent,
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
        }
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
        ...mapMutations([
            'CHANGE_LOCALSTORAGE_ON_LOGOUT',
        ]),
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
            this.selectIndex = key.toString();
            if (this.selectIndex === "0") {
                console.log("handleSelect() jump to /home", this.selectIndex);
                this.$router.push({ path: "/home", query: {  } });
            } else {
                console.log("handleSelect() jump to /ojlab", this.selectIndex);
                this.$router.push({ path: "/ojlab", query: { tabindex: this.selectIndex } });
            }
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
        handleLogOut() {
            this.CHANGE_LOCALSTORAGE_ON_LOGOUT()
            this.$router.push("/login")
        }
    }
}
</script>


<style scoped lang="less">
.display {
    width: 100%;
}
.el-row {
    margin-bottom: 10px;
    &:last-child {
        margin-bottom: 0;
    }
}
</style>

