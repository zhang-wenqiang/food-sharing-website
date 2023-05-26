import { Link, useNavigate } from "react-router-dom";
import { Button, Input, message } from "antd";
import {
  UserOutlined,
  UnlockOutlined,
  WechatOutlined,
  QqOutlined,
} from "@ant-design/icons";
import "./index.scss";
import { useEffect, useState } from "react";
import { useStore } from "../../store";
import { setRememberMe, getRememberMe } from "../../utils";
function Login() {
  //用户手机号管理
  const [phone, setPhone] = useState("");
  //用户密码管理
  const [pwd, setPwd] = useState("");
  //记住我状态管理
  const [rememberM, setRememberM] = useState(false);
  //引用mbox仓库
  const { userStore } = useStore();
  //页面跳转函数
  const navigate = useNavigate();

  //点击登录
  const loginButton = async () => {
    if (phone === "") {
      message.info("请输入手机号", 1);
      return;
    }
    if (pwd === "") {
      message.info("请输入密码", 1);
      return;
    }
    if (rememberM) {
      setRememberMe(JSON.stringify({ phone, pwd }));
    }
    //这里根据phone和pwd的值发送请求，成功然后跳转登录页
    await userStore
      .getUserToken({ phone, pwd })
      .then((res) => {
        if (res) {
          //成功跳转主页
          navigate("/", { replace: true });
          message.success("登录成功", 1);
        } else {
          message.error("登录失败", 1);
        }
      })
      .catch((res) => {
        message.error("登录失败", 1);
      });
  };

  useEffect(() => {
    if (getRememberMe() === 0) {
      return;
    }
    const a = JSON.parse(getRememberMe());
    setPhone(a.phone);
    setPwd(a.pwd);
  }, []);

  return (
    <div className="loginWrapper">
      <div className="loginBox">
        <div className="loginTitle">
          <span className="active">登录</span>
          <b>·</b>
          <Link to="/register">
            <span>注册</span>
          </Link>
        </div>
        <div>
          <div className="input-box">
            <div className="first-input">
              <Input
                size="large"
                placeholder="手机号"
                prefix={<UserOutlined />}
                className="input-box-input-phone"
                style={{ border: "none", height: 50 }}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div>
              <Input
                size="large"
                placeholder="密码"
                prefix={<UnlockOutlined />}
                className="input-box-input-pwd"
                style={{ border: "none", height: 50 }}
                value={pwd}
                onChange={(e) => {
                  setPwd(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="remember">
            <div className="left">
              <input
                id="rememberMe"
                type="checkbox"
                onClick={(e) => {
                  setRememberM(e.target.checked);
                }}
              />
              <label htmlFor="rememberMe">记住我</label>
            </div>
            {/* <a className="right" href="/">
              登录遇到问题？
            </a> */}
          </div>
          <Button className="button" onClick={loginButton}>
            登录
          </Button>
          <div className="loginStyle">
            <p className="loginStyle-title">社交帐号登录</p>
            <ul className="styles">
              <li>
                <a href="/">
                  <WechatOutlined className="iconfont weixin" />
                </a>
              </li>
              <li>
                <a href="/">
                  <QqOutlined className="iconfont qq" />
                </a>
              </li>
              <li>
                <a href="/" className="more">
                  其他
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Login;
