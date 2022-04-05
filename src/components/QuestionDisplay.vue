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
                                <h4 style="font-size: 14px; text-align: center; line-height:1.0; color=#909399;">Time: {{ issueTime }} &nbsp;&nbsp; Creator: {{ creator }}</h4>
                                <h4 style="font-size: 14px; text-align: center; line-height:1.0; color=#909399;">Tag: {{ tag }}</h4>
                                <MarkdownPreview v-bind:initialValue="content" theme="oneDark"/>
                                <el-button type="text" icon="el-icon-download" @click="downloadAppendix" v-if="appendixPath!==''">点击下载附件</el-button>
                            </el-main>
                        </el-container>
                    </el-aside>

                    <el-main>
                        <el-row>
                            <el-select v-model="mode" placeholder="">
                                <el-option
                                    v-for="item in languageOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    :disabled="item.disabled">
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
import { Message } from "element-ui"

export default {
    name: 'UniLabQuestionDisplay',
    components: {
        MarkdownPreview,
        codemirror,
    },
    data() {
        return {
            activeIndex: '1', // '1' for later push
            selectIndex: '1',

            username: this.$store.state.UserName || 'unknown',
            courseid: this.initCourseID(),
            courseName: "",

            questionID: this.initQuestionID(),
            title: "题目",
            issueTime: "发布时间",
            content: "",
            tag: "",
            appendixPath: "",
            memoryLimit: 0,
            timeLimit: 0,
            language: "",
            creator: "",
            testCaseNum: 0,

            code: '',
            mode: 'text/x-c++src',
            languageOptions: [
                {value: 'text/x-csrc', label: 'C', disabled: false},
                {value: 'text/x-c++src', label: 'C++', disabled: false},
                {value: 'text/x-java', label: 'Java', disabled: false},
                {value: 'text/x-go', label: 'Go', disabled: false},
                {value: 'text/x-python', label: 'Python', disabled: false}, 
                {value: 'text/javascript', label: 'JavaScript', disabled: false}, 
                {value: 'text/x-rustsrc', label: 'Rust', disabled: false},
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
            languageMap: {
                'text/x-csrc': "c",
                'text/x-c++src': "c++",
                'text/x-java': "java",
                'text/x-go': "go",
                "text/x-python": "python",
                "text/javascript": "javascript",
                "text/x-rustsrc": "rust",
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
                this.$router.push({ path: "/ojlab", query: { tabindex: this.selectIndex, courseid: this.courseid } });
            }
        },
        isNumber(val){
            var regPos = /^[0-9]+.?[0-9]*/; //判断是否是数字。
            if (regPos.test(val) ) {
                return true;
            } else {
                return false;
            }
        },
        initCourseID() {
            if (this.$route.query.courseid === null || this.isNumber(this.$route.query.courseid) === false) {
                this.$router.replace({path: "/404"})
                return 0;
            } else {
                this.courseid = this.$route.query.courseid
                axios({
                    method: 'get',
                    url: "http://localhost:1323/student/fetch-course-name",
                    params: {
                        courseid: this.courseid,
                    },
                    headers: {
                        'Authorization': localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : ""
                    }
                }).then(res => {
                    console.log(res.data)
                    if (res.status === 200 && res.data.code === 200) {
                        this.courseName = res.data.data.result
                        Message.success("获取课程信息成功")
                    } else {
                        this.$router.replace("/404")
                        Message.error("获取课程信息失败")
                    }
                }).catch(err => {
                    if (err.response.status === 401) {
                        this.CHANGE_LOCALSTORAGE_ON_LOGOUT()
                        Message.error("UNAUTHORIZED: 请重新登录")
                        this.$router.replace("/login")
                    } else {
                        Message.error("获取课程列表失败")
                        console.log(err)
                        this.$router.replace("/404")
                    }
                })
                return this.$route.query.courseid
            }
        },
        initQuestionID() {
            if (this.$route.query.id === null || this.isNumber(this.$route.query.id) === false) {
                this.$router.replace({path: "/404"})
                return 0;
            } else {
                this.questionID = this.$route.query.id
                axios({
                    method: "get",
                    url: "http://localhost:1323/student/fetch-question-detail",
                    params: {
                        questionid: this.questionID,
                    },
                    headers: {
                        'Authorization': localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : ""
                    }
                }).then(res => {
                    console.log(res.data)
                    this.title = res.data.data.result.Title
                    this.issueTime = res.data.data.result.IssueTime
                    this.content = res.data.data.result.Content
                    this.appendixPath = res.data.data.result.AppendixFile
                    this.memoryLimit = res.data.data.result.MemoryLimit
                    this.timeLimit = res.data.data.result.TimeLimit
                    this.language = res.data.data.result.Language
                    this.creator = res.data.data.result.Creator
                    this.testCaseNum = res.data.data.result.TestCaseNum
                    this.tag = res.data.data.result.Tag
                    this.languageOptions.forEach(language => {
                        if (language.label.toLowerCase() === this.language.toLowerCase()) {
                            language.disabled = false
                            this.mode = language.value
                        } else {
                            language.disabled = true
                        }
                    })
                    console.log(this.appendixPath)
                    Message.success("获取题目信息成功")
                }).catch(err => {
                    if (err.response.status === 401) {
                        this.CHANGE_LOCALSTORAGE_ON_LOGOUT()
                        Message.error("UNAUTHORIZED: 请重新登录")
                        this.$router.replace("/login")
                    } else {
                        Message.error("获取课程信息失败")
                        console.log(err)
                        this.$router.replace("/404")
                    }
                })
                return this.$route.query.id
            }
        },
        downloadAppendix() {
            const formData = new FormData();
            formData.append("path", this.appendixPath)
            axios({
                method: "post",
                url: "http://localhost:1323/student/fetch-question-appendix",
                responseType: "blob",
                data: formData
            }).then(res => {
                console.log(res.data)
                let blob = new Blob([res.data], { type: "application/zip" })
                let a = document.createElement("a")
                console.log(res.headers)
                let fileName = "appendix.zip"
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    // IE
                    window.navigator.msSaveBlob(blob, fileName);
                } else {
                    // 非IE
                    a.setAttribute("download", fileName);
                }
                a.href = window.URL.createObjectURL(blob)
                a.download = decodeURI(fileName);
                console.log(a.href)
                document.body.appendChild(a)
                a.click()
                window.URL.revokeObjectURL(a.href)
                document.body.removeChild(a)
            }).catch(err => {
                console.log(err)
                // if (err.response.status === 401) {
                //     this.CHANGE_LOCALSTORAGE_ON_LOGOUT()
                //     Message.error("UNAUTHORIZED: 请重新登录")
                //     this.$router.replace("/login")
                // } else {
                //     Message.error("获取附件失败")
                //     console.log(err)
                //     this.$router.replace("/404")
                // }
            })
        },
        codeChangeMethod() {
            console.log(this.code, this.mode);
        },
        // code file functions
        handleCodeFileDownload() {
            console.log("code download", this.code);
            let str = new Blob([this.code], {
                type: 'text/plain; charset=utf-8'
            })
            saveAs(str, this.exportFileNames[this.mode])
        },
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
            formData.append('courseid', this.courseid);
            formData.append('questionid', this.questionID);
            formData.append('language', this.languageMap[this.mode]);
            formData.append('file', file);
            axios({
                method: 'post',
                url: 'http://localhost:1323/student/submit-code',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: formData,
            }).then(res => {
                console.log(res);
                if (res.status === 200 && res.data.code === 200) {
                    Message.success("代码提交成功")
                } else {
                    Message.error("代码提交失败")
                }
            }).catch(err => { // 请求失败处理
                console.log(err);
                Message.error("代码提交失败");
            });
        },
        handleCodeFileUpload() {
            console.log("file upload", this.fileList);
            if (this.fileList.length <= 0) {
                return this.$message.warning('请选择文件上传')
            }
            const formData = new FormData();
            formData.append('courseid', this.courseid);
            formData.append('questionid', this.questionID);
            formData.append('language', this.languageMap[this.mode]);
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
                url: 'http://localhost:1323/student/submit-code',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                data: formData,
            }).then(res => {
                console.log(res);
                if (res.status === 200 && res.data.code === 200) {
                    this.$refs.upload.clearFiles();
                    this.fileList = []
                    Message.success("文件提交成功");
                } else {
                    Message.error("文件提交失败");
                }
            }).catch(function (error) { // 请求失败处理
                console.log(error);
                Message.error("文件提交失败");
            });
        },
        handleCodeExceed(files, fileList) {
            this.$message.warning(`当前限制选择 20 个文件，本次共选择了 ${files.length + fileList.length} 个文件`);
        },
        beforeCodeRemove(file) {
            console.log("beforeRemove", file);
            return this.$confirm(`确定移除 ${ file.name }?`);
        },
        handleCodeFileChange(file, fileList) {
            this.fileList = fileList;
        },
        handleCodeFileRemove(file, fileList) {
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

