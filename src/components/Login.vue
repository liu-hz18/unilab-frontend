<template>
  <div>
    <input type="text" v-model="loginForm.userid" placeholder="学号"/>
    <!-- <input type="text" v-model="loginForm.password" placeholder="密码"/> -->
    <!-- <button @click="login">登录</button> -->
  </div>
</template>
 

<script>
import login from "@/axios/login.js"

export default {
    name: 'UniLabLogin',
    components: {},
    data () {
        return {
            loginForm: {
                userid: '',
                password: ''
            },
        };
    },
    methods: {
        login () {
            login();
        }
    },
    mounted(){ }
};

</script>
