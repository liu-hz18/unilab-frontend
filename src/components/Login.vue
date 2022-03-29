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
            let _this = this;
            if (this.loginForm.username === '' || this.loginForm.password === '') {
                Message.warning('账号或密码不能为空');
            } else {
                const formData = new FormData(); // 用form提交
                formData.append('userid', _this.loginForm.userid);
                formData.append('password', _this.loginForm.password);
                axios({
                    method: 'post',
                    url: 'login',
                    data: formData
                }).then(res => {
                    console.log(res, res.data.data);
                    if (res.data.code == 200) {
                        // bearer: 持票人
                        _this.userToken = 'Bearer ' + res.data.data.token;
                        // 将用户token保存到vuex中
                        _this.CHANGE_LOCALSTORAGE_ON_LOGIN({
                            Authorization: _this.userToken,
                            UserName: res.data.data.username,
                            Permission: res.data.data.permission,
                            UserID: _this.loginForm.userid,
                        });
                        _this.$router.push('/home');
                        Message.success('登陆成功', _this.loginForm.userid);
                    } else {
                        Message.error('账号或密码错误');
                    }
                }).catch(error => {
                    Message.error('账号或密码错误');
                    console.log(error);
                });
            }
        }
    }
};
</script>
