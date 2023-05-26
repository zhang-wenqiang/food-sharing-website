import { makeAutoObservable, runInAction } from "mobx";
import {
  deleteToken,
  getToken,
  setToken,
  getUserInfo,
  setUserInfo,
  deleteUserInfo,
} from "../utils";
import axios from "axios";

class UserStore {
  //用户临时token
  token = getToken() || null;
  //用户信息
  currentUserInfo = getUserInfo() || null;
  constructor() {
    makeAutoObservable(this);
  }

  //获取用户token，用来登录
  getUserToken = async ({ phone, pwd }) => {
    let result = false;
    const params = new URLSearchParams();
    params.append("params", JSON.stringify({ phone, pwd }));
    //这里网络请求，成功就执行下面的操作
    await axios
      .post("/api1/user/login", params)
      .then((res) => {
        if (res.data.status === 1) {
          const tmp = JSON.stringify(res.data);
          runInAction(() => {
            this.token = tmp;
          });
          setToken(tmp);
          setUserInfo(tmp);
          result = true;
        }
      })
      .catch((err) => {
        console.log("失败", err);
      });
    return result;
  };

  //重新更改登录信息
  changeLoginInfo = (params) => {
    const tmp = JSON.stringify(params);
    runInAction(() => {
      this.token = tmp;
    });
    setToken(tmp);
    setUserInfo(tmp);
  };

  //清除用户token，退出
  clearUserToken = () => {
    deleteToken();
    deleteUserInfo();
    this.token = null;
  };

  //用户注册
  userRegister = async ({ name, phone, pwd, sex, avatar }) => {
    const params = new URLSearchParams();
    params.append("params", JSON.stringify({ name, phone, pwd, sex, avatar }));
    let result = false;
    await axios
      .post("/api1/user/register", params)
      .then((res) => {
        const tmp = JSON.stringify(res.data);
        console.log(tmp);
        runInAction(() => {
          this.token = tmp;
        });

        setToken(tmp);
        setUserInfo(tmp);
        result = true;
      })
      .catch((err) => {});
    return result;
  };
}
export default UserStore;
