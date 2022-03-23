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
        ...mapMutations(['changeLogin']),
        login () {
            let _this = this;
            if (this.loginForm.username === '' || this.loginForm.password === '') {
                alert('账号或密码不能为空');
            } else {
                const formData = new FormData(); // 用form提交
                formData.append('userid', _this.loginForm.userid);
                formData.append('password', _this.loginForm.password);
                axios({
                    method: 'post',
                    url: 'http://localhost:1323/login',
                    data: formData
                }).then(res => {
                    console.log(res);
                    if (res.data.code == 200) {
                        _this.userToken = 'Bearer ' + res.data.data.token;
                        // 将用户token保存到vuex中
                        _this.changeLogin({ Authorization: _this.userToken });
                        _this.$router.push('/home');
                        alert('登陆成功');
                    } else {
                        alert('账号或密码错误');
                    }
                }).catch(error => {
                    alert('账号或密码错误');
                    console.log(error);
                });
            }
        }
    }
};
</script>
