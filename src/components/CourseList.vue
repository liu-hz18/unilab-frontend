<template>
  <div id="course">
    <el-container>
      <el-header>
        <el-row :gutter="20" style="background-color: #DCDFE6;">
          <el-col :span="8"><h1 style="font-size: 20px; text-align: left; margin-left: 5px; line-height:1.7;">UniLab Online Judge</h1></el-col>
          <el-col :span="12"></el-col>
          <!-- TODO: for user login -->
          <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
        </el-row>
      </el-header>

      <el-container>
        <el-main>      
          <el-input
            v-model="search"
            size="medium"
            placeholder="输入关键字搜索"
          />

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
            <div v-for="o in 4" :key="o" class="text item">
              {{'用户登入时间 ' + o }}
            </div>
          </el-card>
        </el-aside>
      </el-container>
      
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
        nearestDue: "2022/03/15 24:00",
        time: "2019-2020春季学期"
      }, {
        id: 1,
        name: '面向对象程序设计基础',
        teacher: 'Bob',
        announcements: 3,
        todoAssignments: 4,
        nearestDue: "2022/03/15 24:00",
        time: "2019-2020春季学期"
      }, {
        id: 2,
        name: 'JAVA程序设计基础',
        teacher: 'CCC',
        announcements: 3,
        todoAssignments: 4,
        nearestDue: "2022/03/15 24:00",
        time: "2019-2020春季学期"
      }, {
        id: 3,
        name: 'Python程序设计基础',
        teacher: 'DDD',
        announcements: 3,
        todoAssignments: 4,
        nearestDue: "2022/03/15 24:00",
        time: "2019-2020春季学期"
      }],
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

