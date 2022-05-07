// import 'es6-promise/auto'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
        UserName: localStorage.getItem('UserName') ? localStorage.getItem('UserName') : '',
        UserID: localStorage.getItem('UserID') ? localStorage.getItem('UserID') : '',
        Permission: localStorage.getItem('Permission') ? localStorage.getItem('Permission') : '',
        Code: localStorage.getItem('Code') ? localStorage.getItem('Code') : '',
        Language: localStorage.getItem('Language') ? localStorage.getItem('Language') : '',
    },
    mutations: {
        // 修改token，并将token存入localStorage
        CHANGE_LOCALSTORAGE_ON_LOGIN (state, user) {
            state.Authorization = user.Authorization; // token
            state.UserName = user.UserName;
            state.Permission = user.Permission;
            state.UserID = user.UserID;
            state.Code = localStorage.getItem('Code') ? localStorage.getItem('Code') : '';
            state.Language = localStorage.getItem('Language') ? localStorage.getItem('Language') : '';
            localStorage.setItem('Authorization', user.Authorization);
            localStorage.setItem('UserName', user.UserName);
            localStorage.setItem('Permission', user.Permission);
            localStorage.setItem('UserID', user.UserID);
        },
        CHANGE_LOCALSTORAGE_ON_LOGOUT(state) {
            state.Authorization = ""; // token
            state.UserName = "";
            state.Permission = "";
            state.UserID = "";
            state.Code = "";
            localStorage.removeItem('Authorization')
            localStorage.removeItem('UserName')
            localStorage.removeItem('Permission')
            localStorage.removeItem('UserID')
            localStorage.removeItem('Code')
            localStorage.removeItem('Language')
        }
    }
});

export default store;
