<template>
  <div id="ospage" style="min-width: 1264px">
    <el-container>
      <el-header>
        <el-row>
          <el-col :span="19">
            <el-menu
              :default-active="activeIndex"
              class="course-menu"
              mode="horizontal"
              @select="handleSelect"
            >
              <el-menu-item index="0">
                <i class="el-icon-s-home"></i>Home
              </el-menu-item>
              <!-- <el-menu-item index="1">本课程</el-menu-item>
              <el-menu-item index="2">章节实验</el-menu-item> -->
              <el-menu-item index="1">创建仓库</el-menu-item>
            </el-menu>
          </el-col>
          <el-col :span="3" style="margin-top: 9px">
            <div class="grid-content bg-purple">
              <h2
                style="
                  font-size: 16px;
                  text-align: right;
                  line-height: 1.5;
                  color: #909399;
                "
              >
                Hello {{ username }} !
              </h2>
            </div>
          </el-col>
          <el-col :span="1" :offset="1" style="margin-top: 13px">
            <div class="grid-content bg-purple">
              <el-tooltip
                class="item"
                effect="dark"
                content="退出登录"
                placement="top-start"
              >
                <el-button
                  icon="el-icon-switch-button"
                  circle
                  @click="handleLogOut"
                ></el-button>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
      </el-header>

      <!-- course homepage -->
      <!-- <el-container v-if="selectIndex == '1'">
        <el-aside width="25%">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>课程公告</span>
            </div>
          </el-card>
        </el-aside>
      </el-container> -->
      <!-- questions -->
      <!-- <el-container v-else-if="selectIndex == '2'">
        <el-main style="width: 100%">
          <el-input
            v-model="searchQuestion"
            size="medium"
            placeholder="输入题目名称或Tag以搜索"
            style="width: 80%; float: left; margin-left: 20px"
          />
          <el-table
            :data="showQuestionItems"
            stripe
            :key="updateKey"
            @row-click="handleGradeListRowClick"
            style="width: 90%; margin-right: 20px"
          >
            <el-table-column prop="Id" label="ID" width="100" sortable>
            </el-table-column>
            <el-table-column prop="Test_name" label="Chapter" sortable>
            </el-table-column>
            <el-table-column prop="Test_name" label="branch" sortable>
            </el-table-column>
            <el-table-column label="Score" width="100">
              <template slot-scope="scope">
                <el-tag
                  :type="
                    scope.row.score == scope.row.totalScore
                      ? 'success'
                      : scope.row.score >= 0.6 * scope.row.totalScore
                      ? 'warning'
                      : 'danger'
                  "
                  effect="dark"
                  style="width: 80px; text-align: center"
                >
                  {{ scope.row.score + "/" + scope.row.totalScore }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
      </el-container> -->
      <!-- create repo -->
      <!-- <el-container v-else-if="selectIndex == '1'"> -->
      <el-container v-if="selectIndex == '1'">
        <el-main>
          <h2>创建作业仓库</h2>
          <h3>请完成本学期 OS 实验的语言选择</h3>
          <p>系统会根据你的选择在 git.tsinghua.edu.cn 上创建对应的仓库</p>
          <p>创建仓库后，如果想更换另一种语言，请联系助教进行相关操作</p>
          <el-form ref="createRepoForm" :model="createRepoForm">
            <el-form-item label="实验" required>
              <el-select
                v-model="createRepoForm.lab"
                placeholder="实验"
                :disabled="selectDisabled"
              >
                <el-option label="rCore (rust)" value="rust"></el-option>
                <el-option label="uCore (c)" value="c"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                :disabled="buttonDisabled"
                type="primary"
                @click="handleCreateRepoSubmit('createRepoForm')"
              >
                创建仓库
              </el-button>
            </el-form-item>
          </el-form>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import { Message } from "element-ui";
import axios from "axios";
import API from "@/axios/API.js";

export default {
  name: "UniLabOsPage",
  components: {},
  data() {
    return {
      username: this.$store.state.UserName || "unknown",
      activeIndex: this.getIndex(), // '1' for later push
      selectIndex: this.getIndex(),
      selectDisabled: false,
      buttonDisabled: false,
      searchQuestion: "",
      updateKey: false,
      questionList: [
        {
          chapterId: 1,
          chapterName: "第三章实验",
          branchName: "ch3",
          score: 27,
          totalScore: 27,
        },
        {
          chapterId: 2,
          chapterName: "第四章实验",
          branchName: "ch4",
          score: 15,
          totalScore: 27,
        },
        {
          chapterId: 3,
          chapterName: "第五章实验",
          branchName: "ch5",
          score: 15,
          totalScore: 27,
        },
        {
          chapterId: 4,
          chapterName: "第六章实验",
          branchName: "ch6",
          score: 15,
          totalScore: 27,
        },
        {
          chapterId: 5,
          chapterName: "第七章实验",
          branchName: "ch7",
          score: 15,
          totalScore: 27,
        },
      ],
      createRepoForm: {
        lab: "",
      },
    };
  },
  computed: {
    showQuestionItems() {
      return this.questionList.filter(
        (data) =>
          !this.searchQuestion ||
          data.questionName
            .toLowerCase()
            .includes(this.searchQuestion.toLowerCase()) ||
          data.tag.toLowerCase().includes(this.searchQuestion.toLowerCase())
      );
    },
  },
  methods: {
    ...mapMutations(["CHANGE_LOCALSTORAGE_ON_LOGOUT"]),
    handleChange(val) {
      console.log(val);
    },
    getIndex() {
      if (this.$route.query.tabindex == null) {
        return "1";
      } else if (this.$route.query.tabindex == "0") {
        this.$router.push({ path: "/home" });
        return "1";
      } else if (
        this.$route.query.tabindex == "1" ||
        this.$route.query.tabindex == "2" ||
        this.$route.query.tabindex == "3"
      ) {
        return this.$route.query.tabindex;
      } else if (
        this.$route.query.tabindex == "4" ||
        this.$route.query.tabindex == "5" ||
        this.$route.query.tabindex == "6"
      ) {
        if (this.isStudent()) {
          this.$router.replace({ path: "/404" });
          return "1";
        } else {
          return this.$route.query.tabindex;
        }
      }
      this.$router.replace({ path: "/404" });
      return "1";
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
      this.selectIndex = key.toString();
      if (this.selectIndex === "0") {
        this.$router.push({ path: "/home", query: {} });
      } else if (this.selectIndex === "1") {
        this.$router.push({
          path: "/os",
          query: { tabindex: this.selectIndex, courseid: this.courseid },
        });
      } else if (this.selectIndex === "2") {
        this.$router.push({
          path: "/os",
          query: { tabindex: this.selectIndex, courseid: this.courseid },
        });
      }
      // WARN: bind a key to force update table to avoid rendering failure
      this.updateKey = key;
    },
    handleGradeListRowClick(row, column, event) {
      console.log(row, row.questionId, row.questionName, column, event);
      this.$router.push({
        path: "/osgradelist",
        query: { branch: row.Test_name },
      });
    },
    handleLogOut() {
      this.CHANGE_LOCALSTORAGE_ON_LOGOUT();
      Message.success(
        "退出登录: 请手动登出GitLab以登出!",
        localStorage.getItem("UserID")
      );
      window.location.href = "https://git.tsinghua.edu.cn/";
    },
    fetchGradeList() {
      const formData = new FormData();
      formData.append("userid", localStorage.getItem("UserID") || "");
      formData.append("coursetype", "CI");
      formData.append("coursename", "OS");
      var extra = {
        test: "test",
      };
      formData.append("extra", JSON.stringify(extra));
      axios({
        method: API.SUBMIT_TASK.method,
        url: API.SUBMIT_TASK.url,
        headers: {
          Authorization: localStorage.getItem("Authorization") || "",
        },
        data: formData,
      })
        .then((res) => {
          console.log(res.data.gradeDetails);
          if (res.data.gradeDetails) {
            this.questionList = res.data.gradeDetails;
            for (const question of this.questionList) {
              question.score = question.Tests.map((x) => x.Score).reduce(
                (x, y) => x + y,
                0
              );
              question.totalScore = question.Tests.map(
                (x) => x.Total_score
              ).reduce((x, y) => x + y, 0);
            }
          }
        })
        .catch(function (error) {
          // 请求失败处理
          console.log(error);
        });
    },
    CheckRepoExist() {
      axios({
        ...API.CheckRepoExist,
        params: {
          id: localStorage.getItem("Authorization") || "",
        },
        headers: {
          Authorization: localStorage.getItem("Authorization") || "",
        },
      }).then((res) => {
        if (res.status === 200) {
          var data = res.data;
          console.log(data);
          if (data["code"] === 200) {
            console.log("仓库不存在");
            this.selectDisabled = false;
            this.buttonDisabled = false;
          } else {
            Message.success("已经创建过仓库");
            this.selectDisabled = true;
            this.buttonDisabled = true;
          }
        } else {
          Message.error("加载失败");
        }
      });
    },
    handleCreateRepoSubmit(formName) {
      // console.log(this.createRepoForm.lab);
      const formData = new FormData();
      formData.append("id", localStorage.getItem("UserID") || "");
      formData.append("lab", this.createRepoForm.lab);
      axios({
        ...API.OS_CREATE_REPO,
        // data: {
        //   id: localStorage.getItem("UserID") || "",
        //   lab: this.createRepoForm.lab,
        // },
        data: formData,
        headers: {
          Authorization: localStorage.getItem("Authorization") || "",
        },
      }).then((res) => {
        console.log(res);
        if (res.status === 200) {
          var data = res.data;
          console.log(data);
          console.log(data["code"]);
          if (data["code"] === 200) {
            Message.success("创建仓库成功");
          } else {
            Message.error(data["data"]["err"]);
          }
        } else {
          Message.error("创建仓库失败，请联系助教");
        }
      });
    },
  },
  created() {
    this.fetchGradeList();
    this.CheckRepoExist();
  },
};
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
  clear: both;
}
.el-table tr {
  cursor: pointer;
}
</style>
