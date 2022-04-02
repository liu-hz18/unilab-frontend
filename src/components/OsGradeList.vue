<template>
    <div id="osgrade">
        <el-container>
            <el-header>
            <el-row :gutter="20" style="background-color: #DCDFE6;">
            <el-col :span="8">
                <h1 style="font-size: 20px; text-align: left; margin-left: 5px; line-height:1.7;">Operating System</h1>
            </el-col>
            <el-col :span="12"></el-col>
            <!-- TODO: for user login -->
            <el-col :span="4"><div class="grid-content bg-purple"></div></el-col>
            </el-row>
        </el-header>
            <el-main>
                <el-collapse v-model="activeNames" @change="handleChange">
                    <el-collapse-item :title="'所有测试点  Pass：'+info.n_passed+'，Fail：'+info.n_failed+'，Total：'+info.total_score" name="1">
                        <el-table :data="tests" style="width: 100%">
                            <el-table-column prop="Id" label="编号" align="center">
                            </el-table-column>
                            <el-table-column prop="Name" label="测试点名称" align="center">
                            </el-table-column>
                            <el-table-column prop="Passed" label="状态" align="center">
                                <template slot-scope="scope">
                                    <el-tag :class="scope.row.Passed === true?'el-icon-success':'el-icon-error'" :type="scope.row.Passed === true? 'success':'danger'">
                                    </el-tag>
                                </template>
                            </el-table-column>
                            <el-table-column prop="Score" label="得分" align="center">
                            </el-table-column>
                        </el-table>
                    </el-collapse-item>
                    <el-collapse-item v-for="output of outputs" :key="output.Id" :title="output.Type">
                        <pre><span v-for="span of output.all_spans"
                            :key="`span-${span.id}`"
                            v-bind:style="span.css"
                        >{{ span.text }}</span></pre>
                    </el-collapse-item>
                    <!-- <el-collapse-item title="CI Output" name="2">
                        
                    </el-collapse-item>
                    <el-collapse-item title="Compile" name="3">
                        
                    </el-collapse-item>
                    <el-collapse-item title="Run" name="4">
                        
                    </el-collapse-item>
                    <el-collapse-item title="Check" name="5">
                        
                    </el-collapse-item>
                    <el-collapse-item title="CI Output" name="6">
                        
                    </el-collapse-item> -->
                </el-collapse>
            </el-main>
        </el-container>
    </div>
</template>

<style scoped>
::v-deep .el-collapse-item__header{
    padding-left: 20px;
    font-size: 15px;
    margin-left: 15px;
}
</style>

<script>
import axios from "axios"
import ansicolor from "ansicolor"
import {test} from "@/js/test.js"

export default{
    name: 'UniLabOsGrade',
    components:{

    },
    data(){
        return {
            activeNames:['1'],
            tests:null,
            outputs:null,
            info:{
                "n_passed":0,
                "n_failed":0,
                "total_score":0
            }
        };
    },
    methods:{
        handleChange(val){
            console.log(val);
        },
    },
    mounted() {
        axios({
            method: 'get',
            url: 'http://localhost:1323/Os/Grade',
            params: {
                id: localStorage.getItem("UserID") || ""
            }
        }).then(res => {
            this.tests=res.data.tests
            this.outputs=res.data.outputs
            for(const output of this.outputs){
                output.Content=test(output.Content)
                output.all_spans=ansicolor.parse(output.Content).spans
                for(const idx in output.all_spans){
                    output.all_spans[idx].id=idx
                }
            }
            this.info.total_score=this.tests.map((x)=>x.Score).reduce((x,y)=>x+y,0);
            this.info.n_passed=this.tests.filter((x)=>x.Passed).length;
            this.info.n_failed=this.tests.filter((x)=>!x.Passed).length;
        }).catch(function (error) { // 请求失败处理
            console.log(error);
        });
    }
}
</script>