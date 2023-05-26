import "./index.scss";
import { List } from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function MyHomeMyArticle() {
  const navigate = useNavigate();
  //用户主页已发布文章列表
  const [myArticle, setMyArticle] = useState([]);

  //文章点击事件
  const onClickArticle = (articleId) => {
    //进行跳转分发
    navigate(`/details?articleId=${articleId}`);
  };
  //获取文章列表
  useEffect(() => {
    const getMA = async () => {
      //获取参数
      const urlParams = new URLSearchParams(window.location.search);
      const params = new URLSearchParams();
      params.append(
        "params",
        JSON.stringify({ userId: urlParams.get("userId") })
      );
      //发送请求
      await axios
        .get("/api2/article/getMyArticleList", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setMyArticle(res.data.data);
          } else {
            console.log("未查询到用户文章1");
          }
        })
        .catch((err) => {
          console.log("未查询到用户文章2" + err);
        });
    };
    getMA();
  }, []);
  return (
    <div className="myHome-myArticle">
      <List
        //style={{ border: "none" }}
        footer={<div>{myArticle.length > 0 ? "已经到底了哦" : null}</div>}
        //bordered
        dataSource={myArticle}
        renderItem={(item) => (
          <List.Item onClick={() => onClickArticle(item.id)}>
            {item.title}
          </List.Item>
        )}
      />
    </div>
  );
}
export default MyHomeMyArticle;
