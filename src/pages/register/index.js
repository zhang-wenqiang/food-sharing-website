import "./index.scss";
import { Button, Input, message, Radio, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import {
  UserOutlined,
  UnlockOutlined,
  WechatOutlined,
  QqOutlined,
  MobileOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "../../store";
function Register() {
  //结构user仓库
  const { userStore, utilsStore } = useStore();
  //页面跳转
  const navigate = useNavigate();
  //用户名字
  const [userName, setUserName] = useState();
  //用户手机号
  const [phone, setPhone] = useState();
  //用户密码
  const [pwd, setPwd] = useState();
  //头像管理
  const [fileListT, setFileListT] = useState([]);

  //图片上传前控制大小，小于1MB
  const beforeUploadImage = (file) => {
    const size = file.size < 1048576;
    if (!size) {
      message.error("图片大小应小于1MB", 2);
    }
    return size;
  };
  //头像信息改变触发函数
  const avatarOnChange = ({ fileList }) => {
    const tmp = fileList.map((item) => {
      if (item.response) {
        return { url: item.response };
      }
      return item;
    });
    setFileListT(tmp);
  };
  //调用注册函数
  const registerButton = async () => {
    if (!userName) {
      message.info("请输入名字", 1);
      return;
    }
    if (!phone) {
      message.info("请输入手机号", 1);
      return;
    }
    if (!pwd) {
      message.info("请输入密码", 1);
      return;
    }
    if (fileListT.length > 0 && fileListT[0].url) {
      await userStore
        .userRegister({
          name: userName,
          phone,
          pwd,
          sex,
          avatar: fileListT[0].url,
        })
        .then((res) => {
          if (res) {
            navigate("/");
            message.info("注册成功，已登录！", 1);
          } else {
            message.info("失败", 1);
          }
        })
        .catch((err) => {
          message.info("登录失败+" + err, 1);
        });
    } else {
      message.info("头像大小不应超过1m", 1);
      setFileListT([]);
    }
  };

  //性别管理状态
  const [sex, setSex] = useState("男");
  //性别切换触发函数
  const onSexChange = (e) => {
    setSex(e.target.value);
  };

  return (
    <div>
      <div className="loginWrapper">
        <div className="loginBox">
          <div className="loginTitle">
            <Link to="/login">
              <span>登录</span>
            </Link>
            <b>·</b>
            <span className="active">注册</span>
          </div>
          <Upload
            name="image"
            accept="image/*"
            listType="picture-circle"
            action={utilsStore.uploadImgUrl}
            fileList={fileListT}
            onChange={avatarOnChange}
            maxCount={1}
            beforeUpload={beforeUploadImage}
          >
            <div style={{ marginTop: 8 }}>
              <PlusOutlined />
            </div>
          </Upload>
          <div>
            <div className="input-box">
              <div className="first-input">
                <Input
                  size="large"
                  placeholder="请输入您的昵称"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  prefix={<UserOutlined />}
                  style={{ border: "none", height: 50 }}
                />
              </div>
              <div className="first-input">
                <Input
                  size="large"
                  placeholder="请输入您的手机号"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  prefix={<MobileOutlined />}
                  style={{ border: "none", height: 50 }}
                />
              </div>
              <div className="first-input">
                <Input
                  size="large"
                  placeholder="请输入您的密码"
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  prefix={<UnlockOutlined />}
                  style={{ border: "none", height: 50 }}
                />
              </div>
            </div>

            <Radio.Group onChange={onSexChange} value={sex}>
              <Radio value={"男"}>男</Radio>
              <Radio value={"女"}>女</Radio>
            </Radio.Group>
            <Button className="button" onClick={registerButton}>
              注册
            </Button>
            <p className="conditions">
              点击 “注册” 即表示您同意并愿意遵守简书
              <br />
              <a href="/register">用户协议</a> 和{" "}
              <a href="/register">隐私政策</a> 。
            </p>
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
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
