<template>
    <div id="coursepage">

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

            <!-- course homepage -->
            <el-container v-if="selectIndex=='1'">
                <!-- course announcements -->
                <el-aside width="400px">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>课程公告</span>
                        </div>
                        <el-link type="primary" v-for="(announcement, index) in announcementList" :key="announcement.id" class="text-item" :underline="false" @click="handleAnnouncementClick(index, announcement)" style="width: 100%; text-align: left; justify-content: left; font-size: 17px; margin-bottom: 3px;">
                         {{ announcement.title }}  
                        </el-link>
                    </el-card>
                </el-aside>
                <!-- course assignments -->
                <el-main>
                    <el-collapse v-model="activeNames" @change="handleChange">
                        <el-collapse-item v-for="(assignment, index) in assignmentsInfo" 
                            v-bind:key="index" 
                                  :name="index"
                            style="margin-left: 10px;"
                        >
                            <template slot="title">
                                <span style="width: 200px; text-align: left; margin-left: 0px;">{{ assignment.assignmentName }}</span>
                                <el-tag :type="assignment.score == assignment.totalScore ? 'success' : ( assignment.score >= 0.6*assignment.totalScore ? 'warning' : 'danger')" effect="dark" style="width: 80px; text-align: center; margin-left: 0px;">
                                        {{ assignment.score + "/" +  assignment.totalScore }}
                                </el-tag>
                                <span style="margin-left: 300px; text-align: left;">截止时间：{{ assignment.dueTime }}</span>
                                <el-tag :type="assignment.dueState ? 'info' : 'success'" effect="dark" style="width: 80px; text-align: center; margin-left: 20px;">
                                        {{ assignment.dueState ? '已结束' : '可提交' }}
                                </el-tag>
                            </template>
                            <div style="text-align: left;"> 说明: {{ assignment.description }} </div>
                            <el-table
                                :data="assignment.questions"
                                stripe
                                :show-header="false"
                                @row-click="handleAssignmentQuestionRowClick"
                                style="width: 100%; margin-right: 20px;">
                                <el-table-column
                                    label="state"
                                    width="100">
                                    <template slot-scope="scope">
                                        <el-tag :type="scope.row.score == scope.row.totalScore ? 'success' : ( scope.row.score >= 0.6*scope.row.totalScore ? 'warning' : 'danger')" effect="dark" style="width: 80px; text-align: center;">
                                            {{ scope.row.score + "/" + scope.row.totalScore }}
                                        </el-tag>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="questionName"
                                    label="name">
                                </el-table-column>
                                <el-table-column
                                    prop="tag"
                                    label="tag"
                                    align="right">
                                </el-table-column>
                            </el-table>
                        </el-collapse-item>
                    </el-collapse>
                </el-main>
            </el-container>

            <!-- test page -->
            <el-container v-else-if="selectIndex=='2'">
                <el-main style="width: 100%;">
                    <el-input
                        v-model="searchTest"
                        size="medium"
                        placeholder="输入题目名称或语言以搜索"
                        style="width: 80%; float: left; margin-left: 20px;"
                    />
                    <el-table
                        :data="showTestItems"
                        stripe
                        :key="updateKey"
                        @row-click="handleTestQuestionRowClick"
                        style="width: 90%; margin-left: 10px;">
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <el-table :data="props.row.testCases"
                                    stripe
                                    :key="props.row.caseId"
                                    style="width: 50%; margin-left: 50px;">
                                >
                                    <el-table-column
                                        prop="caseId"
                                        label="TaskID"
                                        width="80">
                                    </el-table-column>
                                    <el-table-column
                                        label="State"
                                        width="150">
                                        <template slot-scope="scope">
                                            <el-tag :type="scope.row.state == 'Accepted' ? 'success' : ( scope.row.state == 'Compiling' || scope.row.state == 'Running' ? 'warning' : 'danger')" effect="dark" style="width: 120px; text-align: center;">
                                                {{ scope.row.state }}
                                            </el-tag>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="timeElapsed"
                                        label="timeElapsed(ms)"
                                        width="150">
                                    </el-table-column>
                                    <el-table-column
                                        prop="memoryUsage"
                                        label="memoryUsage(KB)"
                                        width="150">
                                    </el-table-column>
                                </el-table>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="testId"
                            label="QID"
                            width="100">
                        </el-table-column>
                        <el-table-column
                            prop="name"
                            label="Question"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            label="Score"
                            width="180">
                            <template slot-scope="scope">
                                <el-tag :type="scope.row.score == scope.row.totalScore ? 'success' : ( scope.row.score >= 0.6*scope.row.totalScore ? 'warning' : 'danger')" effect="dark" style="width: 80px; text-align: center;">
                                    {{ scope.row.score + "/" + scope.row.totalScore }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="uploadTime"
                            label="UploadTime"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="language"
                            label="Language"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            prop="fileSize"
                            label="FileSize"
                            width="180">
                        </el-table-column>
                        <el-table-column
                            label="AC/Submission"
                            width="180">
                            <template slot-scope="scope">
                                <div style="width: 80px; text-align: center;">
                                    {{ scope.row.passSubmission + "/" + scope.row.totalSubmission }}
                                </div>
                            </template>
                        </el-table-column>

                    </el-table>
                </el-main>
            </el-container>

            <!-- questions -->
            <el-container v-else-if="selectIndex=='3'">
                <el-main style="width: 100%;">
                    <el-input
                        v-model="searchQuestion"
                        size="medium"
                        placeholder="输入题目名称或Tag以搜索"
                        style="width: 80%; float: left; margin-left: 20px;"
                    />
                <el-table
                    :data="showQuestionItems"
                    stripe
                    :key="updateKey"
                    @row-click="handleQuestionRowClick"
                    style="width: 90%; margin-right: 20px;">
                    <el-table-column
                        prop="questionId"
                        label="QID"
                        width="100"
                        sortable>
                    </el-table-column>
                    <el-table-column
                        prop="questionName"
                        label="Question"
                        sortable>
                    </el-table-column>
                    <el-table-column
                        label="score"
                        width="100">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.score == scope.row.totalScore ? 'success' : ( scope.row.score >= 0.6*scope.row.totalScore ? 'warning' : 'danger')" effect="dark" style="width: 80px; text-align: center;">
                                {{ scope.row.score + "/" + scope.row.totalScore }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="tag"
                        label="tag"
                        sortable>
                    </el-table-column>
                    <el-table-column
                        label="AC/Submission">
                        <template slot-scope="scope">
                            <div style="width: 80px; text-align: center;">
                                {{ scope.row.passSubmission + "/" + scope.row.totalSubmission }}
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                </el-main>
            </el-container>

            <!-- announcements edit and push -->
            <el-container v-else-if="selectIndex=='4'" style="width: 80%;">
                <el-main>
                    <el-form :model="announcementForm" ref="announcementForm" :rules="announcementFormRules" :key="updateKey" label-width="80px">
                        <el-form-item label="Title" required prop="title">
                            <el-input v-model="announcementForm.title" prop="title"></el-input>
                        </el-form-item>
                        <el-form-item label="Content">
                            <MarkDownEditor v-model="announcementForm.markdownContent" @markdown-input="announcementDesctriptionChanged"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onAnnouncementSubmit('announcementForm')">发布公告</el-button>
                        </el-form-item>
                    </el-form>
                </el-main>
            </el-container>

            <!-- question edit and push  -->
            <el-container v-else-if="selectIndex=='5'">
                <el-main>
                    <el-form :model="questionForm" ref="questionForm" :rules="questionFormRules" :key="updateKey" label-width="120px">
                        <el-form-item label="Title" required prop="title">
                            <el-input v-model="questionForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="Tag" style="width: 400px;" prop="tag">
                            <el-input v-model="questionForm.tag"></el-input>
                        </el-form-item>
                        <el-form-item label="Time Limit" style="width: 400px;" required prop="timeLimit">
                            <el-col :span="16">
                                <el-input-number v-model="questionForm.timeLimit" :min="1"></el-input-number>
                            </el-col>
                            <el-col :span="5">&nbsp;ms</el-col>
                        </el-form-item>
                        <el-form-item label="Memory Limit" style="width: 400px;" required prop="memoryLimit">
                            <el-col :span="16">
                                <el-input-number v-model="questionForm.memoryLimit" :min="1"></el-input-number>
                            </el-col>
                            <el-col :span="5">&nbsp;MB</el-col>
                        </el-form-item>
                        <el-form-item label="Total Score" style="width: 550px;" required prop="totalScore">
                            <el-col :span="10">
                                <el-input-number v-model="questionForm.totalScore" :min="0"></el-input-number>
                            </el-col>
                            <el-col :span="14">&nbsp;points (所有测试点均分total score)</el-col>
                        </el-form-item>
                        <el-form-item label="Language" style="width: 400px;" required prop="languageSelected">
                            <el-select v-model="questionForm.languageSelected" placeholder="C++">
                                <el-option
                                    v-for="item in languageOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Description" required>
                            <MarkDownEditor v-model="questionForm.markdownContent" @markdown-input="questionDesctriptionChanged"/>
                        </el-form-item>
                        <el-form-item label="Additional Files">
                            <el-upload
                                class="upload-appendix"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :limit="1"
                                accept=".zip,.rar"
                                :on-change="handleAppendixChange"
                                :on-remove="handleAppendixRemove"
                                :on-exceed="handleExceed"
                                :file-list="questionForm.appendixFiles"
                                :auto-upload="false">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">学生完成题目所必需的附件。多文件请以单个zip压缩包上传，文件大小不超过10MB。</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="TestCases" required>
                            <el-upload
                                class="upload-testcase"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :limit="1"
                                accept=".zip,.rar"
                                :on-change="handleTestCaseChange"
                                :on-remove="handleTestCaseRemove"
                                :on-exceed="handleExceed"
                                :file-list="questionForm.testcaseFiles"
                                :auto-upload="false">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传zip文件, 且不超过10MB。</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onQuestionSubmit('questionForm')">发布题目</el-button>
                        </el-form-item>
                    </el-form>
                </el-main>
            </el-container>

            <!-- homework edit and push  -->
            <el-container v-else-if="selectIndex=='6'">
                <el-main>
                    <el-form ref="assignmentForm" :model="assignmentForm" :rules="assignmentFormRules" :key="updateKey" label-width="100px">
                        <el-form-item label="Title" required prop="title">
                            <el-input v-model="assignmentForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="Description" prop="description">
                            <el-input v-model="assignmentForm.description"></el-input>
                        </el-form-item>
                        <el-form-item label="Questions" required prop="questionIds">
                            <el-select v-model="assignmentForm.questionIds" multiple filterable placeholder="请选择题目(可多选)" style="width: 800px;">
                                <el-option
                                    v-for="item in questionList"
                                    :key="item.questionId"
                                    :label="item.questionId + '  ' + item.questionName + '  (' +  item.tag + ')'"
                                    :value="item.questionId">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Due Time" required prop="timerange">
                            <el-date-picker
                                v-model="assignmentForm.timerange"
                                type="datetimerange"
                                start-placeholder="作业公布时间"
                                end-placeholder="截止提交时间"
                                :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onAssignmentSubmit('assignmentForm')">发布作业</el-button>
                        </el-form-item>
                    </el-form>
                </el-main>
            </el-container>

        </el-container>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
import MarkDownEditor from "./MarkDownEditor.vue"
import { Message } from "element-ui"
import axios from "axios"
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
\n\
##  提示 \n\
\n\
##  评分标准 \n\
";

export default {
    name: "UniLabOJPage",
    components: {
        MarkDownEditor,
    },
    data() {
        return {
            username: this.$store.state.UserName || 'unknown',
            courseid: this.initCourseID(),
            courseName: "",
            activeIndex: this.$route.query.tabindex == null ? '1' : this.$route.query.tabindex, // '1' for later push
            selectIndex: this.$route.query.tabindex == null ? '1' : this.$route.query.tabindex,
            activeNames: [0],
            searchTest: '',
            searchQuestion: '',
            updateKey: false,
            announcementList: [],
            assignmentsInfo: [],
            testResults: [
                {
                    testId: 0,
                    name: "question 1",
                    score: 100,
                    totalScore: 100,
                    language: "C++",
                    uploadTime: "2022/3/15 23:54",
                    fileSize: "1.5KB", // KB
                    passSubmission: 10,
                    totalSubmission: 100,
                    testCases: [
                        {
                            caseId: 0,
                            state: "Accepted", // ["Accepted", "Compile Error", "Wrong Answer", "Runtime Error", "Time Limit Exceed", "Memory Limit Exceed", "Unknown Error", "Compiling", "Running"]
                            timeElapsed: 100, // ms
                            memoryUsage: 1024, // KB
                        },
                        {
                            caseId: 1,
                            state: "Running",
                            timeElapsed: 100, // ms
                            memoryUsage: 1024, // KB
                        },
                        {
                            caseId: 2,
                            state: "Wrong Answer",
                            timeElapsed: 100, // ms
                            memoryUsage: 1024, // KB
                        },
                        {
                            caseId: 3,
                            state: "Runtime Error", // ["Accepted", "Compile Error", "Wrong Answer", "Runtime Error", "Time Limit Exceed", "Memory Limit Exceed", "Unknown Error"]
                            timeElapsed: 100, // ms
                            memoryUsage: 1024, // KB
                        }
                    ]
                },
                {
                    testId: 0,
                    name: "question 1",
                    score: 100,
                    totalScore: 100,
                    language: "C++",
                    uploadTime: "2022/3/15 23:54",
                    fileSize: "1.5KB", // KB
                    passSubmission: 10,
                    totalSubmission: 100,
                    testCases: [
                        {
                            caseId: 0,
                            state: "Accepted", // ["Accepted", "Compile Error", "Wrong Answer", "Runtime Error", "Time Limit Exceed", "Memory Limit Exceed", "Unknown Error"]
                            timeElapsed: 100, // ms
                            memoryUsage: 1024, // KB
                        },
                        {
                            caseId: 1,
                            state: "Compile Error", // ["Accepted", "Compile Error", "Wrong Answer", "Runtime Error", "Time Limit Exceed", "Memory Limit Exceed", "Unknown Error"]
                            timeElapsed: 100, // ms
                            memoryUsage: 1024, // KB
                        },
                        {
                            caseId: 2,
                            state: "Wrong Answer", // ["Accepted", "Compile Error", "Wrong Answer", "Runtime Error", "Time Limit Exceed", "Memory Limit Exceed", "Unknown Error"]
                            timeElapsed: 100, // ms
                            memoryUsage: 1024, // KB
                        },
                        {
                            caseId: 3,
                            state: "Runtime Error", // ["Accepted", "Compile Error", "Wrong Answer", "Runtime Error", "Time Limit Exceed", "Memory Limit Exceed", "Unknown Error"]
                            timeElapsed: 100, // ms
                            memoryUsage: 1024, // KB
                        }
                    ]
                },
                {
                    testId: 0,
                    name: "question 1",
                    score: 100,
                    totalScore: 100,
                    language: "C++",
                    uploadTime: "2022/3/15 23:54",
                    fileSize: "1.5KB", // KB
                    passSubmission: 10,
                    totalSubmission: 100,
                    testCases: [
                        {
                            caseId: 0,
                            state: "Accepted", // ["Accepted", "Compile Error", "Wrong Answer", "Runtime Error", "Time Limit Exceed", "Memory Limit Exceed", "Unknown Error"]
                            timeElapsed: 100, // ms
                            memoryUsage: 1024, // KB
                        },
                        {
                            caseId: 1,
                            state: "Compile Error", // ["Accepted", "Compile Error", "Wrong Answer", "Runtime Error", "Time Limit Exceed", "Memory Limit Exceed", "Unknown Error"]
                            timeElapsed: 100, // ms
                            memoryUsage: 1024, // KB
                        },
                        {
                            caseId: 2,
                            state: "Wrong Answer", // ["Accepted", "Compile Error", "Wrong Answer", "Runtime Error", "Time Limit Exceed", "Memory Limit Exceed", "Unknown Error"]
                            timeElapsed: 100, // ms
                            memoryUsage: 1024, // KB
                        },
                        {
                            caseId: 3,
                            state: "Runtime Error", // ["Accepted", "Compile Error", "Wrong Answer", "Runtime Error", "Time Limit Exceed", "Memory Limit Exceed", "Unknown Error"]
                            timeElapsed: 100, // ms
                            memoryUsage: 1024, // KB
                        }
                    ]
                }
            ],
            questionList: [],
            announcementForm: {
                title: '',
                markdownContent: ''
            },
            languageOptions: [
                {value: 'c', label: 'C'},
                {value: 'c++', label: 'C++'},
                {value: 'java', label: 'Java'},
                {value: 'go', label: 'Go'},
                {value: 'python', label: 'Python'}, 
                {value: 'javaScript', label: 'JavaScript'}, 
                {value: 'rust', label: 'Rust'},
            ],
            questionForm: {
                title: '',
                tag: '',
                timeLimit: 1000, // ms
                memoryLimit: 512, // MB
                languageSelected: 'c++',
                totalScore: 100,
                markdownContent: questionDesctriptionContent,
                appendixFiles: [],
                testcaseFiles: []
            },
            assignmentForm: {
                title: '',
                description: '',
                timerange: [],
                questionids: [],
            },

            // form validator
            announcementFormRules: {
                title: [
                    { required: true, message: "请输入公告名称", trigger: 'blur'},
                    { min: 1, max: 30, message: "长度在1到30个字符", trigger: 'blur' },
                ],
            },
            questionFormRules: {
                title: [
                    { required: true, message: "请输入标题", trigger: 'blur' },
                    { min: 1, max: 30, message: "长度在1到30个字符", trigger: 'blur' },
                ],
                tag: [
                    // empty
                    { min: 1, max: 30, message: "长度在1到30个字符", trigger: 'blur' },
                ],
                timeLimit: [
                    { required: true, message: "请输入时间限制", trigger: 'change'},
                    { type: 'number', min: 1, max: 5000, message: "请设置在1ms到5000ms之间", trigger: 'change' },
                ],
                memoryLimit: [
                    { required: true, message: "请输入空间限制", trigger: 'change'},
                    { type: 'number', min: 1, max: 1024, message: "请设置在1MB到1024MB之间", trigger: 'change' },
                ],
                languageSelected: [
                    { required: true, type: 'enum', message: "请输入空间限制", trigger: 'change', enum: ["c", "c++", "java", "go", "python", "javascript", "rust"]},
                ],
                totalScore: [
                    { required: true, message: "请输入总分", trigger: 'change' },
                    { type: 'number', min: 0, max: 500, message: "请设置在0到500之间", trigger: 'change' }
                ]
            },
            assignmentFormRules: {
                title: [
                    { required: true, message: "请输入标题", trigger: 'blur' },
                    { min: 1, max: 30, message: "长度在1到30个字符", trigger: 'blur' },
                ],
                description: [
                    { min: 1, max: 100, message: "长度在1到100个字符", trigger: 'blur' },
                ],
                questionIds: [
                    { type: 'array', required: true, message: "请选择本次作业的题目", trigger: 'change' },
                ],
                timerange: [

                ]
            },
        }
    },
    computed: {
        showTestItems() {
            return this.testResults.filter(
                data => !this.searchTest
                || data.name.toLowerCase().includes(this.searchTest.toLowerCase())
                || data.language.toLowerCase().includes(this.searchTest.toLowerCase())
            );
        },
        showQuestionItems() {
            return this.questionList.filter(
                data => !this.searchQuestion
                || data.questionName.toLowerCase().includes(this.searchQuestion.toLowerCase())
                || data.tag.toLowerCase().includes(this.searchQuestion.toLowerCase())
            );
        },
    },
    methods: {  
        ...mapMutations([
            'CHANGE_LOCALSTORAGE_ON_LOGOUT',
        ]),
        handleChange(val) {
            console.log(val);
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
            this.selectIndex = key.toString();
            if (this.selectIndex === "0") {
                this.$router.push({ path: "/home", query: {  } });
            } else if (this.selectIndex === "1") {
                this.$router.push({ path: "/ojlab", query: { tabindex: this.selectIndex, courseid: this.courseid } });
                this.fetchAnnouncements()
            } else if (this.selectIndex === "3") {
                this.$router.push({ path: "/ojlab", query: { tabindex: this.selectIndex, courseid: this.courseid } });
                this.fetchQuestions()
            } else  {
                this.$router.push({ path: "/ojlab", query: { tabindex: this.selectIndex, courseid: this.courseid } });
            }
            // WARN: bind a key to force update table to avoid rendering failure
            this.updateKey = key;
        },
        announcementDesctriptionChanged(content) {
            this.announcementForm.markdownContent = content;
        },
        questionDesctriptionChanged(content) {
            console.log("from child", content);
            this.questionForm.markdownContent = content;
        },
        handleTestQuestionRowClick(row, column, event) {
            console.log(row, row.id, row.name, column, event);
            this.$router.push({ path: "/question", query: { id: row.questionId, courseid: this.courseid } });
        },
        handleAssignmentQuestionRowClick(row, column, event) {
            console.log(row, row.questionId, row.questionName, column, event);
            this.$router.push({ path: "/question", query: { id: row.questionId, courseid: this.courseid } });
        },
        handleQuestionRowClick(row, column, event) {
            console.log(row, row.questionId, row.questionName, column, event);
            this.$router.push({ path: "/question", query: { id: row.questionId, courseid: this.courseid } });
        },
        handleAnnouncementClick(index, announcement) {
            console.log(index, announcement);
            this.$router.push({ path: "/announcement", query: { courseid: this.courseid, annoid: this.announcementList[index].announcementId } });
        },
        handleLogOut() {
            this.CHANGE_LOCALSTORAGE_ON_LOGOUT()
            this.$router.push("/login")
        },
        onAnnouncementSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    console.log("onAnnouncementSubmit markdown submit", this.announcementForm.markdownContent);
                    let str = new Blob([this.announcementForm.markdownContent], {
                        type: 'text/plain; charset=utf-8'
                    })
                    let file = new File([str], "announcement.md", {
                        type: 'text/plain',
                    });
                    const formData = new FormData();
                    formData.append('title', this.announcementForm.title);
                    formData.append('userid', localStorage.getItem("UserID") ? localStorage.getItem("UserID") : "");
                    formData.append('courseid', this.courseid)
                    formData.append('file', file);
                    axios({
                        method: "post",
                        url: "/teacher/create-announcement",
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                        data: formData,
                    }).then(res => {
                        console.log(res.data)
                        if (res.status === 200 && res.data.code === 200) {
                            Message.success("公告发布成功")
                        } else {
                            Message.error("公告发布失败")
                        }
                    }).catch(err => {
                        Message.error("公告发布失败")
                        console.log(err)
                    })
                } else {
                    Message.warning("请按要求填写表单")
                    return false;
                }
            })
        },
        handleExceed(files, fileList) {
            Message.warning(`当前限制选择 1 个文件, 本次共选择了 ${files.length + fileList.length} 个文件`);
        },
        handleAppendixChange(file, fileList) {
            this.questionForm.appendixFiles = fileList;
        },
        handleAppendixRemove(file, fileList) {
            this.questionForm.appendixFiles = fileList;
        },
        handleTestCaseChange(file, fileList) {
            this.questionForm.testcaseFiles = fileList;
        },
        handleTestCaseRemove(file, fileList) {
            this.questionForm.testcaseFiles = fileList;
        },
        onQuestionSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var repeated = false
                    this.questionList.forEach(question => {
                        if (this.questionForm.title === question.questionName && !repeated) {
                            Message.warning("该题目名称已存在！")
                            repeated = true
                        }
                    })
                    if (!repeated) {
                        console.log("onQuestionSubmit submit", this.questionForm.markdownContent);
                        let str = new Blob([this.questionForm.markdownContent], {
                            type: 'text/plain; charset=utf-8'
                        })
                        let file = new File([str], "description.md", {
                            type: 'text/plain',
                        });
                        const formData = new FormData();
                        formData.append('title', this.questionForm.title);
                        formData.append('courseid', this.courseid);
                        formData.append('timeLimit', this.questionForm.timeLimit);
                        formData.append('memoryLimit', this.questionForm.memoryLimit);
                        formData.append('tag', this.questionForm.tag);
                        formData.append('language', this.questionForm.languageSelected)
                        formData.append('totalScore', this.questionForm.totalScore)
                        formData.append('description', file);
                        if (this.questionForm.testcaseFiles.length <= 0) {
                            Message.warning("请选择测例文件上传")
                            return false
                        }
                        if (this.questionForm.testcaseFiles.length > 1) {
                            Message.warning("请将测例文件打包成1个文件上传")
                            return false
                        }
                        if (this.questionForm.appendixFiles.length > 1) {
                            Message.warning("请将附加文件打包成1个文件上传")
                            return false
                        }
                        // appendix
                        if (this.questionForm.appendixFiles.length > 0) {
                            if (this.questionForm.appendixFiles[0].size / 1024 / 1024 > 10.0) {
                                Message.warning("上传文件大小不得超过10MB")
                                return false
                            }
                            formData.append('appendix', this.questionForm.appendixFiles[0].raw);
                        }
                        // testcases
                        if (this.questionForm.testcaseFiles[0].size / 1024 / 1024 > 10.0) {
                            Message.warning("上传文件大小不得超过10MB")
                            return false
                        }
                        formData.append('testcase', this.questionForm.testcaseFiles[0].raw)
                        axios({
                            method: "post",
                            url: "/teacher/create-question",
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                            data: formData,
                        }).then(res => {
                            console.log(res.data)
                            if (res.status === 200 && res.data.code === 200) {
                                Message.success("题目发布成功")
                                this.fetchQuestions()
                            } else {
                                Message.error("题目发布失败")
                            }
                        }).catch(err => {
                            Message.error("题目发布失败")
                            console.log(err)
                        })
                    }
                } else {
                    Message.warning("请按要求填写表单")
                    return false;
                }
            })
        },
        fetchAnnouncements() {
            console.log("fetchAnnouncements")
            axios({
                method: 'get',
                url: "http://localhost:1323/student/fetch-announcement",
                params: {
                    courseid: this.courseid,
                },
                headers: {
                    'Authorization': localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : ""
                }
            }).then(res => {
                console.log(res.data)
                this.announcementList = []
                if (res.data.data.result) {
                    res.data.data.result.forEach(announcement => {
                        this.announcementList.push({
                            announcementId: announcement.ID,
                            title: announcement.Title,
                            issue_time: announcement.IssueTime,
                        })
                    })
                }
            }).catch(err => {
                Message.error("获取公告列表失败")
                console.log(err)
            })
        },
        fetchQuestions() {
            console.log("fetchQuestions")
            axios({
                method: "get",
                url: "http://localhost:1323/student/fetch-question",
                params: {
                    courseid: this.courseid,
                },
                headers: {
                    'Authorization': localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : ""
                },
            }).then(res => {
                console.log(res.data)
                this.questionList = []
                if (res.data.data.result) {
                    res.data.data.result.forEach(question => {
                        this.questionList.push({
                            questionId: question.ID,
                            questionName: question.Title,
                            tag: question.Tag,
                            score: 0,
                            totalScore: question.Score,
                            passSubmission: question.TotalACNum,
                            totalSubmission: question.TotalTestNum,
                        })
                    })
                }
            }).catch(err => {
                Message.error("获取题目列表失败")
                console.log(err)
            })
        },
        isNumber(val){
            var regPos = /^[0-9]+.?[0-9]*/; //判断是否是数字。
            if(regPos.test(val) ){
                return true;
            }else{
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
                        courseid: this.courseid
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
        onAssignmentSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    var repeated = false
                    this.assignmentsInfo.forEach(assignment => {
                        if (assignment.assignmentName == this.assignmentForm.title && !repeated) {
                            Message.warning("该作业名已存在！")
                            repeated = true
                        }
                    })
                    var data = {
                        title: this.assignmentForm.title,
                        description: this.assignmentForm.description,
                        courseid: Number(this.courseid),
                        begintime: this.assignmentForm.timerange[0].format('yyyy-MM-dd hh:mm:ss'),
                        duetime: this.assignmentForm.timerange[1].format('yyyy-MM-dd hh:mm:ss'),
                        questionids: this.assignmentForm.questionIds,
                    }
                    if (!repeated) {
                        console.log("onAssignmentSubmit submit", data);
                        axios({
                            method: "post",
                            url: "/teacher/create-assignment",
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            data: data,
                        }).then(res => {
                            console.log(res.data)
                            if (res.status === 200 && res.data.code === 200) {
                                Message.success("作业发布成功")
                                this.fetchAssignmentInfo()
                            } else {
                                Message.error("作业发布失败")
                            }
                        }).catch(err => {
                            Message.error("作业发布失败")
                            console.log(err)
                        })
                    }
                } else {
                    Message.warning("请按要求填写表单")
                    return false;
                }
            })
        },
        fetchAssignmentInfo() {
            console.log("fetchAssignmentInfo")
            axios({
                method: "get",
                url: "http://localhost:1323/student/fetch-assignment",
                params: {
                    courseid: this.courseid,
                },
                headers: {
                    'Authorization': localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : ""
                },
            }).then(res => {
                console.log(res.data)
                this.assignmentsInfo = []
                if (res.data.data.result) {
                    res.data.data.result.forEach(assignment => {
                        var tempAssignment = {
                            assignmentId: assignment.ID,
                            assignmentName: assignment.Title,
                            beginTime: new Date(Date.parse(assignment.BeginTime)).format('yyyy-MM-dd hh:mm:ss'),
                            dueTime: new Date(Date.parse(assignment.DueTime)).format('yyyy-MM-dd hh:mm:ss'),
                            dueState: false,
                            description: assignment.Description,
                            score: 0,
                            totalScore: 0,
                            questions: []
                        }
                        var total_score = 0
                        var score = 0
                        assignment.Questions.forEach(question => {
                            tempAssignment.questions.push({
                                questionId: question.ID,
                                questionName: question.Title,
                                tag: question.Tag,
                                score: question.Score,
                                totalScore: question.TotalScore,
                            })
                            total_score += question.TotalScore
                            score += question.Score
                        })
                        tempAssignment.score = score
                        tempAssignment.totalScore = total_score
                        tempAssignment.dueState = new Date() > new Date(Date.parse(assignment.DueTime));
                        this.assignmentsInfo.push(tempAssignment)
                    })

                }
            }).catch(err => {
                Message.error("获取题目列表失败")
                console.log(err)
            })
        },
    },
    created() {
        this.fetchAnnouncements()
        this.fetchQuestions()
        this.fetchAssignmentInfo()
    },
    mounted() {        //写在mounted或者activated生命周期内即可
    }
}
</script>


<style scoped>
.item {
  margin-bottom: 10px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both
}
.el-table tr {
  cursor: pointer;
}
</style>
