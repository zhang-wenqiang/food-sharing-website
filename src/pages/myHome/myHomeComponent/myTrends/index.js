import { useEffect, useState } from "react";
import { List, Avatar, Space, Button } from "antd";
import axios from "axios";
import "./index.scss";
function MyHomeMyTrends() {
  //用户信息获取
  const [userInfo, setUserInfo] = useState(0);
  //动态列表
  const [trendsList, setTrendsList] = useState([]);

  //进来先获取用户信息
  useEffect(() => {
    const a = new URLSearchParams(window.location.search);
    const getUL = async () => {
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ authorId: a.get("userId") }));

      axios
        .get("/api1/user/getUserById", { params })
        .then((res) => {
          if (res.data.status === 1) {
            console.log("123");
            setUserInfo(res.data.data);
          } else {
            console.log("获取用户信息失败1");
          }
        })
        .catch((err) => {
          console.log("获取用户信息失败2" + err);
        });
    };
    getUL();
  }, []);
  //用户信息变化获取动态列表
  useEffect(() => {
    if (userInfo === 0) {
      return;
    }
    const getTL = async () => {
      //整理参数
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ userId: userInfo.id }));

      //发送请求
      await axios
        .get("/api1/user/getTrendsList", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setTrendsList([
              ...res.data.data,
              {
                id: "0",
                trendsMark: "0",
                trendsMarkContent: "进行了注册",
                avatar: "", //用户头像，可以为空
                targetId: "", //用户id或文章id
                name: "", //用户名字或文章名字
                description: "", //用户粉丝数，可以为空
                time: userInfo.registerTime,
              },
            ]);
          } else {
            setTrendsList([
              {
                id: "0",
                trendsMark: "0",
                trendsMarkContent: "进行了注册",
                avatar: "", //用户头像，可以为空
                targetId: "", //用户id或文章id
                name: "", //用户名字或文章名字
                description: "", //用户粉丝数，可以为空
                time: userInfo.registerTime,
              },
            ]);
            console.log("未获取到动态列表1");
          }
        })
        .catch((err) => {
          console.log("获取动态列表失败2" + err);
        });
    };
    getTL();
  }, [userInfo]);
  return (
    <div>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={trendsList}
        renderItem={(item) => (
          <List.Item key={item.id} style={{ margin: "0 0 15px" }}>
            <List.Item.Meta
              avatar={<Avatar src={userInfo.avatar} />}
              title={
                <div
                  style={{
                    display: "inline-block",
                    verticalAlign: "middle",
                    fontSize: 16,
                  }}
                >
                  {userInfo.name}
                  <span style={{ paddingLeft: 5, color: "#969696" }}>
                    {item.trendsMarkContent}·{item.time}
                  </span>
                </div>
              }
            />
            {/* 关注1/发布文章2/注册0三种状态显示 */}
            {item.trendsMark === "1" ? (
              <div
                style={{
                  backgroundColor: "hsla(0,0%,71%,.1)",
                  padding: 20,
                  border: "1px solid #e1e1e1",
                  borderRadius: 4,
                }}
              >
                <Space>
                  <Avatar size={64} src={item.avatar}></Avatar>
                  <div style={{ width: 440 }}>
                    <div style={{ fontSize: 18 }}>{item.name}</div>
                    <div style={{ color: "#969696", fontSize: 13 }}>
                      {item.description}
                    </div>
                  </div>
                  <Button
                    onClick={() =>
                      (window.location.href = `/myHome?userId=${item.targetId}`)
                    }
                  >
                    去主页
                  </Button>
                </Space>
              </div>
            ) : item.trendsMark === "2" ? (
              <a
                style={{ fontSize: 20 }}
                href={`/details?articleId=${item.targetId}`}
              >
                {item.name}
              </a>
            ) : null}
          </List.Item>
        )}
      />
    </div>
  );
}
export default MyHomeMyTrends;
