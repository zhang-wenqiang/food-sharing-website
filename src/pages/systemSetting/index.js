import "./index.scss";
import {
  Avatar,
  Space,
  message,
  Button,
  Input,
  Menu,
  Radio,
  Upload,
  Modal,
} from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const { TextArea } = Input;
function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}
const items = [
  getItem("基本设置", "1", <MailOutlined />),
  getItem("个人资料", "2", <MailOutlined />),
  getItem("黑名单", "3", <MailOutlined />),
];
function SystemSetting() {
  const navigate = useNavigate();
  const { userStore } = useStore();
  //显示内容
  const [viewKey, setViewKey] = useState("1");
  //头像
  const [avatar, setAvatar] = useState("");
  //性别管理
  const [sex, setSex] = useState("男");
  //昵称
  const [name, setName] = useState("");
  //个人介绍
  const [description, setDescription] = useState("");
  //用户信息
  const [userInfo, setUserInfo] = useState({});
  //修改密码弹窗
  const [isModalOpen, setIsModalOpen] = useState(false);
  //旧密码
  const [oldPwd, setOldPwd] = useState("");
  //新密码
  const [newPwd, setNewPwd] = useState("");
  //更改viewKey
  const changeViewKey = (e) => {
    setViewKey(e.key);
  };
  //图片上传前控制大小，小于1MB
  const beforeUploadImage = (file) => {
    const size = file.size < 1048576;
    if (!size) {
      message.error("图片大小应小于1MB", 2);
    }
    return size;
  };
  //上传信息变化函数
  const imgOnChange = ({ file }) => {
    if (file.status === "done") {
      setAvatar(file.response);
    }
  };

  //修改密码
  const handleOk = async () => {
    if (oldPwd === newPwd) {
      message.info("新旧密码不能相同", 0.5);
      return;
    }
    //整理参数
    const params = new URLSearchParams();
    params.append(
      "params",
      JSON.stringify({
        userId: userInfo.id,
        oldPwd: userInfo.userPassword,
        inputOldPwd: oldPwd,
        newPwd,
      })
    );
    //发送请求,会判断旧密码对不对
    await axios
      .post("/api1/user/updatePassword", params)
      .then((res) => {
        if (res.data.status === 1) {
          message.success("修改成功,请重新登录", 1);
          setIsModalOpen(false);
          userStore.clearUserToken();
          navigate("/login", { replace: true });
        } else {
          message.info("旧密码输入错误", 1);
        }
      })
      .catch((err) => {
        console.log("密码修改错误2+" + err);
      });
  };

  //基本设置保存
  const userInfoSave = async () => {
    //判断
    switch (viewKey) {
      case "1":
        if (avatar === "") {
          message.info("头像不能为空", 1);
          return;
        }
        if (name === "") {
          message.info("名字不能为空", 1);
          return;
        }
        if (avatar === userInfo.avatar && name === userInfo.name) {
          return;
        }
        break;
      case "2":
        if (sex === userInfo.sex && description === userInfo.description) {
          return;
        }
        break;
      default:
        break;
    }

    //整理参数
    const params = new URLSearchParams();
    params.append(
      "params",
      JSON.stringify({ userId: userInfo.id, avatar, name, sex, description })
    );
    //发送请求
    await axios
      .post("/api1/user/saveBasicSetting", params)
      .then((res) => {
        if (res.data.status === 1) {
          userStore.changeLoginInfo(res.data);
          const tmp = res.data.data;
          setUserInfo(tmp);
          setAvatar(tmp.avatar);
          setName(tmp.name);
          setSex(tmp.sex);
          setDescription(tmp.description);
          message.success("保存成功");
        } else {
          message.error("保存失败");
        }
      })
      .catch((err) => {
        console.log("保存基本设置失败2" + err);
      });
  };

  //获取用户信息
  useEffect(() => {
    if (userStore.token !== null) {
      const a = JSON.parse(userStore.token).data;
      setUserInfo(a);
      setAvatar(a.avatar);
      setName(a.name);
      setSex(a.sex);
      setDescription(a.description);
    }
  }, [userStore]);
  return (
    <div className="setting-page">
      <div className="setting-page-left">
        <Menu
          style={{
            width: 256,
          }}
          defaultSelectedKeys={["1"]}
          mode={"inline"}
          theme={"light"}
          items={items}
          onClick={(e) => changeViewKey(e)}
        />
      </div>
      <div className="setting-page-right">
        {viewKey === "1" ? (
          <>
            {/* 头像 */}
            <div style={{ marginBottom: 50 }}>
              <Space align="end">
                <Avatar
                  style={{ marginRight: 50 }}
                  size={100}
                  src={avatar}
                ></Avatar>
                <Upload
                  name="image"
                  accept="image/*"
                  showUploadList={false}
                  action="http://localhost:8002/upload/img"
                  onChange={imgOnChange}
                  beforeUpload={beforeUploadImage}
                >
                  <Button>更改头像</Button>
                </Upload>
              </Space>
            </div>
            {/* 昵称 */}
            <div className="setting-page-right-item">
              <Space>
                <div className="setting-page-font-mark">昵称</div>
                <Input
                  placeholder="输入昵称"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Input>
              </Space>
            </div>
            {/* 手机 */}
            <div className="setting-page-right-item">
              <Space>
                <div className="setting-page-font-mark">手机</div>
                <div>{userInfo.userPhone}</div>
              </Space>
            </div>
            {/* 修改密码 */}
            <div className="setting-page-right-item">
              <Space>
                <div className="setting-page-font-mark">密码</div>
                <div>************</div>
                <Button
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                >
                  修改
                </Button>
              </Space>
            </div>
            <Button
              onClick={userInfoSave}
              size="large"
              type="primary"
              style={{ marginTop: 20 }}
            >
              保存
            </Button>
          </>
        ) : viewKey === "2" ? (
          <>
            {/* 性别 */}
            <div className="setting-page-right-item">
              <Space>
                <div className="setting-page-font-mark">性别</div>
                <Radio.Group
                  onChange={(e) => {
                    setSex(e.target.value);
                  }}
                  value={sex}
                >
                  <Radio value={"男"}>男</Radio>
                  <Radio value={"女"}>女</Radio>
                </Radio.Group>
              </Space>
            </div>
            {/* 介绍 */}
            <div className="setting-page-right-item">
              <Space align="start">
                <div className="setting-page-font-mark">个人简介</div>
                <TextArea
                  placeholder="个人介绍"
                  autoSize={{
                    minRows: 2,
                    maxRows: 6,
                  }}
                  style={{ width: 478 }}
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                  }}
                />
              </Space>
            </div>
            {/* 网址 */}
            <div className="setting-page-right-item">
              <Space>
                <div className="setting-page-font-mark">个人网址</div>
                <Input></Input>
              </Space>
            </div>
            <Button
              onClick={userInfoSave}
              size="large"
              type="primary"
              style={{ marginTop: 20 }}
            >
              保存
            </Button>
          </>
        ) : viewKey === "3" ? (
          <>
            <div>
              被您拉黑的用户将会在此显示，被拉黑用户不能对您进行评论、私信、查看主页等功能
            </div>
          </>
        ) : null}
      </div>
      <Modal
        title="修改密码"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={() => {
          setIsModalOpen(false);
          setOldPwd("");
          setNewPwd("");
        }}
        okText="修改"
        cancelText="取消"
      >
        <div>
          旧密码:
          <Input
            placeholder="旧密码"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
          ></Input>
        </div>
        <div>
          新密码:
          <Input
            placeholder="新密码"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
          ></Input>
        </div>
      </Modal>
    </div>
  );
}

export default SystemSetting;
