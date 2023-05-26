import "./index.scss";
import { useWindowScroll } from "../../hooks/useWindowScroll";
import { Button, Menu } from "antd";
import HomeList from "../home/homeComponent/homeList";
function getItem(label, key) {
  return {
    key,
    label,
  };
}
const items = [
  getItem(
    <p style={{ marginBottom: 15, marginTop: 15, fontSize: 20 }}>川菜</p>,
    "topic1"
  ),
  getItem(
    <p style={{ marginBottom: 15, marginTop: 15, fontSize: 20 }}>酸辣粉</p>,
    "topic2"
  ),
  getItem(
    <p style={{ marginBottom: 15, marginTop: 15, fontSize: 20 }}>长沙臭豆腐</p>,
    "topic3"
  ),
  getItem(
    <p style={{ marginBottom: 15, marginTop: 15, fontSize: 20 }}>西安凉皮</p>,
    "topic4"
  ),
  getItem(
    <p style={{ marginBottom: 15, marginTop: 15, fontSize: 20 }}>热干面</p>,
    "topic5"
  ),
];
function Topic() {
  const [y] = useWindowScroll();
  const onClick = (e) => {
    console.log("click ", e);
  };
  return (
    <div className="topic">
      {/* 左边话题列表 */}
      <div className="topicLeft">
        <Menu
          onClick={onClick}
          defaultSelectedKeys={["topic1"]}
          defaultOpenKeys={["topic1"]}
          mode="inline"
          items={items}
        />
      </div>
      {/* 右边对应话题文章列表 */}
      <div className="topicRight">
        <HomeList />
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

export default Topic;
