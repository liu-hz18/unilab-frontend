<template>
    <div id="coursepage">

        <el-container>
            <el-header>
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
                                <span style="margin-left: 300px; text-align: left;">{{ assignment.dueTime }}</span>
                                <el-tag :type="assignment.dueState ? 'info' : 'success'" effect="dark" style="width: 80px; text-align: center; margin-left: 20px;">
                                        {{ assignment.dueState ? '已结束' : '可提交' }}
                                </el-tag>
                            </template>
                            <div style="text-align: left;"> 说明: {{ assignment.description }} </div>
                            <el-table
                                :data="assignment.questions"
                                stripe
                                :show-header="false"
                                @row-click="handleRowClick"
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
                        @row-click="handleRowClick"
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
                    @row-click="handleRowClick"
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
                    <el-form ref="form" :model="announcementForm" label-width="80px">
                        <el-form-item label="Title" required>
                            <el-input v-model="announcementForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="Content">
                            <MarkDownEditor v-model="announcementForm.markdownContent" @markdown-input="announcementDesctriptionChanged"/>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">发布公告</el-button>
                        </el-form-item>
                    </el-form>
                </el-main>
            </el-container>

            <!-- question edit and push  -->
            <el-container v-else-if="selectIndex=='5'">
                <el-main>
                    <el-form ref="form" :model="questionForm" label-width="120px">
                        <el-form-item label="Title" required>
                            <el-input v-model="questionForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="Tag" style="width: 400px;">
                            <el-input v-model="questionForm.tag"></el-input>
                        </el-form-item>
                        <el-form-item label="Time Limit" style="width: 400px;" required>
                                <el-col :span="16">
                                    <el-input-number v-model="questionForm.timeLimit" :min="1"></el-input-number>
                                </el-col>
                                <el-col :span="5">&nbsp;ms</el-col>
                        </el-form-item>
                        <el-form-item label="Memory Limit" style="width: 400px;" required>
                            <el-col :span="16">
                                <el-input-number v-model="questionForm.memoryLimit" :min="1"></el-input-number>
                            </el-col>
                            <el-col :span="5">&nbsp;MB</el-col>
                        </el-form-item>
                        <el-form-item label="Total Score" style="width: 550px;" required>
                            <el-col :span="10">
                                <el-input-number v-model="questionForm.totalScore" :min="0"></el-input-number>
                            </el-col>
                            <el-col :span="14">&nbsp;points (所有测试点均分total score)</el-col>
                        </el-form-item>
                        <el-form-item label="Language" style="width: 400px;" required>
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
                        <el-form-item label="Additional Files" required>
                            <el-upload
                                class="upload-testcase"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :before-remove="beforeRemove"
                                :limit="1"
                                :on-exceed="handleExceed"
                                :file-list="fileList">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">学生完成题目所必需的附件。多文件请以单个zip压缩包上传，文件大小不超过10MB。</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="TestCases" required>
                            <el-upload
                                class="upload-testcase"
                                action="https://jsonplaceholder.typicode.com/posts/"
                                :on-preview="handlePreview"
                                :on-remove="handleRemove"
                                :before-remove="beforeRemove"
                                :limit="1"
                                :on-exceed="handleExceed"
                                :file-list="fileList">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">只能上传zip文件, 且不超过10MB。</div>
                            </el-upload>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">发布题目</el-button>
                        </el-form-item>
                    </el-form>
                </el-main>
            </el-container>

            <!-- homework edit and push  -->
            <el-container v-else-if="selectIndex=='6'">
                <el-main>
                    <el-form ref="form" :model="homeworkForm" label-width="100px">
                        <el-form-item label="Title" required>
                            <el-input v-model="homeworkForm.title"></el-input>
                        </el-form-item>
                        <el-form-item label="Description">
                            <el-input v-model="homeworkForm.description"></el-input>
                        </el-form-item>
                        <el-form-item label="Questions" required>
                            <el-select v-model="homeworkForm.questionIds" multiple filterable placeholder="请选择题目" style="width: 800px;">
                                <el-option
                                    v-for="item in questionAvailable"
                                    :key="item.id"
                                    :label="item.id + '  ' + item.name + '  (' +  item.tag + ')'"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="Due Time" required>
                            <el-date-picker
                                v-model="homeworkForm.dueTime"
                                type="datetimerange"
                                start-placeholder="开始日期时间"
                                end-placeholder="结束日期时间"
                                :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">发布作业</el-button>
                        </el-form-item>
                    </el-form>
                </el-main>
            </el-container>

        </el-container>
    </div>
</template>

<script>
import MarkDownEditor from "./MarkDownEditor.vue"
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
    name: "UniLabCoursePage",
    components: {
        MarkDownEditor,
    },
    data() {
        return {
            activeIndex: this.$route.query.tabindex == null ? '1' : this.$route.query.tabindex, // '1' for later push
            selectIndex: this.$route.query.tabindex == null ? '1' : this.$route.query.tabindex,
            activeNames: [0],
            searchTest: '',
            searchQuestion: '',
            updateKey: false,
            announcementList: [
                {
                    announcementId: 1,
                    title: "公告 1",
                },
                {
                    announcementId: 2,
                    title: "公告 2",
                },
                {
                    announcementId: 3,
                    title: "公告 3",
                },
            ],
            assignmentsInfo: [
                {
                    assignmentId: 1,
                    assignmentName: "assignment 1",
                    dueTime: "2022/03/15 23:59",
                    dueState: true,
                    description: "请尽快提交",
                    score: 120,
                    totalScore: 300,
                    questions: [
                        {
                            questionId: 1,
                            questionName: "questions 1",
                            tag: "C++, Array",
                            score: 100,
                            totalScore: 100,
                        },
                        {
                            questionId: 2,
                            questionName: "questions 2",
                            tag: "C++, Array",
                            score: 0,
                            totalScore: 100,
                        },
                        {
                            questionId: 3,
                            questionName: "questions 3",
                            tag: "C++, Array",
                            score: 60,
                            totalScore: 100,
                        }
                    ]
                },
                {
                    assignmentId: 2,
                    assignmentName: "assignment 2",
                    dueTime: "2022/03/15 23:59",
                    dueState: false,
                    introduction: "请尽快提交",
                    score: 120,
                    totalScore: 300,
                    questions: [
                        {
                            questionId: 1,
                            questionName: "questions 1",
                            tag: "C++, Array",
                            score: 70,
                            totalScore: 100,
                        },
                        {
                            questionId: 2,
                            questionName: "questions 2",
                            tag: "C++, Array",
                            score: 80,
                            totalScore: 100,
                        },
                        {
                            questionId: 3,
                            questionName: "questions 3",
                            tag: "C++, Array",
                            score: 100,
                            totalScore: 100,
                        }
                    ]
                },
                {
                    assignmentId: 3,
                    assignmentName: "assignment 3",
                    dueTime: "2022/03/15 23:59",
                    dueState: false,
                    introduction: "请尽快提交",
                    score: 120,
                    totalScore: 300,
                    questions: [
                        {
                            questionId: 1,
                            questionName: "questions 1",
                            tag: "C++, Array",
                            score: 0,
                            totalScore: 100,
                        },
                        {
                            questionId: 2,
                            questionName: "questions 2",
                            tag: "C++, Array",
                            score: 100,
                            totalScore: 100,
                        },
                    ]
                },
                {
                    assignmentId: 4,
                    assignmentName: "assignment 4",
                    dueTime: "2022/03/15 23:59",
                    dueState: true,
                    introduction: "请尽快提交",
                    score: 120,
                    totalScore: 300,
                    questions: [
                        {
                            questionId: 1,
                            questionName: "questions 1",
                            tag: "Python, Array",
                            score: 0,
                            totalScore: 100,
                        },
                        {
                            questionId: 2,
                            questionName: "questions 2",
                            tag: "Python, Array",
                            score: 70,
                            totalScore: 100,
                        },
                        {
                            questionId: 3,
                            questionName: "questions 3",
                            tag: "Python, Array",
                            score: 100,
                            totalScore: 100,
                        }
                    ]
                },
            ],
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
            questionList: [
                {
                    questionId: 1,
                    questionName: "questions 1",
                    tag: "C++, Array",
                    score: 100,
                    totalScore: 100,
                    passSubmission: 10,
                    totalSubmission: 100,
                },
                {
                    questionId: 1,
                    questionName: "questions 1",
                    tag: "C++, Array",
                    score: 100,
                    totalScore: 100,
                    passSubmission: 10,
                    totalSubmission: 100,
                },
                {
                    questionId: 1,
                    questionName: "questions 1",
                    tag: "C++, Array",
                    score: 100,
                    totalScore: 100,
                    passSubmission: 10,
                    totalSubmission: 100,
                },
                {
                    questionId: 1,
                    questionName: "questions 1",
                    tag: "C++, Array",
                    score: 100,
                    totalScore: 100,
                    passSubmission: 10,
                    totalSubmission: 100,
                }
            ],
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
                memoryLimit: 1024, // MB
                languageSelected: 'c++',
                totalScore: 100,
                markdownContent: questionDesctriptionContent
            },
            homeworkForm: {
                title: '',
                description: '',
                dueTime: '',
                questionIds: []
            },
            questionAvailable: [
                {
                    id: 0,
                    name: "test 1",
                    tag: "C++", 
                },
                {
                    id: 1,
                    name: "test 2",
                    tag: "Python", 
                },
                {
                    id: 2,
                    name: "test 3",
                    tag: "C++", 
                },
                {
                    id: 3,
                    name: "test 3",
                    tag: "C++", 
                },
                {
                    id: 4,
                    name: "test 3",
                    tag: "C++", 
                },
                {
                    id: 5,
                    name: "test 3",
                    tag: "C++", 
                },
                {
                    id: 6,
                    name: "test 3",
                    tag: "C++", 
                },
                {
                    id: 7,
                    name: "test 3",
                    tag: "C++", 
                },
                {
                    id: 8,
                    name: "test 3",
                    tag: "C++", 
                }
            ]
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
        handleChange(val) {
            console.log(val);
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
            this.selectIndex = key.toString();
            if (this.selectIndex === "0") {
                this.$router.push({ path: "/course", query: {  } });
            } else {
                this.$router.push({ path: "/lab", query: { tabindex: this.selectIndex } });
            }
            // WARN: bind a key to force update table to avoid rendering failure
            this.updateKey = !this.updateKey;
        },
        announcementDesctriptionChanged(content) {
            this.announcementForm.markdownContent = content;
        },
        questionDesctriptionChanged(content) {
            console.log("from child", content);
            this.questionForm.markdownContent = content;
        },
        handleRowClick(row, column, event) {
            console.log(row, row.id, row.name, column, event);
            console.log("handleRowClick() jump to /question");
            this.$router.push({ path: "/question" });
        },
        handleAnnouncementClick(index, announcement) {
            console.log(index, announcement);
            this.$router.push({ path: "/announcement" });
        }
    },
    created() {
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
