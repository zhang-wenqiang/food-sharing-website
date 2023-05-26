import "./index.scss";
import {
  AntDesignOutlined,
  MailOutlined,
  ContainerOutlined,
  BellOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { Col, Row, Avatar, Menu, Button, message } from "antd";

import { Outlet, useNavigate } from "react-router-dom";
import { getMyHomeMenuKey, setMyHomeMenuKey } from "../../utils";
import { useEffect, useState } from "react";
import { useStore } from "../../store";
import axios from "axios";
//个人页菜单信息
const items = [
  {
    label: "文章",
    key: "myArticle",
    icon: <ContainerOutlined />,
  },
  {
    label: "动态",
    key: "myTrends",
    icon: <BellOutlined />,
  },
  {
    label: "最新评论",
    key: "latestRemark",
    icon: <CommentOutlined />,
  },
];
function MyHome() {
  const navigate = useNavigate();
  const { userStore } = useStore();

  //当前用户信息
  const [userInfo, setUserInfo] = useState(0);
  //用户粉丝数
  const [fansCount, setFansCount] = useState(0);
  //用户关注人数
  const [attentionCount, setAttentionCount] = useState(0);
  //用户已发布文章数
  const [articleCount, setArticleCount] = useState(0);
  //菜单点击事件
  const onClick = (e) => {
    switch (e.key) {
      case "myArticle":
        setMyHomeMenuKey("myArticle");
        navigate(`/myHome?userId=${userInfo.id}`);
        break;
      case "myTrends":
        setMyHomeMenuKey("myTrends");
        navigate(`/myHome/myTrends?userId=${userInfo.id}`);
        break;
      case "latestRemark":
        setMyHomeMenuKey("latestRemark");
        navigate(`/myHome/latestRemark?userId=${userInfo.id}`);
        break;
      default:
        break;
    }
  };

  //获取用户信息
  useEffect(() => {
    const getUI = async () => {
      //整理参数，传过来的用户id
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("userId");

      //发送http请求
      await axios
        .get("/api1/user/getUserById", {
          params: {
            params: JSON.stringify({ authorId: userId }),
          },
        })
        .then((res) => {
          if (res.data.status === 1) {
            setUserInfo(res.data.data);
          } else {
            message.error("获取用户信息失败1");
          }
        })
        .catch((err) => {
          console.log("获取用户信息失败2");
        });
    };
    getUI();
  }, []);

  //获取被关注数
  useEffect(() => {
    if (userInfo === 0) {
      return;
    }
    const getFC = async () => {
      //整理参数
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ userId: userInfo.id }));

      await axios
        .get("/api1/user/getFansCount", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setFansCount(res.data.data);
          } else {
            console.log("获取粉丝数失败1");
          }
        })
        .catch((err) => {
          console.log("获取粉丝数失败2" + err);
        });
    };
    getFC();
  }, [userInfo]);

  //获取关注的人数
  useEffect(() => {
    //没有用户信息就返回
    if (userInfo === 0) {
      return;
    }

    const getAC = async () => {
      //整理参数
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ userId: userInfo.id }));

      await axios
        .get("/api1/user/getAttentionCount", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setAttentionCount(res.data.data);
          } else {
            console.log("获取关注人数失败1");
          }
        })
        .catch((err) => {
          console.log("获取关注人数失败2");
        });
    };
    getAC();
  }, [userInfo]);

  //获取已发布文章数
  useEffect(() => {
    if (userInfo === 0) {
      return;
    }
    const getAC = async () => {
      //整理参数
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ userId: userInfo.id }));

      //发送请求
      await axios
        .get("/api1/user/getArticleCount", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setArticleCount(res.data.data);
          } else {
            console.log("获取已发布文章数失败1");
          }
        })
        .catch((err) => {
          console.log("获取已发布文章数失败2");
        });
    };
    getAC();
  }, [userInfo]);
  return (
    <div className="myHome">
      <Row justify="center" align="top">
        {/* 页面左侧 */}
        <Col span={9}>
          {/* 头像行信息 */}
          <Row justify={"center"} align={"middle"}>
            <Col span={4}>
              <Avatar
                size={{
                  xs: 24,
                  sm: 32,
                  md: 40,
                  lg: 64,
                  xl: 80,
                  xxl: 100,
                }}
                icon={<AntDesignOutlined />}
                src={
                  userInfo !== 0
                    ? userInfo.avatar
                    : "https://img1.baidu.com/it/u=633660860,2237659961&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1680886800&t=640f9d32677d3f33d6671b67bdb63ec9"
                }
              />
            </Col>
            <Col span={20}>
              <div style={{ fontSize: 20 }}>
                {userInfo !== 0 ? userInfo.name : "用户名未知"}
              </div>
              <Row>
                <Col span={2}>
                  <div>
                    <div>{attentionCount}</div>
                    <div>关注</div>
                  </div>
                </Col>
                <Col span={2}>
                  <div>
                    <div>{fansCount}</div>
                    <div>粉丝</div>
                  </div>
                </Col>
                <Col span={2}>
                  <div>
                    <div>{articleCount}</div>
                    <div>文章</div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
          {/* 个人页菜单行 */}
          <Menu
            style={{ marginTop: 15, fontSize: 20 }}
            onClick={onClick}
            selectedKeys={[getMyHomeMenuKey() || "myArticle"]}
            mode="horizontal"
            items={items}
          />
          {/* 二级路由出口 */}
          <Outlet />
        </Col>
        {/* 页面右侧 */}
        <Col span={4} offset={1}>
          <Button className="myHome-recommendItem">美食分享</Button>
          {/* 个人介绍 */}
          <div>
            <div className="myHome-personal-introduction-title">个人介绍</div>
            <p className="myHome-personal-introduction">
              {userInfo !== 0 ? userInfo.description : null}
            </p>
          </div>

          <hr style={{ marginTop: 30, marginBottom: 15 }} />
          {/* 其他信息 */}
          <div>
            {userInfo !== 0 &&
            userInfo.id === JSON.parse(userStore.token).data.id ? (
              <Button
                onClick={() => {
                  navigate(`/attention?userId=${userInfo.id}`);
                }}
                className="recommendItem2"
              >
                <MailOutlined />
                我关注的人
              </Button>
            ) : null}

            <Button
              onClick={() => {
                navigate(`/myCollection?userId=${userInfo.id}`);
              }}
              className="recommendItem2"
            >
              <MailOutlined />
              {userInfo !== 0 &&
              userInfo.id === JSON.parse(userStore.token).data.id
                ? "我"
                : "Ta"}
              收藏的文章
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default MyHome;
