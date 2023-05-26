import { useEffect, useState } from "react";
import { List, Avatar } from "antd";
import { useStore } from "../../../../store";
import { useNavigate } from "react-router-dom";
import "./index.scss";
import axios from "axios";

function Remark() {
  //引入跳转函数
  const navigate = useNavigate();
  //引入mbox数据仓库
  const { userStore } = useStore();
  //收到的评论列表
  const [remarkList, setRemarkList] = useState([
    {
      id: "1",
      userId: "1",
      avatar: "1",
      name: "1",
      articleId: "1",
      title: "1",
      remarkContent: "1",
      remarkTime: "2020-10-10 10:10:10",
    },
  ]);

  //页面加载是获取被评论列表
  useEffect(() => {
    if (userStore.token === null) {
      return;
    }

    const getRL = async () => {
      //整理参数
      const params = new URLSearchParams();
      params.append(
        "params",
        JSON.stringify({ userId: JSON.parse(userStore.token).data.id })
      );
      await axios
        .get("/api1/remark/getNewsRemarkList", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setRemarkList(res.data.data);
          } else {
            console.log("未获取到被评论列表1");
          }
        })
        .catch((err) => {
          console.log("获取被评论列表失败2" + err);
        });
    };
    getRL();
  }, [userStore]);
  return (
    <div className="news-page-remark">
      <div className="news-page-remark-title">收到的评论</div>
      <hr className="news-page-remark-hr"></hr>
      {/* 收到的评论列表 */}
      <div className="news-page-remark-list">
        <List
          itemLayout="vertical"
          className="news-page-remark-list-list"
          size="large"
          dataSource={remarkList}
          footer={<div>到底了。。。</div>}
          renderItem={(item) => (
            <>
              <List.Item key={item.id}>
                <List.Item.Meta
                  avatar={
                    <Avatar
                      size={48}
                      src={item.avatar}
                      onClick={() => {
                        navigate(`/myHome?userId=${item.userId}`);
                      }}
                    />
                  }
                  title={
                    <>
                      <a href={`/myHome?userId=${item.userId}`}>{item.name}</a>
                      评论了你的分享
                      <a
                        href={`/details?articleId=${item.articleId}`}
                        style={{ color: "#3194d0" }}
                      >
                        《{item.title}》
                      </a>
                    </>
                  }
                  description={item.remarkTime}
                />
                <h4>{item.remarkContent}</h4>
              </List.Item>
              <hr className="news-page-remark-hr"></hr>
            </>
          )}
        />
      </div>
    </div>
  );
}
export default Remark;
