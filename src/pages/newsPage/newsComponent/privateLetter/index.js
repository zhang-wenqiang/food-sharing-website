import "./index.scss";
import { Avatar, List, Button, Dropdown, Space, Input } from "antd";
import { useEffect, useRef, useState } from "react";
import { RollbackOutlined } from "@ant-design/icons";
import { useStore } from "../../../../store";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const { TextArea } = Input;

function PrivateLetter() {
  //获取跳转函数
  const navigate = useNavigate();
  //解析所需数据仓库
  const { userStore } = useStore();
  //私信列表
  const [letterList, setLetterList] = useState([]);
  //显示私信列表false，还是显示聊天框true
  const [listOrBorder, setListOrBorder] = useState(false);
  //输入内容管理
  const [inputText, setInputText] = useState("");
  //目标用户信息
  const [targetUserInfo, setTargetUserInfo] = useState({});
  //当前聊天关系id
  const [chatRelationshipId, setChatRelationshipId] = useState("");

  //获取dom
  const divRef = useRef(null);

  //当前登录用户id
  const userId = JSON.parse(userStore.token).data.id;

  //消息列表
  const [msgList, setMsgList] = useState([]);
  //输入框内容变化触发函数
  const inputTextOnChange = (e) => {
    //去除末尾空格
    setInputText(e.target.value.replace(/(\s*$)/g, ""));
  };
  //发送消息函数
  const sendMessage = async () => {
    if (inputText.replace(/(\s*$)/g, "") === "") {
      return;
    }
    if (chatRelationshipId === "") {
      return;
    }

    const params = new URLSearchParams();
    params.append(
      "params",
      JSON.stringify({
        chatRelationshipId,
        fromUserId: userId,
        toUserId: targetUserInfo.id,
        msg: inputText,
      })
    );
    await axios
      .post("/api1/user/sendMessage", params)
      .then((res) => {
        if (res.data.status === 1) {
          setInputText("");
          setMsgList([
            ...msgList,
            {
              ...res.data.data,
              avatar: JSON.parse(userStore.token).data.avatar,
            },
          ]);
        } else {
          console.log("发送信息失败1");
        }
      })
      .catch((err) => {
        console.log("发送信息失败2" + err);
      });
  };
  //获取私信列表
  const getLetterList = async () => {
    //整理参数
    const params = new URLSearchParams();
    params.append("params", JSON.stringify({ userId }));
    await axios
      .get("/api1/user/getPrivateLetterList", { params })
      .then((res) => {
        if (res.data.status === 1) {
          setLetterList(res.data.data);
        } else {
          console.log("获取私信列表失败1");
        }
      })
      .catch((err) => {
        console.log("获取私信列表失败2" + err);
      });
  };

  //操作按钮展开
  const items = [
    {
      label: (
        <a
          href="/news/privateLetter"
          onClick={(e) => {
            e.stopPropagation();
            if (chatRelationshipId === "") {
              return;
            }
            //设置私信列表不显示,之后还要重新获取私信列表
            const setStatus0 = async () => {
              //整理参数参数,当前登录用户id，聊天关系id
              const params = new URLSearchParams();
              params.append(
                "params",
                JSON.stringify({ chatRelationshipId, userId })
              );
              await axios
                .post("/api1/user/updateChatListStatus0", params)
                .then((res) => {
                  if (res.data.status === 1) {
                    console.log("设置私信列表不显示成功");
                  } else {
                    console.log(res.data.data);
                  }
                })
                .catch((err) => {
                  console.log("设置私信列表不显示失败2" + err);
                });
            };
            setStatus0();
          }}
        >
          删除会话
        </a>
      ),
      key: "0",
    },
  ];
  //页面显示先获取私信列表,如果有userId的话获取聊天关系
  useEffect(() => {
    const a = new URLSearchParams(window.location.search);
    if (a.has("userId")) {
      //有参数就直接显示聊天框
      setListOrBorder(true);
      //获取聊天关系id
      const getCR = async () => {
        //整理参数
        const params = new URLSearchParams();
        params.append(
          "params",
          JSON.stringify({ firstId: userId, secondId: a.get("userId") })
        );
        await axios
          .get("/api1/user/getChatRelationship", { params })
          .then((res) => {
            if (res.data.status === 1) {
              setChatRelationshipId(res.data.data);
            } else {
              console.log(res.data.data);
            }
          })
          .catch((err) => {
            console.log("获取聊天关系失败2" + err);
          });
      };
      getCR();
      return;
    }
    //获取私信列表
    const getLL = async () => {
      //整理参数
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ userId }));
      await axios
        .get("/api1/user/getPrivateLetterList", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setLetterList(res.data.data);
          } else {
            console.log("获取私信列表失败1");
          }
        })
        .catch((err) => {
          console.log("获取私信列表失败2" + err);
        });
    };
    getLL();
  }, [userId]);

  //根据urlid获取用户信息
  useEffect(() => {
    const a = new URLSearchParams(window.location.search);
    if (a.has("userId") && listOrBorder) {
      //获取聊天用户信息
      const getUI = async () => {
        //整理参数
        const params = new URLSearchParams();
        params.append("params", JSON.stringify({ authorId: a.get("userId") }));

        await axios
          .get("/api1/user/getUserById", { params })
          .then((res) => {
            if (res.data.status === 1) {
              setTargetUserInfo(res.data.data);
            } else {
              console.log("获取目标用户信息失败1");
            }
          })
          .catch((err) => {
            console.log("获取目标用户信息失败2" + err);
          });
      };
      //获取消息列表
      const getML = async () => {
        //整理参数
        const params = new URLSearchParams();
        params.append(
          "params",
          JSON.stringify({ userId, chatObjectId: a.get("userId") })
        );
        //发送请求
        await axios
          .get("/api1/user/getMessageList", { params })
          .then((res) => {
            if (res.data.status === 1) {
              setMsgList(res.data.data);
            } else {
              console.log("获取消息列表失败1");
            }
          })
          .catch((err) => {
            console.log("获取消息列表失败2" + err);
          });
      };
      getUI();
      getML();
    }
  }, [listOrBorder, userId]);

  //到信息列表最底部
  useEffect(() => {
    if (divRef.current === null) {
      return;
    }
    divRef.current.scrollTop = divRef.current.scrollHeight;
  }, [msgList]);
  return (
    <div className="privateLetter">
      {listOrBorder ? (
        // 聊天框
        <div>
          {/* 返回私信列表，与谁聊天 */}
          <Space>
            <Button
              className="privateLetter-back-letter-list"
              type="link"
              icon={<RollbackOutlined />}
              onClick={() => {
                setListOrBorder(false);
                navigate("/news/privateLetter");
                getLetterList();
                setTargetUserInfo({});
                setChatRelationshipId("");
                setMsgList([]);
              }}
            >
              返回私信列表
            </Button>
            <h3 className="privateLetter-border-title">
              与{targetUserInfo.name}的聊天
            </h3>
          </Space>
          <hr></hr>
          {/* 消息列表 */}
          <div ref={divRef} className="privateLetter-border">
            <ul className="privateLetter-border-ul">
              {msgList.map((item) => (
                <li
                  key={item.id}
                  style={{ marginBottom: 15, overflow: "auto" }}
                >
                  <div>
                    {/* 头像 */}
                    <Avatar
                      className={
                        userId === item.fromUserId
                          ? "privateLetter-border-right-avatar"
                          : "privateLetter-border-left-avatar"
                      }
                      size="large"
                      src={item.avatar}
                    />
                    {/* 消息 */}
                    <div
                      className={
                        userId === item.fromUserId
                          ? "privateLetter-border-right-msg"
                          : "privateLetter-border-left-msg"
                      }
                    >
                      <div
                        className={
                          userId === item.fromUserId
                            ? "privateLetter-border-right-content"
                            : "privateLetter-border-left-content"
                        }
                      >
                        {item.msg}
                      </div>
                      <div
                        style={
                          userId === item.fromUserId
                            ? { fontSize: 12, color: "#d9d9d9", float: "right" }
                            : { fontSize: 12, color: "#d9d9d9", float: "left" }
                        }
                      >
                        {item.sendTime}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          {/* 发送消息 */}
          <div className="privateLetter-border-send-msg">
            <TextArea
              value={inputText}
              onChange={inputTextOnChange}
              rows={4}
              placeholder="输入内容"
              onPressEnter={sendMessage}
            />
            <div style={{ marginTop: 10 }}>
              <span>Enter直接发送</span>
              <Button
                className="privateLetter-border-send-button"
                type="primary"
                size={"large"}
                onClick={sendMessage}
              >
                发送
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // 私信列表
        <div>
          <div className="privateLetter-all-letter-title">全部私信</div>
          <hr></hr>
          <List
            itemLayout="horizontal"
            className="privateLetter-letter-list"
            dataSource={letterList}
            renderItem={(item) => (
              <List.Item
                onClick={() => {
                  setListOrBorder(true);
                  setChatRelationshipId(item.chatRelationshipId);
                  navigate(`/news/privateLetter?userId=${item.toUserId}`);
                }}
              >
                <List.Item.Meta
                  avatar={<Avatar size={48} src={item.avatar} />}
                  title={item.name}
                  description={item.lastMsg}
                />
                <Dropdown
                  menu={{
                    items,
                  }}
                  trigger={["click"]}
                >
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      setChatRelationshipId(item.chatRelationshipId);
                    }}
                  >
                    操作
                  </Button>
                </Dropdown>
              </List.Item>
            )}
          />
        </div>
      )}
    </div>
  );
}
export default PrivateLetter;
