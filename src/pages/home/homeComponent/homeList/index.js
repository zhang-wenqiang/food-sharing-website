import { Button } from "antd";
import "./index.scss";
import { useEffect } from "react";
import { HistoryOutlined } from "@ant-design/icons";

import { List, Space } from "antd";
import { useStore } from "../../../../store";
import React from "react";
import { observer } from "mobx-react-lite";

//定义一个组件
const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);
function HomeList() {
  //引入主页store
  const { homeStore } = useStore();

  //调用获取主页文章列表函数
  const callGetHomeArticleList = async () => {
    await homeStore.getHomeArticleList();
  };
  //显示页面是先获取一次文章列表
  useEffect(() => {
    const CallGetHomeArticleListuseEffect = async () => {
      await homeStore.getHomeArticleList();
    };
    CallGetHomeArticleListuseEffect();
  }, [homeStore]);
  return (
    <div>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={homeStore.homeArticleList}
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
            {/* 上面的item是列表每个元素框架，这里是内容 */}
            <List.Item.Meta title={<a href={item.href}>{item.title}</a>} />
            {item.content}...
          </List.Item>
        )}
      />
      <Button className="loadMore" onClick={callGetHomeArticleList}>
        添加更多
      </Button>
    </div>
  );
}
export default observer(HomeList);
