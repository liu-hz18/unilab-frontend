<template>
  <div>
    <input type="text" v-model="loginForm.userid" placeholder="学号"/>
    <input type="text" v-model="loginForm.password" placeholder="密码"/>
    <button @click="login">登录</button>
  </div>
</template>
 

<script>
import { mapMutations } from 'vuex';
import axios from "axios"
import { Message } from "element-ui"

export default {
    name: 'UniLabLogin',
    components: {

    },
    data () {
        return {
            loginForm: {
                userid: '',
                password: ''
            },
            userToken: ''
        };
    },
    methods: {
        ...mapMutations([
            'CHANGE_LOCALSTORAGE_ON_LOGIN',
        ]),
        login () {
            axios({
                method: 'get',
                url: 'http://localhost:1323/login',
            }).then(res => {
                console.log(res);
                if (res.status === 200) {
                    // 网页重定向
                    window.location.href = res.data.redirect_url
                    Message.success("登陆成功");
                } else {
                    Message.error("登陆失败");
                }
            }).catch(function (error) { // 请求失败处理
                Message.error("认证失败");
                console.log(error);
            });
        }
    },
    mounted(){
        // console.log("test");
        // console.log(this.$route.query);
        // let _this = this;
        // if(this.$route.query.token){
        //     // bearer: 持票人
        //     _this.userToken = 'Bearer ' + this.$route.query.token;
        //     // 将用户token保存到vuex中
        //     _this.CHANGE_LOCALSTORAGE_ON_LOGIN({
        //         Authorization: _this.userToken,
        //         UserName: this.$route.query.username,
        //         Permission: this.$route.query.permission,
        //         UserID: this.$route.query.userid,
        //     });
        //     _this.$router.push('/home');
        //     Message.error('登陆成功');
        // }
    }
};
</script>
