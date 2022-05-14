<template>
  <div id="course" style="min-width: 1164px">
    <el-container>
      <el-header>
        <el-row :gutter="20" style="background-color: #bbd9f8">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <h1
                style="
                  font-size: 20px;
                  text-align: left;
                  margin-left: 5px;
                  line-height: 1.7;
                "
              >
                UniLab Platform
              </h1>
            </div>
          </el-col>
          <!-- user logout -->
          <el-col :span="3" :offset="11" style="margin-top: 9px">
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
          <el-col :span="2" style="margin-top: 13px">
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

      <el-container>
        <el-main>
          <el-row>
            <el-col :span="20">
              <el-input
                v-model="search"
                size="medium"
                placeholder="输入关键字搜索"
              />
            </el-col>
            <el-col :span="3" v-if="!isStudent()">
              <el-button type="text" @click="dialogFormVisible = true">
                <i class="el-icon-circle-plus-outline"></i>&nbsp;新建课程
              </el-button>
            </el-col>
          </el-row>

          <el-table
            :data="showItems"
            stripe
            :default-sort="{ prop: 'id', order: 'ascending' }"
            style="width: 100%; margin-top: 20px"
            @row-click="handleRowClick"
          >
            <el-table-column label="ID" prop="id" width="60" sortable>
            </el-table-column>
            <el-table-column label="Course" prop="name" sortable>
            </el-table-column>
            <el-table-column
              label="Teacher"
              prop="teacher"
              width="100"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="Announcements"
              prop="announcements"
              width="160"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="AssignmentsToDo"
              prop="todoAssignments"
              width="170"
              sortable
            >
            </el-table-column>
            <el-table-column
              label="Nearest Due"
              prop="nearestDue"
              width="150"
              sortable
            >
            </el-table-column>
            <el-table-column label="Term" prop="time" sortable>
            </el-table-column>
          </el-table>
        </el-main>

        <el-aside width="250px" style="margin-top: 20px; margin-right: 10px">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>操作记录</span>
            </div>
            <el-timeline style="padding: 10px">
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.timestamp"
              >
                {{ activity.content }}
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-aside>
      </el-container>

      <el-scrollbar>
        <el-dialog
          v-if="!isStudent()"
          title="新建课程"
          :visible.sync="dialogFormVisible"
          @close="createCourseDialogClose"
          width="50%"
          top="10vh"
          style="min-width: 1100px"
        >
          <el-form
            :model="createCourseForm"
            :rules="createCourseFormRules"
            ref="createCourseForm"
            label-width="140px"
          >
            <el-form-item label="课程名称" required prop="name">
              <el-input v-model="createCourseForm.name"></el-input>
            </el-form-item>
            <el-form-item label="创建者姓名" required prop="creator">
              <el-input v-model="createCourseForm.creator"></el-input>
            </el-form-item>
            <el-form-item label="请选择学期" required prop="term">
              <el-select
                v-model="createCourseForm.term"
                filterable
                style="width: 90%"
              >
                <el-option
                  v-for="term in termAvailable"
                  :key="term"
                  :label="term"
                  :value="term"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="请选择教学人员" required prop="teachers">
              <el-select
                v-model="createCourseForm.teachers"
                placeholder="可多选"
                multiple
                filterable
                reserve-keyword
                clearable
                :loading="fetchingTeachers"
                :loading-text="'Loading...'"
                @visible-change="teacherSelectorChange"
                style="width: 90%"
              >
                <el-option
                  v-for="user in teachersAvailable"
                  :key="user.id"
                  :label="user.id + '  ' + user.name"
                  :value="user.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="请选择或导入学生 (若导入Excel文件将自动为学生注册账号)"
              required
              prop="students"
            >
              <el-select
                v-model="createCourseForm.students"
                placeholder="可多选"
                multiple
                filterable
                reserve-keyword
                collapse-tags
                clearable
                :loading="fetchingUsers"
                :loading-text="'Loading...'"
                @visible-change="studentSelectorChange"
                style="width: 90%"
              >
                <el-option
                  v-for="user in usersAvailable"
                  :key="user.id"
                  :label="user.id + '  ' + user.name"
                  :value="user.id"
                >
                </el-option>
              </el-select>
              <el-upload
                class="upload-students"
                drag
                action=""
                multiple
                :limit="10"
                :accept="'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'"
                :auto-upload="false"
                :on-change="handleUploadStudentChange"
                :on-remove="handleUploadStudentRemove"
                :on-exceed="handleUploadStudentExceeded"
                style="margin-top: 3%"
              >
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">
                  上传<b>网络学堂</b>导出的“<b>学生信息.xls</b>”文件。<br />拖到此处，或<em
                    >点击上传</em
                  >
                </div>
              </el-upload>
            </el-form-item>
            <el-form-item label="课程类型" required prop="type">
              <el-select v-model="createCourseForm.type" placeholder="">
                <el-option :label="'OJ-based'" :value="1" :key="1"></el-option>
                <el-option
                  :label="'GitLab-based'"
                  :value="2"
                  :key="2"
                ></el-option>
                <el-option :label="'System'" :value="3" :key="3"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button
              type="primary"
              @click="commitCreateCourseForm('createCourseForm')"
              >确 定</el-button
            >
          </div>
        </el-dialog>
      </el-scrollbar>
    </el-container>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import * as XLSX from "xlsx";
import axios from "axios";
import { Message } from "element-ui";
import API from "@/axios/API.js";
import login from "@/axios/login.js";

const CourseType = {
  Invalid: 0,
  OJ: 1,
  GitLab: 2,
  System: 3,
};

export default {
  name: "UniLabHome",
  components: {},
  data() {
    return {
      username: this.$store.state.UserName || "unknown",
      fetchingUsers: true,
      fetchingTeachers: true,
      courseList: [],
      activities: [
        {
          timestamp: "2022/3/22 13:48",
          content: "登入",
        },
        {
          timestamp: "2022/3/21 15:40",
          content: "登出",
        },
        {
          timestamp: "2022/3/21 11:40",
          content: "登入",
        },
      ],
      createCourseFormRules: {
        name: [
          { required: true, message: "请输入课程名称", trigger: "blur" },
          { min: 1, max: 30, message: "长度在1到30个字符", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择课程类型", trigger: "blur" }],
        creator: [
          { required: true, message: "请输入创建者姓名", trigger: "blur" },
        ],
        term: [{ required: true, message: "请选择学期", trigger: "change" }],
        teachers: [
          {
            required: true,
            type: "array",
            message: "请选择教学人员",
            trigger: "change",
          },
        ],
        students: [
          {
            required: true,
            type: "array",
            message: "请选择学生",
            trigger: "change",
          },
        ],
      },
      createCourseForm: {
        name: "",
        type: 1,
        creator: "",
        term: "",
        teachers: [],
        students: [],
      },
      usersAvailable: [],
      teachersAvailable: [],
      termAvailable: [
        "2021-2022 春季学期",
        "2022-2023 秋季学期",
        "2022-2023 春季学期",
      ],
      dialogFormVisible: false,
      search: "",
    };
  },
  computed: {
    showItems() {
      return this.courseList.filter(
        (data) =>
          !this.search ||
          data.name.toLowerCase().includes(this.search.toLowerCase()) ||
          data.teacher.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },
  methods: {
    ...mapMutations(["CHANGE_LOCALSTORAGE_ON_LOGOUT"]),
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      this.tableData.splice(index, 1);
      console.log(index, row);
    },
    handleRowClick(row, column, event) {
      console.log(row, row.id, row.name, column, event);
      if (row.type === CourseType.OJ) {
        this.$router.push({
          path: "/ojlab",
          query: { tabindex: "1", courseid: row.id },
        });
        axios({
          method: API.ACCESS_COURSE.method,
          url: API.ACCESS_COURSE.url,
          params: {
            courseid: row.id,
          },
          headers: {
            Authorization: localStorage.getItem("Authorization")
              ? localStorage.getItem("Authorization")
              : "",
          },
        })
          .then((res) => {
            console.log(res.data);
          })
          .catch((err) => {
            console.log(err);
            if (err.response.status === 401) {
              this.CHANGE_LOCALSTORAGE_ON_LOGOUT();
              Message.error("UNAUTHORIZED: 请重新登录");
              login();
            }
          });
      } else if (row.type === CourseType.GitLab) {
        this.$router.push({ path: "/os" });
      } else {
        this.$router.push({ path: "/404" });
      }
    },
    handleUploadStudentChange(file, fileList) {
      // 上传多个文件的时候会多次调用此函数
      console.log("changed", file, fileList);
      this.readSingleExcelFile(file.raw);
    },
    handleUploadStudentExceeded(file, fileList) {
      console.log(file, fileList);
      this.$message({
        message: "文件数量过多",
        type: "error",
      });
    },
    handleUploadStudentRemove(file, fileList) {
      console.log(file, fileList);
      this.createCourseForm.students = [];
      this.fetchingUsers = true;
    },
    readSingleExcelFile(file) {
      if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
        this.$message({
          message: "文件类型不正确，请上传.xls或.xlsx文件",
          type: "error",
        });
        return false;
      }
      // let that = this;
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result;
          const workbook = XLSX.read(data, {
            type: "binary",
          });
          const worksheetname = workbook.SheetNames[0];
          this.resolveExcelContent(
            XLSX.utils.sheet_to_json(workbook.Sheets[worksheetname])
          );
        } catch (e) {
          this.$message({
            message: "文件解析失败(" + e + ")，请检查文件内容",
            type: "error",
          });
        }
      };
      fileReader.readAsBinaryString(file);
      return true;
    },
    resolveExcelContent(content) {
      for (var i = 0, len = content.length; i < len; i++) {
        if (Object.keys(content[i]).indexOf("学号") == -1) {
          this.$message({
            message: "文件解析失败，请检查文件内容, 取消并重新上传",
            type: "error",
          });
          break;
        }
        const id = parseInt(content[i]["学号"]);
        const name = content[i]["姓名"];
        if (this.createCourseForm.students.indexOf(id) == -1) {
          this.createCourseForm.students.push(id);
        }
        var exists = false;
        for (
          var j = 0, user_len = this.usersAvailable.length;
          j < user_len;
          j++
        ) {
          if (parseInt(this.usersAvailable[j].id) === id) {
            exists = true;
            break;
          }
        }
        if (!exists) {
          this.usersAvailable.push({
            id: id,
            name: name,
          });
        }
      }
    },
    commitCreateCourseForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          // check repeated course
          var repeated = false;
          this.courseList.forEach((course) => {
            if (this.createCourseForm.name === course.name && !repeated) {
              Message.warning("课程名已存在！");
              repeated = true;
            }
          });
          if (!repeated) {
            this.dialogFormVisible = false;
            var tempCreateCourseForm = {
              name: this.createCourseForm.name,
              type: this.createCourseForm.type,
              creator: this.createCourseForm.creator,
              term: this.createCourseForm.term,
              teachers: this.createCourseForm.teachers,
              students: [],
            };
            this.createCourseForm.students.forEach((id) => {
              var name = "unknown";
              for (var i = 0, len = this.usersAvailable.length; i < len; i++) {
                if (this.usersAvailable[i].id === parseInt(id)) {
                  name = this.usersAvailable[i].name;
                  break;
                }
              }
              if (name !== "unknown") {
                tempCreateCourseForm.students.push({ id: id, name: name });
              }
            });
            // 发送数据给后端, json格式
            axios({
              method: API.CREATE_COURSE.method,
              url: API.CREATE_COURSE.url,
              header: {
                "Content-Type": "application/json", //如果写成contentType会报错
              },
              data: tempCreateCourseForm,
            })
              .then((res) => {
                console.log(res.data);
                if (res.status === 200 && res.data.code === 200) {
                  Message.success("课程创建成功");
                  this.fetchUserCourses();
                } else {
                  Message.error("课程创建失败");
                }
              })
              .catch((err) => {
                if (err.response.status === 401) {
                  this.CHANGE_LOCALSTORAGE_ON_LOGOUT();
                  Message.error("UNAUTHORIZED: 请重新登录");
                  login();
                } else {
                  Message.error("课程创建失败");
                  console.log(err);
                }
              });
          }
        } else {
          Message.warning("请按要求填写表单");
          return false;
        }
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
    studentSelectorChange(open) {
      console.log("studentSelectorChange");
      if (open && this.fetchingUsers) {
        this.usersAvailable = [];
        console.log("open and fetching");
        // 发送数据给后端, json格式
        axios({
          method: API.FETCH_ALL_USER.method,
          url: API.FETCH_ALL_USER.url,
        })
          .then((res) => {
            console.log(res.data);
            if (res.status === 200 && res.data.code === 200) {
              res.data.data.result.forEach((user) => {
                this.usersAvailable.push({
                  id: user.id,
                  name: user.name,
                });
              });
              this.fetchingUsers = false;
            } else {
              Message.error("获取用户列表失败");
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              this.CHANGE_LOCALSTORAGE_ON_LOGOUT();
              Message.error("UNAUTHORIZED: 请重新登录");
              login();
            } else {
              console.log(err);
              Message.error("获取用户列表失败");
            }
          });
      }
    },
    teacherSelectorChange(open) {
      console.log("teacherSelectorChange");
      if (open && this.fetchingTeachers) {
        console.log("open and fetching");
        this.teachersAvailable = [];
        this.createCourseForm.teachers = [];
        // 发送数据给后端, json格式
        axios({
          method: API.FETCH_ALL_TEACHER.method,
          url: API.FETCH_ALL_TEACHER.url,
        })
          .then((res) => {
            console.log(res.data);
            if (res.status === 200 && res.data.code === 200) {
              res.data.data.result.forEach((user) => {
                this.teachersAvailable.push({
                  id: user.id,
                  name: user.name,
                });
              });
              this.fetchingTeachers = false;
              this.createCourseForm.teachers.push(
                parseInt(localStorage.getItem("UserID"))
              );
            } else {
              Message.error("获取教师列表失败");
            }
          })
          .catch((err) => {
            if (err.response.status === 401) {
              this.CHANGE_LOCALSTORAGE_ON_LOGOUT();
              Message.error("UNAUTHORIZED: 请重新登录");
              login();
            } else {
              console.log(err);
              Message.error("获取教师列表失败");
            }
          });
      }
    },
    fetchUserCourses() {
      console.log("fetchUserCourses");
      axios({
        method: API.FETCH_USER_COURSE.method,
        url: API.FETCH_USER_COURSE.url,
        params: {
          id: localStorage.getItem("UserID"),
        },
        headers: {
          Authorization: localStorage.getItem("Authorization")
            ? localStorage.getItem("Authorization")
            : "",
        },
      })
        .then((res) => {
          console.log(res.data);
          this.courseList = [];
          if (
            res.status === 200 &&
            res.data.code === 200 &&
            res.data.data.result
          ) {
            res.data.data.result.forEach((course) => {
              this.courseList.push({
                id: course.CourseID,
                name: course.CourseName,
                teacher: course.CourseTeacher,
                announcements: course.CourseAnnounce,
                todoAssignments: course.CourseAssignments,
                type: course.CourseType,
                nearestDue:
                  course.NearestDue === ""
                    ? "None"
                    : new Date(Date.parse(course.NearestDue)).format(
                        "yyyy-MM-dd hh:mm:ss"
                      ),
                time: course.CourseTerm,
              });
            });
          } else {
            Message.error("获取课程列表失败");
          }
        })
        .catch((err) => {
          console.log("error:", err);
          if (err.response.status === 401) {
            this.CHANGE_LOCALSTORAGE_ON_LOGOUT();
            Message.error("UNAUTHORIZED: 请重新登录");
            login();
          } else {
            Message.error("获取课程列表失败");
          }
        });
    },
    createCourseDialogClose() {
      this.dialogFormVisible = false;
      this.fetchingTeachers = true;
      this.fetchingUsers = true;
    },
    isStudent() {
      return localStorage.getItem("Permission") === "0";
    },
  },
  created() {
    // before main.js init
    this.fetchUserCourses();
  },
  // mounted 在初始化页面完成后，再对dom节点进行相关操作
  mounted() {},
};
</script>

<style scoped>
.el-header,
.el-footer {
  text-align: center;
}
.el-main {
  text-align: center;
}
.el-table tr {
  cursor: pointer;
}

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
</style>
