import "./index.scss";
import { useWindowScroll } from "../../hooks/useWindowScroll";
import { Row, Col, Watermark, Space, List, Button } from "antd";
import { BookOutlined, HistoryOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { useStore } from "../../store";
import axios from "axios";

//返回列表下边三个图标的组件
const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);
function MyCollection() {
  const { userStore } = useStore();
  //回到顶部，可以点进去看实现
  const [y] = useWindowScroll();
  //收藏文章列表
  const [collectionList, setCollectionList] = useState([]);

  //某个用户id
  const [userId, setUserId] = useState(0);

  //获取收藏文章列表
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setUserId(urlParams.get("userId"));
    const getCL = async () => {
      //整理参数，用户id
      const params = new URLSearchParams();
      params.append(
        "params",
        JSON.stringify({ userId: urlParams.get("userId") })
      );
      //发送请求
      await axios
        .get("/api2/article/getCollectionList", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setCollectionList(
              res.data.data.map((item) => {
                return {
                  ...item,
                  href: `/details?articleId=${item.id}`,
                };
              })
            );
          } else {
            console.log("获取收藏文章列表失败1");
          }
        })
        .catch((err) => {
          console.log("获取收藏文章列表失败2:" + err);
        });
    };
    getCL();
  }, []);
  return (
    <div>
      <Row justify={"center"}>
        <Col span={12}>
          {/* 图片内容 */}
          <Watermark content={"美食分享"}>
            <div className="myCollectionImage">
              <Space>
                <BookOutlined style={{ color: "white", fontSize: 45 }} />
                <h1 style={{ fontSize: 45, color: "white" }}>
                  {userId === JSON.parse(userStore.token).data.id ? "我" : "Ta"}
                  收藏的文章
                </h1>
              </Space>
            </div>
          </Watermark>
          {/* 列表 */}
          <List
            itemLayout="vertical"
            size="large"
            dataSource={collectionList}
            footer={<div>已经到底了...</div>}
            renderItem={(item) => (
              <List.Item
                key={item.title}
                actions={[
                  <IconText
                    icon={HistoryOutlined}
                    text={item.publishTime}
                    key="list-vertical-star-o"
                  />,
                ]}
                extra={
                  //每个item后面的图片
                  <img
                    width={272}
                    alt="logo"
                    src={
                      item.image !== "1"
                        ? item.image
                        : "https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
                    }
                  />
                }
              >
                <List.Item.Meta //这是标题
                  title={
                    <a style={{ fontSize: 20 }} href={item.href}>
                      {item.title}
                    </a>
                  }
                />
                {item.content.substring(0, 149)}...
              </List.Item>
            )}
          />
        </Col>
      </Row>

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

export default MyCollection;
