import "./index.scss";
import { Space, Menu, Button, List, Avatar } from "antd";
import {
  PieChartOutlined,
  CloseOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import {
  getSearchHistory,
  deleteSearchHistoryByContent,
  deleteSearchHistory,
} from "../../utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import React from "react";
import axios from "axios";
//获取数据列表item
function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}
//左侧菜单项
const items = [
  getItem("文章", "1", <PieChartOutlined />),
  getItem("用户", "2", <PieChartOutlined />),
  getItem("话题", "3", <PieChartOutlined />),
];
//获取图片方法
const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);
function SearchPage() {
  const navigate = useNavigate();
  //查询内容管理
  const [searchContent, setSearchContent] = useState("");
  //历史记录状态管理
  const [searchHistory, setSearchHistory] = useState(
    JSON.parse(getSearchHistory())
  );
  //排序方式被选中状态管理
  const [currentWay, setCurrentWay] = useState(1);

  //当前被选中菜单：1文章、2用户
  const [currentMenuItem, setCurrentMenuItem] = useState("1");

  //当前右侧显示内容管理
  const [currentResult, setCurrentResult] = useState([]);

  //菜单选项被选中时
  const menuOnclick = ({ key }) => {
    setCurrentMenuItem(key);
  };

  //获取url中查询内容
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSearchContent(urlParams.get("content"));
  }, []);

  //每次搜索内容变化都会发送请求获取查询结果,根据用户点击的菜单进行
  useEffect(() => {
    if (searchContent === "") {
      return;
    }
    //获取文章
    const getSCA = async () => {
      //整理参数
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ searchContent }));
      //发送请求
      await axios
        .get("/api2/article/getArticleBySearchContent", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setCurrentResult(res.data.data);
          } else {
            setCurrentResult([]);
            console.log("查询搜索文章失败1");
          }
        })
        .catch((err) => {
          setCurrentResult([]);
          console.log("查询搜索文章失败2+" + err);
        });
    };
    //获取用户
    const getSCU = async () => {
      //整理参数
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ searchContent }));
      //发送请求
      await axios
        .get("/api1/user/getUserBySearchContent", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setCurrentResult(res.data.data);
          } else {
            setCurrentResult([]);
            console.log("查询搜索文章失败1");
          }
        })
        .catch((err) => {
          setCurrentResult([]);
          console.log("查询搜索用户失败2+" + err);
        });
    };

    switch (currentMenuItem) {
      case "1":
        getSCA();
        break;
      case "2":
        getSCU();
        break;
      default:
        break;
    }
  }, [searchContent, currentMenuItem]);
  return (
    <div className="search-page">
      <Space>
        {/* 左侧 */}
        <div className="search-page-left">
          <Menu
            defaultSelectedKeys={["1"]}
            inlineCollapsed={false}
            items={items}
            mode="inline"
            onClick={menuOnclick}
          />

          <hr style={{ marginTop: 40, marginBottom: 30 }}></hr>
          <div style={{ marginLeft: 5, marginRight: 10 }}>
            <span style={{ float: "left", fontSize: 18, color: "#969696" }}>
              最近搜索
            </span>
            <Button
              style={{
                float: "right",
                fontSize: 15,
                color: "#969696",
              }}
              type="link"
              size={"small"}
              onClick={() => {
                deleteSearchHistory();
                setSearchHistory(getSearchHistory());
              }}
            >
              清空
            </Button>
          </div>
          <div className="search-history-ant-list">
            {/* 搜索历史列表 */}
            <List
              itemLayout="horizontal"
              dataSource={searchHistory ? searchHistory : []}
              renderItem={(item) => (
                <List.Item
                  className="search-history-ant-list-item"
                  actions={[
                    <Button
                      type="link"
                      icon={<CloseOutlined />}
                      onClick={() => {
                        deleteSearchHistoryByContent(item);
                        setSearchHistory(JSON.parse(getSearchHistory()));
                      }}
                    ></Button>,
                  ]}
                >
                  <a style={{ height: "100%", width: "100%" }} href="/register">
                    {item}
                  </a>
                </List.Item>
              )}
              locale={{ emptyText: "没有历史数据" }}
            />
          </div>
        </div>
        {/* 右侧 */}
        <div className="search-page-right">
          {/* 顶部排序 */}
          <div>
            <Button
              className={currentWay === 1 ? "order-way-selected-color" : ""}
              onClick={() => setCurrentWay(1)}
              type="link"
              disabled={currentMenuItem === "2" ? true : false}
            >
              综合排序·
            </Button>
            {currentMenuItem === "1" ? (
              <>
                <Button
                  className={currentWay === 2 ? "order-way-selected-color" : ""}
                  onClick={() => setCurrentWay(2)}
                  type="link"
                >
                  热门文章·
                </Button>
                <Button
                  className={currentWay === 3 ? "order-way-selected-color" : ""}
                  onClick={() => setCurrentWay(3)}
                  type="link"
                >
                  最新发布
                </Button>
              </>
            ) : null}

            <div className="search-result">{currentResult.length}个结果</div>
          </div>
          {/* 是否显示文章内容 */}
          {currentMenuItem === "1" ? (
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 5,
              }}
              dataSource={currentResult}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  actions={[
                    <IconText
                      icon={HistoryOutlined}
                      text={item.publishTime}
                      key="list-vertical-star-o"
                    />,
                  ]}
                  extra={
                    <img
                      width={200}
                      alt="logo"
                      src={
                        item.image !== "1"
                          ? item.image
                          : "http://localhost:8085/food-sharing-img/zanwufengmian.png"
                      }
                    />
                  }
                >
                  <List.Item.Meta
                    title={
                      <a href={`/details?articleId=${item.id}`}>{item.title}</a>
                    }
                  />
                </List.Item>
              )}
            />
          ) : null}
          {/* 是否显示用户内容 */}
          {currentMenuItem === "2" ? (
            <List
              itemLayout="vertical"
              size="large"
              pagination={{
                onChange: (page) => {
                  console.log(page);
                },
                pageSize: 5,
              }}
              dataSource={currentResult}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  extra={
                    <Button
                      onClick={() => {
                        navigate(`/myHome?userId=${item.id}`);
                      }}
                    >
                      进入主页
                    </Button>
                  }
                >
                  <List.Item.Meta
                    avatar={<Avatar size={64} src={item.avatar}></Avatar>}
                    title={
                      <a href={`/myHome?userId=${item.id}`}>{item.name}</a>
                    }
                  />
                </List.Item>
              )}
            />
          ) : null}
        </div>
      </Space>
    </div>
  );
}
export default SearchPage;
