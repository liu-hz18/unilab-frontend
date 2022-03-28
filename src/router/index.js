import Vue from 'vue'
import VueRouter from 'vue-router'

import UniLabLogin from "../components/Login.vue"
import UniLabEditor from "../components/Editor.vue"
import UniLabHome from "../components/Home.vue"
import UniLabOJPage from "../components/OJPage.vue"
import UniLabAnnouncementDisplay from "../components/AnnouncementDisplay.vue"
import UniLabQuestionDisplay from "../components/QuestionDisplay.vue"
// import UniLab from "../App.vue"

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
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
        }
    ]
})

// 导航守卫
// 使用 router.beforeEach 注册一个全局前置守卫，判断用户是否登陆
router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
        next();
    } else {
        let token = localStorage.getItem('Authorization');
        if (token === null || token === '') {
            next('/login');
        } else {
            next();
        }
    }
});

export default router
