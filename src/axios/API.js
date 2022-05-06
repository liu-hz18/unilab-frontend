const API = {
    LOGIN: {
        method: "get",
        url: "/login"
    },
    // admin apis
    ADD_TEACHERS: {
        method: "post",
        url: "/admin/add-teachers",
    },
    // teacher apis
    CREATE_COURSE: {
        method: "post",
        url: "/teacher/create-course",
    },
    FETCH_ALL_USER: {
        method: "get",
        url: "/teacher/fetch-all-user",
    },
    FETCH_ALL_TEACHER: {
        method: "get",
        url: "/teacher/fetch-all-teacher",
    },
    CREATE_ANNOCE: {
        method: "post",
        url: "/teacher/create-announcement",
    },
    CREATE_QUESTION: {
        method: "post",
        url: "/teacher/create-question",
    },
    CREATE_ASSIGNMENT: {
        method: "post",
        url: "/teacher/create-assignment",
    },
    // student apis
    FETCH_COURSE_NAME: {
        method: "get",
        url: "/student/fetch-course-name",
    },
    FETCH_ANNOCE_DETAIL: {
        method: "get",
        url: "/student/fetch-announcement-detail",
    },
    FETCH_ANNOCES: {
        method: "get",
        url: "/student/fetch-announcement",
    },
    FETCH_QUESTIONS: {
        method: "get",
        url: "/student/fetch-question",
    },
    FETCH_QUESTION_DETAIL: {
        method: "get",
        url: "/student/fetch-question-detail",
    },
    FETCH_QUESTION_APPENDIX: {
        method: "post",
        url: "/student/fetch-question-appendix"
    },
    FETCH_ASSIGNMENT: {
        method: "get",
        url: "/student/fetch-assignment"
    },
    FETCH_TESTIDS: {
        method: "get",
        url: "/student/fetch-all-testids",
    },
    UPDATE_TESTS: {
        method: "post",
        url: "/student/update-tests",
    },
    SUBMIT_CODE: {
        method: "post",
        url: "/student/submit-code",
    },
    FETCH_USER_COURSE: {
        method: "get",
        url: "/student/fetch-my-course"
    },
    // os apis
    OS_GRADE: {
        method: "get",
        url: "/student/Os/Grade"
    },
    OS_BRANCH_GRADE: {
        method: "get",
        url: "/student/Os/BranchGrade",
    },
    SUBMIT_TASK: {
        method: "post",
        url: "/student/submit-task",
    },
}
export default API;
