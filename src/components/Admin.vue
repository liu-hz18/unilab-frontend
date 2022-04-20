<template>
    <div id="admin" style="min-width: 1100px;">
        <h1 style="font-size: 25px; text-align: center; line-height:1.7;">Admin: 添加教师用户</h1>
        <el-upload
              class="upload-teachers"
              drag
              action=""
              :limit=1
              :accept="'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel'"
              :auto-upload="false"
              :on-change="handleUploadTeachersChange"
              :on-remove="handleUploadTeacherRemove"
              :on-exceed="handleUploadTeacherExceeded"
              style="margin-top: 3%;">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">上传“<b>*.xls(x)</b>”文件。(含表列“学号”与“姓名”)<br>拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <el-table
            :data="teachers"
            stripe
            height="250"
            style="width: 50%">
            <el-table-column
                prop="id"
                label="学工号"
                sortable
                width="180">
            </el-table-column>
            <el-table-column
                prop="name"
                label="姓名"
                sortable
                width="180">
            </el-table-column>
        </el-table>
        <el-button @click="BackToHome">Back To Home</el-button>
        <el-button type="primary" @click="commitCreateTeacherForm">确 定</el-button>
    </div>
</template>

<script>
import * as XLSX from 'xlsx'
import axios from "axios"
import { Message } from "element-ui"
import API from "@/axios/API.js"

export default {
    name: "UniLabAdmin",
    components: {

    },
    data() {
        return {
            teachers: [],
        }
    },
    methods: {
        BackToHome() {
            this.$router.push("/home")
        },
        readSingleExcelFile(file) {
            if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
                this.$message({
                message: '文件类型不正确，请上传.xls或.xlsx文件',
                type: 'error'
                })
                return false
            }
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
                const name = content[i]['姓名'];
                if (this.teachers.indexOf(id) == -1) {
                    this.teachers.push({
                        id: id, name: name
                    })
                }
            }
        },
        handleUploadTeachersChange(file, fileList) {
            console.log(file, fileList)
            this.readSingleExcelFile(file.raw)
        },
        handleUploadTeacherRemove(file, fileList) {
            console.log(file, fileList)
            this.teachers = []
        },
        handleUploadTeacherExceeded(file, fileList) {
            console.log(file, fileList)
            this.$message({
                message: '文件数量过多',
                type: 'error'
            })
        },
        commitCreateTeacherForm() {
            console.log(this.teachers)
            if (this.teachers.length > 0) {
                axios({
                    method: API.ADD_TEACHERS.method,
                    url: API.ADD_TEACHERS.url,
                    header: {
                        'Content-Type':'application/json',  //如果写成contentType会报错
                    },
                    data: this.teachers
                }).then( res => {
                    console.log(res.data)
                    if (res.status === 200 && res.data.code === 200) {
                        Message.success("教师用户创建成功")
                        this.teachers = []
                    } else {
                        Message.error("教师用户创建失败")
                    }
                }).catch( err => {
                    Message.error("教师用户创建失败")
                    console.log(err)
                })
            } else {
                Message.error("请至少添加一个用户")
            }
        }
    }
}
</script>


<style scoped>

</style>

