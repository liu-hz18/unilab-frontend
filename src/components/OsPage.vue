<template>
    <div id="coursepage" style="min-width: 1264px;">

        <el-container>
            <el-header>
                <el-row>
                    <el-col :span="19">
                        <el-menu :default-active="activeIndex" class="course-menu" mode="horizontal" @select="handleSelect">
                            <el-menu-item index="0">
                                <i class="el-icon-s-home"></i>Home
                            </el-menu-item>
                            <el-menu-item index="1">本课程</el-menu-item>
                            <el-menu-item index="2">章节实验</el-menu-item>
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
                <el-aside width="25%">
                    <el-card class="box-card">
                        <div slot="header" class="clearfix">
                            <span>课程公告</span>
                        </div>
                        <!-- <el-link type="primary" v-for="(announcement, index) in announcementList" :key="announcement.id" class="text-item" :underline="false" @click="handleAnnouncementClick(index, announcement)" style="width: 100%; text-align: left; justify-content: left; font-size: 17px; margin-bottom: 3px;">
                         {{ announcement.title }}  
                        </el-link> -->
                    </el-card>
                </el-aside>
                <!-- course assignments -->
                <!-- <el-main width="75%">
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
                </el-main> -->
            </el-container>
            <!-- questions -->
            <el-container v-else-if="selectIndex=='2'">
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
                    @row-click="handleGradeListRowClick"
                    style="width: 90%; margin-right: 20px;">
                    <el-table-column
                        prop="Id"
                        label="ID"
                        width="100"
                        sortable>
                    </el-table-column>
                    <el-table-column
                        prop="Test_name"
                        label="Chapter"
                        sortable>
                    </el-table-column>
                    <el-table-column
                        prop="Test_name"
                        label="branch"
                        sortable>
                    </el-table-column>
                    <el-table-column
                        label="Score"
                        width="100">
                        <template slot-scope="scope">
                            <el-tag :type="scope.row.score == scope.row.totalScore ? 'success' : ( scope.row.score >= 0.6*scope.row.totalScore ? 'warning' : 'danger')" effect="dark" style="width: 80px; text-align: center;">
                                {{ scope.row.score + "/" + scope.row.totalScore }}
                            </el-tag>
                        </template>
                    </el-table-column>
                </el-table>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
import { mapMutations } from 'vuex'
// // import MarkDownEditor from "./MarkDownEditor.vue"
import { Message } from "element-ui"
import axios from "axios"

export default {
    name: "UniLabOsPage",
    components: {
        // MarkDownEditor,
    },
    data() {
        return {
            // // 刷新评测计时器
            // timer: null,

            username: this.$store.state.UserName || 'unknown',
            // courseid: this.initCourseID(),
            // courseName: "",
            activeIndex: this.getIndex(), // '1' for later push
            selectIndex: this.getIndex(),
            // activeNames: [0],
            // searchTest: '',
            searchQuestion: '',
            updateKey: false,
            // announcementList: [],
            // assignmentsInfo: [],
            // testids: [],
            // testResults: [],
            questionList: [{
                chapterId: 1,
                chapterName: "第三章实验",
                branchName:"ch3",
                score: 27,
                totalScore: 27,
            },{
                chapterId: 2,
                chapterName: "第四章实验",
                branchName:"ch4",
                score: 15,
                totalScore: 27,
            },{
                chapterId: 3,
                chapterName: "第五章实验",
                branchName:"ch5",
                score: 15,
                totalScore: 27,
            },{
                chapterId: 4,
                chapterName: "第六章实验",
                branchName:"ch6",
                score: 15,
                totalScore: 27,
            },{
                chapterId: 5,
                chapterName: "第七章实验",
                branchName:"ch7",
                score: 15,
                totalScore: 27,
            },
            ],
            // announcementForm: {
            //     title: '',
            //     markdownContent: ''
            // },
            // languageOptions: [
            //     {value: 'c', label: 'C'},
            //     {value: 'c++', label: 'C++'},
            //     {value: 'java', label: 'Java'},
            //     {value: 'go', label: 'Go'},
            //     {value: 'python', label: 'Python'}, 
            //     {value: 'javaScript', label: 'JavaScript'}, 
            //     {value: 'rust', label: 'Rust'},
            // ],
            // questionForm: {
            //     title: '',
            //     tag: '',
            //     timeLimit: 1000, // ms
            //     memoryLimit: 512, // MB
            //     languageSelected: 'c++',
            //     totalScore: 100,
            //     markdownContent: questionDesctriptionContent,
            //     appendixFiles: [],
            //     testcaseFiles: []
            // },
            // assignmentForm: {
            //     title: '',
            //     description: '',
            //     timerange: [],
            //     questionids: [],
            // },

            // // form validator
            // announcementFormRules: {
            //     title: [
            //         { required: true, message: "请输入公告名称", trigger: 'blur'},
            //         { min: 1, max: 30, message: "长度在1到30个字符", trigger: 'blur' },
            //     ],
            // },
            // questionFormRules: {
            //     title: [
            //         { required: true, message: "请输入标题", trigger: 'blur' },
            //         { min: 1, max: 30, message: "长度在1到30个字符", trigger: 'blur' },
            //     ],
            //     tag: [
            //         // empty
            //         { min: 1, max: 30, message: "长度在1到30个字符", trigger: 'blur' },
            //     ],
            //     timeLimit: [
            //         { required: true, message: "请输入时间限制", trigger: 'change'},
            //         { type: 'number', min: 1, max: 5000, message: "请设置在1ms到5000ms之间", trigger: 'change' },
            //     ],
            //     memoryLimit: [
            //         { required: true, message: "请输入空间限制", trigger: 'change'},
            //         { type: 'number', min: 1, max: 1024, message: "请设置在1MB到1024MB之间", trigger: 'change' },
            //     ],
            //     languageSelected: [
            //         { required: true, type: 'enum', message: "请输入空间限制", trigger: 'change', enum: ["c", "c++", "java", "go", "python", "javascript", "rust"]},
            //     ],
            //     totalScore: [
            //         { required: true, message: "请输入总分", trigger: 'change' },
            //         { type: 'number', min: 0, max: 500, message: "请设置在0到500之间", trigger: 'change' }
            //     ]
            // },
            // assignmentFormRules: {
            //     title: [
            //         { required: true, message: "请输入标题", trigger: 'blur' },
            //         { min: 1, max: 30, message: "长度在1到30个字符", trigger: 'blur' },
            //     ],
            //     description: [
            //         { min: 1, max: 100, message: "长度在1到100个字符", trigger: 'blur' },
            //     ],
            //     questionIds: [
            //         { type: 'array', required: true, message: "请选择本次作业的题目", trigger: 'change' },
            //     ],
            //     timerange: [

            //     ]
            // },
        }
    },
    computed: {
        // showTestItems() {
        //     return this.testResults.filter(
        //         data => !this.searchTest
        //         || data.name.toLowerCase().includes(this.searchTest.toLowerCase())
        //         || data.language.toLowerCase().includes(this.searchTest.toLowerCase())
        //     );
        // },
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
        getIndex() {
            if (this.$route.query.tabindex == null) {
                return '1'
            } else if (this.$route.query.tabindex == '0') {
                this.$router.push({ path: "/home" });
                return '1'
            } else if (this.$route.query.tabindex == '1' || this.$route.query.tabindex == '2' || this.$route.query.tabindex == '3') {
                return this.$route.query.tabindex
            } else if (this.$route.query.tabindex == '4' || this.$route.query.tabindex == '5' || this.$route.query.tabindex == '6') {
                if (this.isStudent()) {
                    this.$router.replace({ path: "/404" });
                    return '1'
                } else {
                    return this.$route.query.tabindex
                }
            }
            this.$router.replace({ path: "/404" });
            return '1'
        },
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
            this.selectIndex = key.toString();
            if (this.selectIndex === "0") {
                this.$router.push({ path: "/home", query: {  } });
            } else if (this.selectIndex === "1") {
                this.$router.push({ path: "/os", query: { tabindex: this.selectIndex, courseid: this.courseid } });
                // this.fetchAnnouncements()
                // this.fetchAssignmentInfo()
            } else if (this.selectIndex === "2") {
                this.$router.push({ path: "/os", query: { tabindex: this.selectIndex, courseid: this.courseid } });
            }
            // } else if (this.selectIndex === "4" || this.selectIndex === "5" || this.selectIndex === "6") {
            //     if (this.isStudent()) {
            //         this.$router.replace({ path: "/404" });
            //     } else {
            //         this.$router.push({ path: "/ojlab", query: { tabindex: this.selectIndex, courseid: this.courseid } });
            //     }
            // } else {
            //     this.$router.replace({ path: "/404" });
            // }
            // WARN: bind a key to force update table to avoid rendering failure
            this.updateKey = key;
        },
        // announcementDesctriptionChanged(content) {
        //     this.announcementForm.markdownContent = content;
        // },
        // questionDesctriptionChanged(content) {
        //     console.log("from child", content);
        //     this.questionForm.markdownContent = content;
        // },
        // handleTestQuestionRowClick(row, column, event) {
        //     console.log(row, row.id, row.name, column, event);
        //     this.$router.push({ path: "/question", query: { id: row.questionId, courseid: this.courseid } });
        // },
        // handleAssignmentQuestionRowClick(row, column, event) {
        //     console.log(row, row.questionId, row.questionName, column, event);
        //     this.$router.push({ path: "/question", query: { id: row.questionId, courseid: this.courseid } });
        // },
        handleGradeListRowClick(row, column, event) {
            console.log(row, row.questionId, row.questionName, column, event);
            this.$router.push({ path: "/osgradelist", query: { branch: row.Test_name } });
        },
        // handleAnnouncementClick(index, announcement) {
        //     console.log(index, announcement);
        //     this.$router.push({ path: "/announcement", query: { courseid: this.courseid, annoid: this.announcementList[index].announcementId } });
        // },
        handleLogOut() {
            this.CHANGE_LOCALSTORAGE_ON_LOGOUT()
            Message.success("退出登录: 请手动登出GitLab以登出!", localStorage.getItem("UserID"))
            window.location.href='https://git.tsinghua.edu.cn/';
        },
        fetchGradeList(){
            // axios({
            //     method: 'get',
            //     url: 'http://localhost:1323/student/Os/Grade',
            //     params: {
            //         id: localStorage.getItem("UserID") || "",
            //     },
            //     headers: {
            //         'Authorization': localStorage.getItem("Authorization") || ""
            //     },
            // }).then(res => {
            //     this.questionList=res.data.gradeDetails
            //     for(const question of this.questionList){
            //         question.score=question.Tests.filter((x)=>x.Passed).length;
            //         question.totalScore=question.Tests.map((x)=>x.Score).reduce((x,y)=>x+y,0);
            //     }
            // }).catch(function (error) { // 请求失败处理
            //     console.log(error);
            // });
            const formData = new FormData();
            formData.append('userid', localStorage.getItem("UserID") || "");
            formData.append('coursetype', 'CI');
            formData.append('coursename','OS');
            var extra = {
                test:"test",
            };
            formData.append('extra',JSON.stringify(extra))
            axios({
                method: 'post',
                url: 'http://localhost:1323/student/submit-task',
                headers: {
                    'Authorization': localStorage.getItem("Authorization") || "",
                },
                data: formData,
            }).then(res => {
                this.questionList=res.data.gradeDetails
                console.log(res.data.gradeDetails)
                for(const question of this.questionList){
                    question.score=question.Tests.map((x)=>x.Score).reduce((x,y)=>x+y,0);
                    question.totalScore=question.Tests.map((x)=>x.Total_score).reduce((x,y)=>x+y,0);
                }
            }).catch(function (error) { // 请求失败处理
                console.log(error);
            });
        }
        // isStudent() {
        //     return (localStorage.getItem("Permission") === "0");
        // }
    },
    created() {
        this.fetchGradeList()
        // this.fetchAnnouncements()
        // this.fetchQuestions()
        // this.fetchAssignmentInfo()
        // this.fetchTestIDs()
        // this.timer = window.setInterval(() => {
        //     if (this.selectIndex === "2") {
        //         setTimeout(this.updateTestDetails, 0);
        //     }
        // }, 3000);
    },
    destroyed() {
        // clearInterval(this.timer);
        // this.timer = null;
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
