import "./index.scss";
import { SyncOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import { useEffect, useState } from "react";
import { useStore } from "../../../../store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function WriterList() {
  const navigate = useNavigate();
  const { userStore } = useStore();

  const [colorFont, setColorFont] = useState([
    { bool: false, id: 0 },
    { bool: false, id: 1 },
    { bool: false, id: 2 },
    { bool: false, id: 3 },
    { bool: false, id: 4 },
  ]);

  //当前用户列表
  const [userList, setUserList] = useState([]);

  //获取五个未被关注用户
  const getHomeUsers = async () => {
    //整理参数
    const params = new URLSearchParams();
    const userId = JSON.parse(userStore.token).data.id;
    params.append("params", JSON.stringify({ userId }));

    await axios
      .get("/api1/user/getHomeUsers", { params })
      .then((res) => {
        if (res.data.status === 1) {
          let i = 0;
          setUserList(
            res.data.data.map((item) => {
              return Object.assign(item, { position: i++ });
            })
          );
        } else {
          console.log("出错:" + res.data.data);
        }
      })
      .catch((err) => {
        console.log("获取用户出错:" + err);
      });

    setColorFont([
      { bool: false, id: 0 },
      { bool: false, id: 1 },
      { bool: false, id: 2 },
      { bool: false, id: 3 },
      { bool: false, id: 4 },
    ]);
  };

  //首次渲染先获取一次用户
  useEffect(() => {
    if (userStore.token === null) {
      return;
    }
    const a = async () => {
      //整理参数
      const params = new URLSearchParams();
      const userId = JSON.parse(userStore.token).data.id;
      params.append("params", JSON.stringify({ userId }));

      await axios
        .get("/api1/user/getHomeUsers", { params })
        .then((res) => {
          if (res.data.status === 1) {
            let i = 0;
            setUserList(
              res.data.data.map((item) => {
                return Object.assign(item, { position: i++ });
              })
            );
          } else {
            console.log("出错:" + res.data.data);
          }
        })
        .catch((err) => {
          console.log("获取用户出错:" + err);
        });
      setColorFont([
        { bool: false, id: 0 },
        { bool: false, id: 1 },
        { bool: false, id: 2 },
        { bool: false, id: 3 },
        { bool: false, id: 4 },
      ]);
    };
    a();
  }, [userStore.token]);
  return (
    <div className="writerList">
      <div className="tuijian">
        <span>推荐作者</span>
        <span className="change" onClick={getHomeUsers}>
          <SyncOutlined />
          换一批
        </span>
      </div>
      {/* 推荐作者列表 */}
      {userList.map((item) => {
        return (
          <div key={item.id} className="writerListItem">
            <a className="author-img" href={`/myHome?userId=${item.id}`}>
              <img src={item.avatar} alt="头像" />
            </a>
            <div className="author-instr">
              <a href={`/myHome?userId=${item.id}`}>{item.name}</a>
              <p>
                <span
                  style={{
                    display: "block",
                    maxWidth: "10em",
                    overflow: "hidden",
                    whiteSpace: "nowrap",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.description}
                </span>
              </p>
            </div>
            {/* 关注按钮 */}
            <Button
              className={
                colorFont[item.position].bool
                  ? "iconfont iconfontColor"
                  : "iconfont"
              }
              type="link"
              onClick={async () => {
                if (userStore.token === null) {
                  message.info("请登录", 1);
                  navigate("/login");
                  return;
                }
                //整理参数,当前用户id，要关注的用户id
                const params = new URLSearchParams();
                const userId = JSON.parse(userStore.token).data.id;
                const targetId = item.id;
                params.append("params", JSON.stringify({ userId, targetId }));

                //发送请求
                await axios
                  .post("/api1/user/focusOrOffUser", params)
                  .then((res) => {
                    if (res.data.status === 1) {
                      //设置对应按钮情况
                      setColorFont(
                        colorFont.map((item2) => {
                          if (item2.id === item.position) {
                            return {
                              bool: !colorFont[item2.id].bool,
                              id: item2.id,
                            };
                          }
                          return item2;
                        })
                      );
                      message.success(res.data.data, 1);
                    } else {
                      console.log("关注或取关失败1");
                    }
                  })
                  .catch((err) => {
                    console.log("关注或取关失败2" + err);
                  });
              }}
            >
              {colorFont[item.position].bool ? "√已关注" : "+关注"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}
export default WriterList;
