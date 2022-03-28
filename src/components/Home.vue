
<template>
  <div id="course">
    <el-container>
      <el-header>
        <el-row :gutter="20" style="background-color: #BBD9F8;">
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <h1 style="font-size: 20px; text-align: left; margin-left: 5px; line-height:1.7;">UniLab Platform</h1> 
            </div>
          </el-col>
          <!-- <el-col :span="10"><div class="grid-content bg-purple"></div></el-col> -->
          <!-- TODO: for user logout -->
          <el-col :span="3" :offset="11" style="margin-top: 9px;">
            <div class="grid-content bg-purple">
              <h2 style="font-size: 16px; text-align: right; line-height:1.5; color: #909399;">Hello {{ username }} !</h2>
            </div>
          </el-col>
          <el-col :span="2" style="margin-top: 13px;">
            <div class="grid-content bg-purple">
              <el-tooltip class="item" effect="dark" content="退出登录" placement="top-start">
                <el-button icon="el-icon-switch-button" circle @click="handleLogOut"></el-button>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
      </el-header>

      <el-container>
        <el-main>
          <el-row>
            <el-col :span="21">
              <el-input
                v-model="search"
                size="medium"
                placeholder="输入关键字搜索"
              />
            </el-col>
            <el-col :span="3">
              <el-button type="text" @click="dialogFormVisible = true">
                <i class="el-icon-circle-plus-outline"></i>&nbsp;新建课程
              </el-button>
            </el-col>
          </el-row>
          

          <el-table
            :data="showItems"
            stripe
            :default-sort = "{prop: 'id', order: 'ascending'}"
            style="width: 100%; margin-top: 20px;"
            @row-click="handleRowClick">

            <el-table-column
              label="ID"
              prop="id"
              width="60"
              sortable>
            </el-table-column>
            <el-table-column
              label="Course"
              prop="name"
              sortable>
            </el-table-column>
            <el-table-column
              label="Teacher"
              prop="teacher"
              width="100"
              sortable>
            </el-table-column>
            <el-table-column
              label="Announcements"
              prop="announcements"
              width="160"
              sortable>
            </el-table-column>
            <el-table-column
              label="AssignmentsToDo"
              prop="todoAssignments"
              width="170"
              sortable>
            </el-table-column>
            <el-table-column
              label="Nearest Due"
              prop="nearestDue"
              width="150"
              sortable>
            </el-table-column>
            <el-table-column
              label="Term"
              prop="time"
              sortable>
            </el-table-column>
          </el-table>
        </el-main>

        <el-aside width="250px" style="margin-top: 20px; margin-right: 10px;">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>操作记录</span>
            </div>
            <el-timeline style="padding: 10px;">
              <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :timestamp="activity.timestamp">
                {{activity.content}}
              </el-timeline-item>
            </el-timeline>
          </el-card>
        </el-aside>
      </el-container>

      <el-dialog title="新建课程" :visible.sync="dialogFormVisible">
        <el-form :model="createCourseForm" label-width="140px">
          <el-form-item label="课程名称" required>
            <el-input v-model="createCourseForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="教师" required>
            <el-input v-model="createCourseForm.teachername" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="请选择教学人员" required>
            <el-select v-model="createCourseForm.teachers" placeholder="可多选" multiple filterable clearable style="width: 90%;">
              <el-option
                  v-for="user in usersAvailable"
                  :key="user.id"
                  :label="user.id + '  ' + user.name"
                  :value="user.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请选择或导入学生" required>
            <el-select v-model="createCourseForm.students" placeholder="可多选" multiple filterable collapse-tags clearable style="width: 90%;">
              <el-option
                  v-for="user in usersAvailable"
                  :key="user.id"
                  :label="user.id + '  ' + user.name"
                  :value="user.id">
              </el-option>
            </el-select>
            <el-upload
              class="upload-students"
              drag
              action=""
              multiple
              :limit=10
              :accept="'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'"
              :auto-upload="false"
              :on-change="handleUploadStudentChange"
              :on-remove="handleUploadStudentRemove"
              :on-exceed="handleUploadStudentExceeded"
              style="margin-top: 3%;">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">上传<b>网络学堂</b>导出的“<b>学生信息.xls</b>”文件。<br>拖到此处，或<em>点击上传</em></div>
            </el-upload>
          </el-form-item>
          <el-form-item label="课程类型" required>
            <el-select v-model="createCourseForm.type" placeholder="">
              <el-option label="OJ-based" value="OJ"></el-option>
              <el-option label="GitLab-based" value="GitLab"></el-option>
              <el-option label="System" value="System"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>
      
    </el-container>
  </div>
</template>


<script>
import { mapMutations } from 'vuex';
import XLSX from 'xlsx'
// TODO: auth login, user database, course list page, hw list page, question list page, test list page

export default {
  name: 'UniLabHome',
  components: {
    
  },
  data() {
    return {
      username: this.$store.state.UserName || 'unknown',
      courseList: [{
        id: 0,
        name: '程序设计基础',
        teacher: 'Alice',
        announcements: 3,
        todoAssignments: 4,
        type: "OJ",
        nearestDue: "2022/03/15 24:00",
        time: "2019-2020春季学期"
      }, {
        id: 1,
        name: '面向对象程序设计基础',
        teacher: 'Bob',
        announcements: 3,
        todoAssignments: 4,
        type: "OJ",
        nearestDue: "2022/03/15 24:00",
        time: "2019-2020春季学期"
      }, {
        id: 2,
        name: 'JAVA程序设计基础',
        teacher: 'CCC',
        announcements: 3,
        todoAssignments: 4,
        type: "OJ",
        nearestDue: "2022/03/15 24:00",
        time: "2019-2020春季学期"
      }, {
        id: 3,
        name: 'Python程序设计基础',
        teacher: 'DDD',
        announcements: 3,
        todoAssignments: 4,
        type: "OJ",
        nearestDue: "2022/03/15 24:00",
        time: "2019-2020春季学期"
      }],
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
      createCourseForm: {
        name: "",
        type: "",
        teachername: "",
        teachers: [],
        students: [],
      },
      usersAvailable: [
        {
          id: 2016012395,
          name: "liuhz",
        },
        {
          id: 2018011447,
          name: "liuhy",
        },
        {
          id: 2018011448,
          name: "liuhx",
        },
      ],
      dialogFormVisible: false,
      search: '',
    }
  },
  computed: {
    showItems() {
      return this.courseList.filter(
        data => !this.search
        || data.name.toLowerCase().includes(this.search.toLowerCase())
        || data.teacher.toLowerCase().includes(this.search.toLowerCase())
      );
    }
  },
  methods: {
    ...mapMutations([
        'CHANGE_LOCALSTORAGE_ON_LOGOUT',
    ]),
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      this.tableData.splice(index, 1);
      console.log(index, row);
    },
    handleRowClick(row, column, event) {
      console.log(row, row.id, row.name, column, event);
      console.log("handleRowClick() jump to /ojlab");
      this.$router.push({ path: "/ojlab", query: { tabindex: '1' } });
    },
    handleUploadStudentChange(file, fileList) {
      // 上传多个文件的时候会多次调用此函数
      console.log("changed", file, fileList)
      this.readSingleExcelFile(file.raw)
    },
    handleUploadStudentExceeded(file, fileList) {
      console.log(file, fileList)
      this.$message({
          message: '文件数量过多',
          type: 'error'
        })
    },
    handleUploadStudentRemove(file, fileList) {
      console.log(file, fileList)
    },
    readSingleExcelFile(file) {
      if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
        this.$message({
          message: '文件类型不正确，请上传.xls或.xlsx文件',
          type: 'error'
        })
        return false
      }
      // let that = this;
      const fileReader = new FileReader();
      fileReader.onload = (ev) => {
        try {
          const data = ev.target.result
          const workbook = XLSX.read(data, {
            type: 'binary'
          })
          const worksheetname = workbook.SheetNames[0]
          this.resolveExcelContent(XLSX.utils.sheet_to_json(workbook.Sheets[worksheetname]))
        } catch (e) {
          this.$message({
            message: '文件解析失败(' + e + ')，请检查文件内容',
            type: 'error'
          })
        }
      }
      fileReader.readAsBinaryString(file)
      return true
    },
    resolveExcelContent(content) {
      for (var i = 0, len=content.length; i < len; i++) {
        if (Object.keys(content[i]).indexOf('学号') == -1) {
          this.$message({
            message: '文件解析失败，请检查文件内容, 取消并重新上传',
            type: 'error'
          })
          break;
        }
        const id = parseInt(content[i]['学号']);
        if (this.createCourseForm.students.indexOf(id) == -1) {
          this.createCourseForm.students.push(id)
        }
      }
    },
    handleLogOut() {
      this.CHANGE_LOCALSTORAGE_ON_LOGOUT()
      this.$router.push("/login")
    }
  },
  // mounted 在初始化页面完成后，再对dom节点进行相关操作
  mounted() {
    
  }
}
</script>


<style scoped>
.el-header, .el-footer {
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
  clear: both
}

</style>
