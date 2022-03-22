
<template>
  <div id="course">
    <el-container>
      <el-header>
        <el-row :gutter="20" style="background-color: #BBD9F8;">
          <el-col :span="8"><h1 style="font-size: 20px; text-align: left; margin-left: 5px; line-height:1.7;">UniLab Platform</h1></el-col>
          <el-col :span="12"></el-col>
          <!-- TODO: for user login -->
          <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
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
        <el-form :model="createCourseForm">
          <el-form-item label="课程名称" :label-width="'120px'" required>
            <el-input v-model="createCourseForm.name" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="教师" :label-width="'120px'" required>
            <el-input v-model="createCourseForm.teachername" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="请选择教学人员" :label-width="'120px'" required>
            <el-select v-model="createCourseForm.teachers" placeholder="可多选" multiple filterable style="width: 600px;">
              <el-option
                  v-for="user in usersAvailable"
                  :key="user.id"
                  :label="user.id + '  ' + user.name"
                  :value="user.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="请选择学生" :label-width="'120px'" required>
            <el-select v-model="createCourseForm.students" placeholder="可多选" multiple filterable collapse-tags style="width: 600px;">
              <el-option
                  v-for="user in usersAvailable"
                  :key="user.id"
                  :label="user.id + '  ' + user.name"
                  :value="user.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="课程类型" :label-width="'120px'" required>
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
// TODO: auth login, user database, course list page, hw list page, question list page, test list page

export default {
  name: 'UniLabCourse',
  components: {
    
  },
  data() {
    return {
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
          id: 2018011446,
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
      search: ''
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
    handleEdit(index, row) {
      console.log(index, row);
    },
    handleDelete(index, row) {
      this.tableData.splice(index, 1);
      console.log(index, row);
    },
    handleRowClick(row, column, event) {
      console.log(row, row.id, row.name, column, event);
      console.log("handleRowClick() jump to /lab");
      this.$router.push({ path: "/lab", query: { tabindex: '1' } });
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

