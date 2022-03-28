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
    name: 'UniLabAnnouncementDisplay',
    components: {
        MarkdownPreview,
    },
    data() {
        return {
            username: this.$store.state.UserName || 'unknown',
            activeIndex: '1', // '1' for later push
            selectIndex: '1',
            title: "公告 1",
            content: questionDesctriptionContent
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
                console.log("handleSelect() jump to /home");
                this.$router.push({ path: "/home", query: {  } });
            } else {
                console.log("handleSelect() jump to /ojlab");
                this.$router.push({ path: "/ojlab", query: { tabindex: this.selectIndex } });
            }
        },
        handleLogOut() {
            this.CHANGE_LOCALSTORAGE_ON_LOGOUT()
            this.$router.push("/login")
        }
    }
}
</script>


<style scoped>
.display {
    width: 70%;
    margin-left: 15%;
}
</style>

