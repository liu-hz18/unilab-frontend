<template>
    <div id="announcementDisplay">
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
                <el-container>
                    <el-header>
                        <h1 style="font-size: 25px; text-align: center; line-height:1.7;">{{ title }}</h1>
                    </el-header>
                    <el-main>
                        <h4 style="font-size: 14px; text-align: center; line-height:1.0; color=#909399;">Time: {{ issueTime }}</h4>
                        <MarkdownPreview v-bind:initialValue="content" theme="oneDark"/>
                    </el-main>
                </el-container>
            </div>
            
        </el-container>
    </div>
</template>


<script>
import { MarkdownPreview } from 'vue-meditor'
import { mapMutations } from 'vuex'
import { Message } from "element-ui"
import axios from "axios"

export default {
    name: 'UniLabAnnouncementDisplay',
    components: {
        MarkdownPreview,
    },
    data() {
        return {
            username: this.$store.state.UserName || 'unknown',
            activeIndex: '1', // '1' for later push
            selectIndex: '1',
            courseid: this.initCourseID(),
            courseName: "",
            annoid: this.initAnnouncementID(),
            issueTime: "",
            title: "公告 1",
            content: ""
        }
    },
    computed: {
    
    },
    methods: {
        ...mapMutations([
            'CHANGE_LOCALSTORAGE_ON_LOGOUT',
        ]),
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
            this.selectIndex = key.toString();
            if (this.selectIndex === "0") {
                this.$router.push({ path: "/home", query: {  } });
            } else if (this.selectIndex === "1") {
                this.$router.push({ path: "/ojlab", query: { tabindex: this.selectIndex, courseid: this.courseid } });
            } else  {
                this.$router.push({ path: "/ojlab", query: { tabindex: this.selectIndex, courseid: this.courseid } });
            }
        },
        handleLogOut() {
            this.CHANGE_LOCALSTORAGE_ON_LOGOUT()
            this.$router.push("/login")
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
        initAnnouncementID() {
            if (this.$route.query.annoid === null || this.isNumber(this.$route.query.annoid) === false) {
                this.$router.replace({path: "/404"})
                return 0;
            } else {
                this.annoid = this.$route.query.annoid
                axios({
                    method: 'get',
                    url: "http://localhost:1323/student/fetch-announcement-detail",
                    params: {
                        annoid: this.annoid,
                    },
                    headers: {
                        'Authorization': localStorage.getItem("Authorization") ? localStorage.getItem("Authorization") : ""
                    }
                }).then(res => {
                    console.log(res.data)
                    if (res.status === 200 && res.data.code === 200) {
                        this.title = res.data.data.result.Title
                        this.issueTime = res.data.data.result.IssueTime;
                        this.content = res.data.data.result.Content;
                        Message.success("获取公告信息成功")
                    } else {
                        this.$router.replace("/404")
                        Message.error("获取公告信息失败")
                    }
                }).catch(err => {
                    if (err.response.status === 401) {
                        this.CHANGE_LOCALSTORAGE_ON_LOGOUT()
                        Message.error("UNAUTHORIZED: 请重新登录")
                        this.$router.replace("/login")
                    } else {
                        Message.error("获取公告信息失败")
                        console.log(err)
                        this.$router.replace("/404")
                    }
                })
                return this.$route.query.annoid
            }
        }
    },
    created() {

    }
}
</script>


<style scoped>
.display {
    width: 70%;
    margin-left: 15%;
}
</style>

