import 'es6-promise/auto'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
        UserName: localStorage.getItem('UserName') ? localStorage.getItem('UserName') : '',
    },
    mutations: {
        // 修改token，并将token存入localStorage
        CHANGE_LOCALSTORAGE_ON_LOGIN (state, user) {
            state.Authorization = user.Authorization;
            state.UserName = user.UserName;
            localStorage.setItem('Authorization', user.Authorization);
            localStorage.setItem('UserName', user.UserName);
        },
        CHANGE_LOCALSTORAGE_ON_LOGOUT() {
            localStorage.removeItem('Authorization')
            localStorage.removeItem('UserName')
        }
    }
});

export default store;
