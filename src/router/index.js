import Vue from 'vue'
import VueRouter from 'vue-router'

import store from "@/store/store"
import login from "@/axios/login"
import { Message } from "element-ui"

Vue.use(VueRouter);

const AutoritityMap = {
    "admin": 2,
    "teacher": 1,
    "student": 0
}

const router = new VueRouter({
    mode: 'history',
    base: process.env.NODE_ENV === 'production' ? process.env.VUE_APP_SRC : "/",
    routes: [
        {
            path: '/',
            redirect: '/home'
        },
        {
            path: "/admin",
            name: "admin",
            // component: UniLabAdmin,
            component: resolve => require(["../components/Admin.vue"], resolve),
            meta: {
                permission: AutoritityMap["admin"]
            }
        },
        {
            path: '/login',
            name: 'login',
            // component: UniLabLogin,
            component: resolve => require(["../components/Login.vue"], resolve),
        },
        {
            path: '/home',
            name: 'home',
            // component: UniLabHome,
            component: resolve => require(["../components/Home.vue"], resolve),
            meta: {
                permission: AutoritityMap["student"]
            }
        },
        // oj related pages
        {
            path: "/ojlab",
            name: "ojlab",
            // component: UniLabOJPage,
            component: resolve => require(["../components/OJPage.vue"], resolve),
            meta: {
                permission: AutoritityMap["student"]
            }
        },
        {
            path: "/announcement",
            name: "announcement",
            // component: UniLabAnnouncementDisplay,
            component: resolve => require(["../components/AnnouncementDisplay.vue"], resolve),
            meta: {
                permission: AutoritityMap["student"]
            }
        },
        {
            path: "/question",
            name: "question",
            // component: UniLabQuestionDisplay,
            component: resolve => require(["../components/QuestionDisplay.vue"], resolve),
            meta: {
                permission: AutoritityMap["student"]
            }
        },
        {
            path: "/os",
            name: "os",
            // component: UniLabOsPage,
            component: resolve => require(["../components/OsPage.vue"], resolve),
            meta: {
                permission: AutoritityMap["student"]
            }
        },
        // os related pages
        {
            path: "/osgradelist",
            name: "oagradelist",
            // component: UniLabOsGrade,
            component: resolve => require(["../components/OsGradeList.vue"], resolve),
            meta: {
                permission: AutoritityMap["student"]
            }
        },
        // 404s
        {
            path: "/404",
            name: "NotFound",
            // component: UniLab404,
            component: resolve => require(["../components/404.vue"], resolve),
            meta: {
                permission: AutoritityMap["student"]
            }
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
    console.log("path:", to.path);
    if(to.path === "/login"){
        if (to.query.token && to.query.username) {
            console.log("from gitlab login callback.");
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
        } else {
            Message.success('请手动登录');
        }
    } else {
        let token = localStorage.getItem('Authorization');
        let permission = localStorage.getItem('Permission');
        if (token === null || token === '') {
            console.log("token is none!");
            login();
        } else if ( to.meta.permission ) {
            parseInt(permission) >= parseInt(to.meta.permission) ? next() : next("/404");
        } else {
            next();
        }
    }
});

export default router;
