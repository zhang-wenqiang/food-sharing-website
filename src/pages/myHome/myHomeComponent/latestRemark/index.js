import { useEffect, useState } from "react";
import { useStore } from "../../../../store";
import { List, Avatar } from "antd";
import axios from "axios";
import "./index.scss";
function MyHomeLatestRemark() {
  //获取mbox仓库
  const { userStore } = useStore();
  //最新评论列表
  const [latestRemarkList, setLatestRemarkList] = useState([]);
  //当前主页用户信息
  const [currentUserInfo, setCurrentUserInfo] = useState({});

  useEffect(() => {
    const a = new URLSearchParams(window.location.search);

    //获取用户信息
    const getUI = async () => {
      //整理参数
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ authorId: a.get("userId") }));
      await axios
        .get("/api1/user/getUserById", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setCurrentUserInfo(res.data.data);
          } else {
            console.log("未查到用户信息");
          }
        })
        .catch((err) => {
          console.log("查询用户信息出错2" + err);
        });
    };
    getUI();
  }, []);
  //获取最新评论列表
  useEffect(() => {
    const getLL = async () => {
      //整理参数
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ userId: currentUserInfo.id }));

      //发送请求
      await axios
        .get("/api1/remark/getLatestRemarkList", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setLatestRemarkList(res.data.data);
          } else {
            console.log("未查询到一周内评论");
          }
        })
        .catch((err) => {
          console.log("查询一周内评论失败2" + err);
        });
    };
    getLL();
  }, [currentUserInfo]);
  return (
    <div>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={latestRemarkList}
        footer={<div>只显示一周内的评论。。。</div>}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <List.Item.Meta
              avatar={<Avatar src={currentUserInfo.avatar} />}
              title={
                <>
                  {currentUserInfo.id === JSON.parse(userStore.token).data.id
                    ? "你"
                    : "ta"}
                  在
                  <a
                    style={{ color: "blue" }}
                    href={`/details?articleId=${item.articleId}`}
                  >
                    《{item.title}》
                  </a>
                  中评论：
                </>
              }
            />
            {item.remarkContent}
            <p style={{ color: "#b4b4b4" }}>{item.remarkTime}</p>
          </List.Item>
        )}
      />
    </div>
  );
}
export default MyHomeLatestRemark;
