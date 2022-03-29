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
    if (to.path === '/login') {
        next();
    } else {
        let token = localStorage.getItem('Authorization');
        let permission = localStorage.getItem('Permission');
        if (token === null || token === '') {
            next('/login');
        } else if ( to.meta.permission ) {
            permission === to.meta.permission ? next() : next("/404");
        } else {
            next();
        }
    }
});

export default router
