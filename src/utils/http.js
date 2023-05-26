//封装axios

//实例化   请求拦截器    响应拦截器
import axios from "axios";
import { getToken } from "./token";
//import { history } from "./history";

const http = axios.create({
  baseURL: "http://localhost:8001",
  timeout: 5000,
});
// 添加请求拦截器
http.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
http.interceptors.response.use(
  (response) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response;
  },
  (error) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么，比如说本地token被改变了，则就会跳转到登录页
    console.dir("http请求错误：" + error);
    //这里返回的状态码是由后端决定的
    if (error.response.status === 401) {
      //跳转登录页
      //history.push("/");
    }
    return Promise.reject(error);
  }
);

export { http };
