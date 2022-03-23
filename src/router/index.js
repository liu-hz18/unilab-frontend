import Vue from 'vue'
import VueRouter from 'vue-router'

import UniLabLogin from "../components/Login.vue"
import UniLabEditor from "../components/Editor.vue"
import UniLabCourse from "../components/CourseList.vue"
import UniLabCoursePage from "../components/CoursePage.vue"
import UniLabAnnouncementDisplay from "../components/AnnouncementDisplay.vue"
import UniLabQuestionDisplay from "../components/QuestionDisplay.vue"
// import UniLab from "../App.vue"

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/course'
        },
        {
            path: '/login',
            name: 'login',
            component: UniLabLogin
        },
        {
            path: '/home',
            redirect: '/course'
        },
        {
            path: '/course',
            name: "Course",
            component: UniLabCourse
        },
        {
            path: "/lab",
            name: "CoursePage",
            component: UniLabCoursePage
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
