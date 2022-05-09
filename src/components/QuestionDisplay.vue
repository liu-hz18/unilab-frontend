<template>
    <div id="questionDisplay" style="min-width: 1100px;">
        <el-container>
            <el-header style="height: 70px;">
                <el-row>
                    <el-col :span="19" style="margin-top: 0px;">
                        <el-menu :default-active="activeIndex" class="course-menu" mode="horizontal" @select="handleSelect">
                            <el-menu-item index="0">
                                <i class="el-icon-s-home"></i>Home
                            </el-menu-item>
                            <el-menu-item index="1">本课程</el-menu-item>
                            <el-menu-item index="2">评测</el-menu-item>
                            <el-menu-item index="3">题库</el-menu-item>
                            <el-menu-item index="4" v-if="!isStudent()">发布公告</el-menu-item>
                            <el-menu-item index="5" v-if="!isStudent()">发布题目</el-menu-item>
                            <el-menu-item index="6" v-if="!isStudent()">发布作业</el-menu-item>
                        </el-menu>
                    </el-col>
                    <el-col :span="3" style="margin-top: 4px;">
                        <div class="grid-content bg-purple">
                        <h2 style="font-size: 16px; text-align: right; line-height:1.5; color: #909399;">Hello {{ username }} !</h2>
                        </div>
                    </el-col>
                    <el-col :span="1" :offset="1" style="margin-top: 5px;">
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
                                <h4 style="font-size: 15px; text-align: center; line-height:1.0; color=#909399;">Time: {{ issueTime }} &nbsp;&nbsp; Creator: {{ creator }}</h4>
                                <h4 style="font-size: 15px; text-align: center; line-height:1.0; color=#909399;">TimeLimit: {{ timeLimit }} ms  &nbsp;&nbsp; MemoryLimit: {{ memoryLimit }} MB</h4>
                                <h4 style="font-size: 15px; text-align: center; line-height:1.0; color=#909399;">Tag: {{ tag }}</h4>
                                <div class="detaildisplay">
                                <MarkdownPreview v-bind:initialValue="content" theme="oneDark"/>
                                </div>
                                <el-button type="text" icon="el-icon-download" @click="downloadAppendix" v-if="appendixPath!==''">点击下载附件</el-button>
                            </el-main>
                        </el-container>
                    </el-aside>

                    <el-main>
                        <el-row>
                            <el-col :span="8">
                                <div class="grid-content bg-purple">
                                    <el-select v-model="language" placeholder="">
                                        <el-option
                                            v-for="item in languageOptions"
                                            :key="item.key"
                                            :label="item.label"
                                            :value="item.value"
                                            :disabled="item.disabled">
                                        </el-option>
                                    </el-select>
                                </div>
                            </el-col>
                            <el-col :span="2" :offset="13">
                                <div class="grid-content bg-purple">
                                    <el-tooltip class="item" effect="dark" content="暂存代码" placement="bottom">
                                        <el-button icon="el-icon-document-checked" type="primary" circle plain @click="saveLocalCode"></el-button>
                                    </el-tooltip>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <h4 style="font-size: 15px; text-align: left; line-height:1.0; color=#909399;">{{ this.compileHint }}</h4>
                        </el-row>
                        <el-row>
                            <div class="unilabeditor">
                            <codemirror
                                v-model="code" 
                                :options="options"
                                ref="myEditor"
                                style="font-family: monospace; height: 420px;"
                            ></codemirror>
                            </div>
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
require('codemirror/addon/mode/simple.js')
require('codemirror/mode/clike/clike.js')
require('codemirror/mode/python/python.js')
require('codemirror/mode/go/go.js')
require('codemirror/mode/rust/rust.js')
require('codemirror/mode/javascript/javascript.js')

require('codemirror/addon/hint/show-hint.js')
require('codemirror/addon/hint/show-hint.css')
require('codemirror/addon/hint/javascript-hint.js')

require('codemirror/addon/comment/comment.js')
require('codemirror/addon/selection/active-line.js')

require('codemirror/addon/fold/foldgutter.css')
require('codemirror/addon/fold/foldcode.js')
require('codemirror/addon/fold/foldgutter.js')
require('codemirror/addon/fold/brace-fold.js')
require('codemirror/addon/fold/comment-fold.js')
require('codemirror/addon/fold/markdown-fold.js')
require('codemirror/addon/fold/xml-fold.js')
require('codemirror/addon/fold/indent-fold.js')

require('codemirror/addon/search/match-highlighter.js')

require('codemirror/addon/edit/matchbrackets.js')
require('codemirror/addon/edit/closebrackets.js')

import axios from "axios"
import saveAs from 'file-saver'
import { mapMutations } from 'vuex'
import { Message } from "element-ui"
import API from "@/axios/API.js"
import login from "@/axios/login.js"

const CodeGuide = {
    "none": "",
    "c": 
"\
#include <stdio.h>\n\
int main(){\n\
    // your code here...\n\
    return 0;\n\
}\n\
",
    "c++": 
"\
#include <iostream>\n\
using namespace std;\n\
int main() {\n\
    // your code here...\n\
    return 0;\n\
}\n\
",
    "java": 
"\
import java.util.Scanner;\n\
// 代码中必须存在一个 public class Main, 且不允许出现其他的public class\n\
public class Main {\n\
    // 必须以 main 函数为入口 \n\
    public static void main(String[] args) {\n\
        Scanner sc = new Scanner(System.in);\n\
        // your code here...\n\
        sc.close();\n\
    }\n\
}\n\
",
    "python2": 
"\
# 'a+b' code example\n\
s = raw_input().split()\n\
print int(s[0]) + int(s[1])\n\
",
    "python3": 
"\
# 'a+b' code example\n\
s = input().split()\n\
print(int(s[0])+int(s[1]))\n\
",
    "go": 
"\
// 包名必须为package main\n\
package main\n\
import \"fmt\"\n\
func main() {\n\
    // 'a+b' code example\n\
    var a, b int\n\
    fmt.Scanf(\"%d%d\", &a, &b)\n\
    fmt.Println(a+b)\n\
}\n\
",
    "rust": 
"\
use std::io;\n\
fn main(){\n\
    // 'a+b' code example\n\
    let mut input = String::new();\n\
    io::stdin().read_line(&mut input).unwrap();\n\
    let mut s = input.trim().split(' ');\n\
    let a:i32 = s.next().unwrap().parse().unwrap();\n\
    let b:i32 = s.next().unwrap().parse().unwrap();\n\
    println!(\"{}\",a+b);\n\
}\n\
",
    "js":
"\
// 'a+b' code example\n\
// attention: \n\
// methods to read stdin like `require('fs').readFileSync('/dev/stdin')` only work on Unix Systems.\n\
// more generally, if you want to read line by line, use: \n\
const rl = require('readline').createInterface({ \n\
        input: process.stdin, \n\
        output: process.stdout \n\
}); \n\
rl.on('line', function(line){ \n\
   var nums = line.split(' '); \n\
    console.log(parseInt(nums[0]) + parseInt(nums[1])); \n\
});\n\
",
}

const compileOptions = {
    "none": "",
    "c": "gcc main.c -DONLINE_JUDGE -lm -Wall -O2 -o main.exe",
    "c++11": "g++ main.cpp -DONLINE_JUDGE -lm -Wall -O2 -std=c++11 -o main.exe",
    "c++14": "g++ main.cpp -DONLINE_JUDGE -lm -Wall -O2 -std=c++14 -o main.exe",
    "c++17": "g++ main.cpp -DONLINE_JUDGE -lm -Wall -O2 -std=c++17 -o main.exe",
    "c++20": "g++ main.cpp -DONLINE_JUDGE -lm -Wall -O2 -std=c++20 -o main.exe",
    "python2": "python2.7 -E -s -B -m py_compile main.py",
    "python3": "python3.10 -I -B -m py_compile main.py",
    "java8": "javac -encoding UTF-8 Main.java",
    "java11": "javac -encoding UTF-8 Main.java",
    "java14": "javac -encoding UTF-8 Main.java",
    "java17": "javac -encoding UTF-8 Main.java",
    "rust": "rustc main.rs -O -o main.exe",
    "go": "go build -ldflags=\"-s -w\" -o main.exe main.go",
    "js": "node main.js",
}

export default {
    name: 'UniLabQuestionDisplay',
    components: {
        MarkdownPreview,
        codemirror,
    },
    inject: ['reload'],
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
            languagetype: "none",
            mode: 'text/x-c++src',

            creator: "",
            testCaseNum: 0,

            code: "",
            languageOptions: [
                {key: "c", value: 'c', label: 'C', disabled: false, lint: "text/x-csrc", type:"c"},
                {key: "c++11", value: 'c++11', label: 'C++ 11', disabled: false, lint: "text/x-c++src", type:"c++"},
                {key: "c++14", value: 'c++14', label: 'C++ 14', disabled: false, lint: "text/x-c++src", type:"c++"},
                {key: "c++17", value: 'c++17', label: 'C++ 17', disabled: false, lint: "text/x-c++src", type:"c++"},
                {key: "c++20", value: 'c++20', label: 'C++ 20', disabled: false, lint: "text/x-c++src", type:"c++"},
                {key: "python2", value: 'python2', label: 'Python 2.7', disabled: false, lint: "text/x-python", type:"python2"}, 
                {key: "python3", value: 'python3', label: 'Python 3.10', disabled: false, lint: "text/x-python", type:"python3"},
                {key: "java8", value: 'java8', label: 'Java 8', disabled: false, lint: "text/x-java", type:"java"},
                {key: "java11", value: 'java11', label: 'Java 11', disabled: false, lint: "text/x-java", type:"java"},
                {key: "java14", value: 'java14', label: 'Java 14', disabled: false, lint: "text/x-java", type:"java"},
                {key: "java17", value: 'java17', label: 'Java 17', disabled: false, lint: "text/x-java", type:"java"},
                {key: "rust", value: 'rust', label: 'Rust', disabled: false, lint: "text/x-rustsrc", type:"rust"},
                {key: "go", value: 'go', label: 'Go', disabled: false, lint: "text/x-go", type:"go"},
                {key: "js", value: 'js', label: 'JavaScript', disabled: false, lint: "text/javascript", type:"js"},   
            ],
            exportFileNames: {
                'text/x-csrc': "main.c",
                'text/x-c++src': "main.cpp",
                'text/x-java': "Main.java",
                'text/x-go': "main.go",
                "text/x-python": "main.py",
                "text/javascript": "main.js",
                "text/x-rustsrc": "main.rs",
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
                lineWrapping: false,
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
                // 代码折叠
                gutters: [
                    "CodeMirror-lint-markers",
                    "CodeMirror-linenumbers",
                    "CodeMirror-foldgutter"
                ],
                foldGutter: true, // 启用行槽中的代码折叠
                // 选中的单词相同均高亮  
                highlightSelectionMatches: {
                    minChars: 2,
                    trim: true,
                    style: "matchhighlight",
                    showToken: false,
                },
                autoCloseBrackets: true, // 自动闭合符号
                matchBrackets: true, // 在光标点击紧挨{、]括号左、右侧时，自动突出显示匹配的括号 }、]
            }
        },
        compileHint() {
            return compileOptions[this.language] ? "编译选项: " + compileOptions[this.language] : "";
        }
    },
    methods: {
        ...mapMutations([
            'CHANGE_LOCALSTORAGE_ON_LOGOUT',
        ]),
        handleSelect(key, keyPath) {
            this.selectIndex = key.toString();
            if (this.selectIndex === "0") {
                this.$router.push({ path: "/home", query: {  } });
            } else {
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
                    method: API.FETCH_COURSE_NAME.method,
                    url: API.FETCH_COURSE_NAME.url,
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
                        // this.$router.replace("/login")
                        login();
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
                    method: API.FETCH_QUESTION_DETAIL.method,
                    url: API.FETCH_QUESTION_DETAIL.url,
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
                    this.language = res.data.data.result.Language.toLowerCase()
                    this.creator = res.data.data.result.Creator
                    this.testCaseNum = res.data.data.result.TestCaseNum
                    this.tag = res.data.data.result.Tag
                    this.languageOptions.forEach(language => {
                        if (language.key.toLowerCase() === this.language) {
                            language.disabled = false
                            this.mode = language.lint
                            this.languagetype = language.type
                            if (this.languagetype === localStorage.getItem('Language')) {
                                this.code = localStorage.getItem('Code') ? localStorage.getItem('Code') : CodeGuide[this.languagetype];
                            } else {
                                this.code = CodeGuide[this.languagetype]
                            }
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
                        // this.$router.replace("/login")
                        login();
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
                method: API.FETCH_QUESTION_APPENDIX.method,
                url: API.FETCH_QUESTION_APPENDIX.url,
                responseType: "blob",
                data: formData,
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
                if (err.response.status === 401) {
                    this.CHANGE_LOCALSTORAGE_ON_LOGOUT()
                    Message.error("UNAUTHORIZED: 请重新登录")
                    // this.$router.replace("/login")
                    login();
                } else {
                    Message.error("获取附件失败")
                    console.log(err)
                    this.$router.replace("/404")
                }
            })
        },
        // code file functions
        handleCodeFileDownload() {
            if (this.code === "") {
                Message.warning("请编辑代码后再导出！")
                return
            }
            let str = new Blob([this.code], {
                type: 'text/plain; charset=utf-8'
            })
            saveAs(str, this.exportFileNames[this.mode])
        },
        handleCodeSubmit() {
            if (this.code === "") {
                Message.warning("请编辑代码后再提交！")
                return
            }
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
            formData.append('language', this.language);
            formData.append('file', file);
            axios({
                method: API.SUBMIT_CODE.method,
                url: API.SUBMIT_CODE.url,
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
            if (this.fileList.length <= 0) {
                return this.$message.warning('请选择文件上传')
            }
            const formData = new FormData();
            formData.append('courseid', this.courseid);
            formData.append('questionid', this.questionID);
            formData.append('language', this.language);
            this.fileList.forEach(element => {
                const filesize = element.size / 1024 / 1024;
                if (filesize > 5.0) {
                    return this.$message.warning('单个文件大小不能超过5MB!')
                }
                console.log(element.raw);
                formData.append('file', element.raw);
            })
            axios({
                method: API.SUBMIT_CODE.method,
                url: API.SUBMIT_CODE.url,
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
            login();
        },
        isStudent() {
            return (localStorage.getItem("Permission") === "0");
        },
        saveLocalCode() {
            localStorage.setItem("Code", this.code)
            localStorage.setItem("Language", this.languagetype)
            this.$store.state.Code = this.code
            this.$store.state.Language = this.languagetype
        },
        // Ctrl+S 自动保存
        keyDownHandler(e) {
            var key = window.event.keyCode ? window.event.keyCode : window.event.which
            if (key === 83 && e.ctrlKey) {
                this.saveLocalCode()
                e.preventDefault()
            }
        },
    },
    mounted() {
        document.addEventListener('keydown', this.keyDownHandler)
    },
    beforeDestroy() {
        document.removeEventListener('keydown', this.keyDownHandler)
    },
}
</script>

<style scoped>
.display {
    width: 100%;
}
.el-row {
    margin-top: 10px;
}
.CodeMirror {
    height: auto;
}
</style>
