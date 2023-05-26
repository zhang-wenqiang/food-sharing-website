import "./index.scss";
import { useWindowScroll } from "../../hooks/useWindowScroll";
import { Button, Menu, Avatar, Dropdown, Space, List, message } from "antd";
import { DownOutlined, HistoryOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import { setMyHomeMenuKey } from "../../utils";
//返回关注列表item对象
const getItem = (k, l, i) => {
  return {
    key: k,
    icon: <Avatar size="large" src={i} />,
    label: <p style={{ fontSize: 20 }}>{l}</p>,
  };
};
//定义一个组件
const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

function Attention() {
  //回到顶部
  const [y] = useWindowScroll();
  //获取跳转函数
  const navigate = useNavigate();
  //mbox
  const { userStore, topStore, newsStore } = useStore();

  //全部关注状态管理
  const [dropdownCurrent, setDropdownCurrent] = useState("全部关注");

  //全部关注
  const items = [
    {
      label: <div onClick={() => changeDropdownCurrent(1)}>全部关注</div>,
      key: "1",
    },
    {
      label: <div onClick={() => changeDropdownCurrent(2)}>互相关注</div>,
      key: "2",
    },
  ];
  //关注列表管理
  const [attentionList, setAttentionList] = useState([]);

  //被选中用户信息管理
  const [selectedUserInfo, setSelectedUserInfo] = useState(0);

  //被选中用户文章列表管理
  const [selectedArticleList, setSelectedArticleList] = useState([]);

  //获取关注用户
  const getAttentionList = async (s) => {
    //整理参数
    const urlParams = new URLSearchParams(window.location.search);
    const params = new URLSearchParams();
    params.append(
      "params",
      JSON.stringify({ userId: urlParams.get("userId"), state: s }) //state表示要获取的用户列表是不是互相关注的，1是全部列表
    );
    //发送请求
    await axios
      .get("/api1/user/getAttentionList", { params })
      .then((res) => {
        if (res.data.status === 1) {
          setAttentionList(
            res.data.data.map((item) => {
              return getItem(item.id, item.name, item.avatar);
            })
          );
        } else {
          console.log("获取关注列表失败1");
        }
      })
      .catch((err) => {
        console.log("获取关注列表失败2:" + err);
      });
  };
  //切换关注列表
  const changeDropdownCurrent = (current) => {
    //根据点击的哪个状态进行操作
    switch (current) {
      case 1:
        getAttentionList("1");
        setDropdownCurrent("全部关注");
        break;
      case 2:
        getAttentionList("2");
        setDropdownCurrent("互相关注");
        break;
      default:
        break;
    }
  };
  //关注列表点击
  const attentionListOnClick = async (e) => {
    //如果已是当前用户，就直接返回
    if (selectedUserInfo !== 0) {
      if (selectedUserInfo.id === e.key) {
        return;
      }
    }

    //整理参数
    const params = new URLSearchParams();
    params.append("params", JSON.stringify({ authorId: e.key }));
    //发送请求
    await axios
      .get("/api1/user/getUserById", { params })
      .then((res) => {
        if (res.data.status === 1) {
          setSelectedUserInfo(res.data.data);
        } else {
          console.log("获取用户信息失败1");
        }
      })
      .catch((err) => {
        console.log("获取用户信息失败2:" + err);
      });
  };

  //首次进页面获取关注列表
  useEffect(() => {
    //获取关注列表
    const getAL = async () => {
      //整理参数
      const urlParams = new URLSearchParams(window.location.search);
      const params = new URLSearchParams();
      params.append(
        "params",
        JSON.stringify({ userId: urlParams.get("userId"), state: "1" }) //state表示要获取的用户列表是不是互相关注的，1是全部列表
      );
      //发送请求
      await axios
        .get("/api1/user/getAttentionList", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setAttentionList(
              res.data.data.map((item) => {
                return getItem(item.id, item.name, item.avatar);
              })
            );
          } else {
            console.log("获取关注列表失败1");
          }
        })
        .catch((err) => {
          console.log("获取关注列表失败2:" + err);
        });
    };
    getAL();
  }, [userStore]);

  //获取用户文章列表
  useEffect(() => {
    if (selectedUserInfo === 0) {
      return;
    }

    const getUL = async () => {
      //整理参数
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ userId: selectedUserInfo.id }));
      //发送请求
      await axios
        .get("/api2/article/getUserAllArticleList", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setSelectedArticleList(res.data.data);
          }
        })
        .catch((err) => {
          console.log("获取被选中用户的文章列表失败2：" + err);
        });
    };
    getUL();
  }, [selectedUserInfo]);

  return (
    <div className="attention">
      {/* 左边 */}
      <div className="attentionLeft">
        <Dropdown
          menu={{
            items,
          }}
          trigger={["click"]}
        >
          <Space style={{ height: 35, marginTop: 25 }}>
            <p style={{ fontSize: 19 }}>{dropdownCurrent}</p>
            <DownOutlined />
          </Space>
        </Dropdown>

        <hr />

        <Menu
          onClick={attentionListOnClick}
          style={{
            width: 280,
            marginTop: 50,
          }}
          defaultSelectedKeys={[
            attentionList.length > 0 ? attentionList[0].key : "",
          ]}
          mode="inline"
          items={attentionList}
        />
      </div>
      {/* 右边 */}
      <div className="attentionRight">
        {/* 用户头像 */}
        {selectedUserInfo !== 0 ? (
          <Space>
            <Avatar size={64} src={selectedUserInfo.avatar}></Avatar>
            <h2 className="attentionRight-h2">{selectedUserInfo.name}</h2>
            <Button
              style={{ color: "blue", border: "none" }}
              onClick={() => {
                const a = async () => {
                  //取消关注请求
                  const params = new URLSearchParams();
                  params.append(
                    "params",
                    JSON.stringify({
                      userId: JSON.parse(userStore.token).data.id,
                      targetId: selectedUserInfo.id,
                    })
                  );
                  await axios
                    .post("/api1/user/focusOrOffUser", params)
                    .then((res) => {
                      if (res.data.status === 1) {
                        message.success("已经取消关注", 1);
                      } else {
                        console.log("取关失败1");
                      }
                    })
                    .catch((err) => {
                      console.log("取关失败2" + err);
                    });
                };
                a();
                //刷新页面
                getAttentionList(dropdownCurrent === "全部关注" ? "1" : "2");
                setSelectedUserInfo(0);
                setSelectedArticleList([]);
              }}
            >
              取消关注
            </Button>
            <Button
              className="attentionRight-Button1"
              onClick={() => {
                topStore.setTopCurrentKey("privateLetter");
                newsStore.setNewsMenuCurrentKey("privateLetter");
                navigate(`/news/privateLetter?userId=${selectedUserInfo.id}`);
              }}
            >
              发私信
            </Button>
            <Button
              className="attentionRight-Button2"
              onClick={() => {
                navigate(`/myHome?userId=${selectedUserInfo.id}`);
                setMyHomeMenuKey("myArticle");
              }}
            >
              个人主页
            </Button>
          </Space>
        ) : null}
        <hr style={{ marginTop: 50 }}></hr>
        {/* 用户文章列表 */}
        <List
          itemLayout="vertical"
          size="large"
          dataSource={selectedArticleList}
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
                      : "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                  }
                />
              }
            >
              {/* 上面的item是列表每个元素框架，这里是内容 */}
              <List.Item.Meta
                title={
                  <a href={`/details?articleId=${item.id}`}>{item.title}</a>
                }
              />
            </List.Item>
          )}
          locale={{ emptyText: "没有文章" }}
        />
      </div>

      {/* 回到顶部 */}
      {y > 0 ? (
        <Button
          className="backTop"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          回到顶部
        </Button>
      ) : null}
    </div>
  );
}

export default Attention;
