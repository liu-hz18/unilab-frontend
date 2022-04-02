import Vue from 'vue'
import VueRouter from 'vue-router'

import UniLabAdmin from "../components/Admin.vue"
import UniLabLogin from "../components/Login.vue"
import UniLabEditor from "../components/Editor.vue"
import UniLabHome from "../components/Home.vue"
import UniLabOJPage from "../components/OJPage.vue"
import UniLabAnnouncementDisplay from "../components/AnnouncementDisplay.vue"
import UniLabQuestionDisplay from "../components/QuestionDisplay.vue"
import UniLab404 from "../components/404.vue"
import UniLabOsGrade from "../components/OsGradeList.vue"
import store from "@/store/store"
import axios from "axios"
import { Message } from "element-ui"
// import UniLab from "../App.vue"

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: "/admin",
            name: "admin",
            component: UniLabAdmin,
            meta: {
                permission: 'admin' // ['admin', 'teacher', 'student']
            }
        },
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: '/login',
            name: 'login',
            component: UniLabLogin
        },
        {
            path: '/home',
            name: 'home',
            component: UniLabHome
        },
        {
            path: "/ojlab",
            name: "ojlab",
            component: UniLabOJPage
        },
        {
            path: "/os",
            name: "os",
            component: UniLabOsGrade
        },
        {
            path: '/editor',
            name: "Editor",
            component: UniLabEditor
        },
        {
            path: "/announcement",
            name: "announcement",
            component: UniLabAnnouncementDisplay
        },
        {
            path: "/question",
            name: "question",
            component: UniLabQuestionDisplay
        },
        {
            path: "/404",
            name: "NotFound",
            component: UniLab404
        },
        {
            path: "*",
            redirect: "/404"
        }
    ]
})

// 路由中间件
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆并鉴权
router.beforeEach((to, from, next) => {
    if(to.query.token && to.query.username){
        // bearer: 持票人
        let userToken = 'Bearer ' + to.query.token;
        // 将用户token保存到vuex中
        store.state.Authorization = userToken;
        store.state.UserName = to.query.username;
        store.state.Permission = to.query.permission;
        store.state.UserID = to.query.userid;
        localStorage.setItem('Authorization', userToken);
        localStorage.setItem('UserName', to.query.username);
        localStorage.setItem('Permission', to.query.permission);
        localStorage.setItem('UserID', to.query.userid);
        next('/home');
        Message.success('登陆成功');
    }else{
        let token = localStorage.getItem('Authorization');
        let permission = localStorage.getItem('Permission');
        if (token === null || token === '') {
            // next('/login');
            axios({
                method: 'get',
                url: 'http://localhost:1323/login',
            }).then(res => {
                console.log(res);
                if (res.status == 200) {
                    window.location.href = res.data.redirect_url
                    // this.$message.success("登陆成功");
                } else {
                    Message.error("登陆失败");
                }
            }).catch(function (error) { // 请求失败处理
                Message.error("登陆失败");
                console.log(error);
            });
        } else if ( to.meta.permission ) {
            permission === to.meta.permission ? next() : next("/404");
        } else {
            next();
        }
    }
});

export default router