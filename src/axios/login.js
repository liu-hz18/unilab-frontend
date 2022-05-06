import axios from "axios"
import { Message } from "element-ui"
import API from "./API.js"

export default function login() {
    axios({
        method: API.LOGIN.method,
        url: API.LOGIN.url,
    }).then(res => {
        console.log(res);
        if (res.status === 200) {
            // 网页重定向
            window.location.href = res.data.redirect_url
            // Message.success("登陆成功");
        } else {
            Message.error("登陆失败");
        }
    }).catch(err => { // 请求失败处理
        Message.error("认证失败");
        console.log(err);
    });
}

