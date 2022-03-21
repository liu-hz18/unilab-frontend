<template>
    <div id="announcementDisplay">
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
        activeIndex: '1', // '1' for later push
        selectIndex: '1',
        title: "公告 1",
        content: questionDesctriptionContent
    }
  },
  computed: {
    
  },
  methods: {
        handleSelect(key, keyPath) {
            console.log(key, keyPath);
            this.selectIndex = key.toString();
            console.log("handleSelect() jump to /lab");
            if (this.selectIndex === "0") {
                this.$router.push({ path: "/course", query: {  } });
            } else {
                this.$router.push({ path: "/lab", query: { tabindex: this.selectIndex } });
            }
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

