import {
  ReadOutlined,
  HomeOutlined,
  SettingOutlined,
  YuqueFilled,
  CaretDownFilled,
  UserOutlined,
  BookOutlined,
  ToolOutlined,
  DeleteRowOutlined,
} from "@ant-design/icons";
import {
  Menu,
  Button,
  Input,
  Dropdown,
  Space,
  Avatar,
  Tooltip,
  List,
  message,
} from "antd";
import { observer } from "mobx-react-lite";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../../store";
import { setSearchHistory, getSearchHistory } from "../../utils";
import "./index.scss";

const { Search } = Input;

function FoodSharingTop() {
  //用户数据仓库
  const { userStore, topStore, newsStore } = useStore();
  //页面跳转的
  const navigate = useNavigate();
  //导航栏列表
  const menuItems = [
    {
      label: userStore.token === null ? "首页" : "发现", //一个变量控制是否登录状态
      key: "homePage",
      icon: <HomeOutlined />,
    },
    {
      label: "话题",
      key: "topicPage",
      icon: <ReadOutlined />,
    },
    userStore.token !== null
      ? {
          label: "关注",
          key: "attentionPage",
          icon: <ReadOutlined />,
        }
      : null,
    userStore.token !== null
      ? {
          label: "消息",
          key: "mewsPage",
          icon: <SettingOutlined />,
          children: [
            {
              label: "评论",
              key: "remark",
            },
            {
              label: "私信",
              key: "privateLetter",
            },
          ],
        }
      : null,
  ];
  //当前选中导航状态管理
  // const [current, setCurrent] = useState(
  //   topStore.getTopCurrentKey() || "homePage"
  // );
  //点击某个导航触发
  const onClick = (e) => {
    console.log("click ", e.key);
    topStore.setTopCurrentKey(e.key);

    switch (e.key) {
      case "homePage":
        navigate("/");
        break;
      case "topicPage":
        navigate("/topic");
        break;
      case "attentionPage":
        navigate(`/attention?userId=${JSON.parse(userStore.token).data.id}`);
        break;
      case "remark":
        newsStore.setNewsMenuCurrentKey("remark");
        navigate("/news");
        break;
      case "privateLetter":
        newsStore.setNewsMenuCurrentKey("privateLetter");
        navigate("/news/privateLetter");
        break;
      default:
        break;
    }
  };
  //退出按钮
  const exitButton = () => {
    userStore.clearUserToken();
    topStore.deleteTopCurrentKey();
    navigate("/", { replace: true });
  };

  //头像下拉框数据
  const headImageItems = [
    {
      key: "1",
      label: (
        <a
          href={`/myHome?userId=${
            userStore.token !== null
              ? JSON.parse(userStore.token).data.id
              : null
          }`}
        >
          <div style={{ margin: 10, fontSize: 20 }}>我的主页</div>
        </a>
      ),
      icon: <UserOutlined style={{ fontSize: 20, color: "red" }} />,
    },
    {
      key: "2",
      label: (
        <a
          href={
            userStore.token !== null
              ? `/myCollection?userId=${JSON.parse(userStore.token).data.id}`
              : "/login"
          }
        >
          <div style={{ margin: 10, fontSize: 20 }}>收藏的文章</div>
        </a>
      ),
      icon: <BookOutlined style={{ fontSize: 20, color: "red" }} />,
    },
    {
      key: "3",
      label: (
        <a href="/systemSetting">
          <div style={{ margin: 10, fontSize: 20 }}>设置</div>
        </a>
      ),
      icon: <ToolOutlined style={{ fontSize: 20, color: "red" }} />,
    },
    {
      key: "4",
      label: (
        <div onClick={exitButton}>
          <div style={{ margin: 10, fontSize: 20 }}>退出</div>
        </div>
      ),
      icon: <DeleteRowOutlined style={{ fontSize: 20, color: "red" }} />,
    },
  ];

  //搜索历史
  const [searchHistoryContentToolTip, setSearchHistoryContentToolTip] =
    useState(JSON.parse(getSearchHistory()));
  //搜索栏内容
  const [searchContent, setSearchContent] = useState("");

  //点击写文章触发事件
  const toWriteArticle = () => {
    if (userStore.token === null) {
      navigate("/login", { replace: true });
      message.info("请先登录！", 1);
      return;
    }
    navigate("/writeArticle");
  };

  return (
    <div style={{ height: 58 }}>
      <div className="top">
        {/* 图标 */}
        <div className="logoLink">
          <Link
            className="aaa"
            to="/"
            onClick={() => {
              topStore.setTopCurrentKey("homePage");
            }}
          ></Link>
        </div>
        {/* 菜单 */}
        <div className="topMenu">
          <Menu
            style={{
              border: "none",
              fontSize: 20,
            }}
            onClick={onClick}
            selectedKeys={[topStore.getTopCurrentKey() || "homePage"]}
            mode="horizontal"
            items={menuItems}
          />
        </div>
        {/* 搜索 */}
        <div className="topSearch">
          <Tooltip
            trigger={["click"]}
            title={
              <List
                dataSource={
                  searchHistoryContentToolTip ? searchHistoryContentToolTip : []
                }
                renderItem={(item) => (
                  <List.Item style={{ padding: 2 }}>
                    <a
                      href={`/search?content=${item}`}
                      alt="recent"
                      className="recent-search"
                    >
                      {item}
                    </a>
                  </List.Item>
                )}
                locale={{emptyText:"没有历史信息"}}
              />
            }
            color={"#fff"}
            placement={"bottomLeft"}
            onOpenChange={() => {
              setSearchHistoryContentToolTip(JSON.parse(getSearchHistory()));
            }}
          >
            <Search
              className="top-search"
              placeholder="搜索"
              onSearch={() => {
                if (searchContent !== "") {
                  setSearchHistory(searchContent);
                  window.location.href = `http://localhost:3001/search?content=${searchContent}`;
                }
              }}
              value={searchContent}
              onChange={(e) => {
                setSearchContent(e.target.value);
              }}
            />
          </Tooltip>
        </div>
        {/* 登录注册/头像 */}
        {userStore.token === null ? (
          <div className="loginregister">
            {/* 登录 */}
            <Button
              type="text"
              shape="round"
              size={"large"}
              onClick={() => {
                topStore.deleteTopCurrentKey();
                navigate("/login");
              }}
            >
              登录
            </Button>
            {/* 注册 */}
            <Button
              shape="round"
              size={"large"}
              danger
              onClick={() => {
                topStore.deleteTopCurrentKey();
                navigate("/register");
              }}
              style={{ marginLeft: 20 }}
            >
              注册
            </Button>
          </div>
        ) : (
          <div className="headImage">
            <div className="imageBlock">
              <Dropdown menu={{ items: headImageItems }} placement="bottomLeft">
                <a
                  href={`/myHome?userId=${JSON.parse(userStore.token).data.id}`}
                >
                  <Space style={{ height: 96, marginLeft: 22, marginTop: -17 }}>
                    <Avatar
                      src={
                        userStore.token !== null
                          ? JSON.parse(userStore.token).data.avatar
                          : "https://img2.baidu.com/it/u=3202947311,1179654885&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1679677200&t=6ec8e4c5ef8d2b6d445a5e6eaf436ee3"
                      }
                      size={50}
                      icon={<UserOutlined />}
                    />
                    <CaretDownFilled style={{ color: "#969696" }} />
                  </Space>
                </a>
              </Dropdown>
            </div>
          </div>
        )}

        {/* 写文章 */}
        <div className="writeArticle">
          <Button
            type="primary"
            shape="round"
            icon={<YuqueFilled />}
            size={"large"}
            danger
            style={{
              marginLeft: 18,
            }}
            onClick={toWriteArticle}
          >
            写文章
          </Button>
        </div>
      </div>
    </div>
  );
}
export default observer(FoodSharingTop);
