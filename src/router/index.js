import Vue from 'vue'
import VueRouter from 'vue-router'

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
            name: "Home",
            component: UniLabCourse
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

export default router
