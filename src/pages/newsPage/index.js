import "./index.scss";
import { useWindowScroll } from "../../hooks/useWindowScroll";
import { Button, Menu } from "antd";
import { MailOutlined, MessageOutlined } from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useStore } from "../../store";
//获取消息菜单
function getItem(label, key, icon) {
  return {
    key,
    icon,
    label,
  };
}
//具体消息菜单
const items = [
  getItem(
    <p style={{ fontSize: 20 }}>评论</p>,
    "remark",
    <MessageOutlined style={{ fontSize: 20 }} />
  ),
  getItem(
    <p style={{ fontSize: 20 }}>私信</p>,
    "privateLetter",
    <MailOutlined style={{ fontSize: 20 }} />
  ),
];
function NewsPage() {
  const navigate = useNavigate();
  const [y] = useWindowScroll();
  const { newsStore, topStore } = useStore();
  const menuOnClick = (e) => {
    console.log(e.key);
    switch (e.key) {
      case "remark":
        topStore.setTopCurrentKey("remark");
        newsStore.setNewsMenuCurrentKey("remark");
        navigate("/news");
        break;
      case "privateLetter":
        topStore.setTopCurrentKey("privateLetter");
        newsStore.setNewsMenuCurrentKey("privateLetter");
        navigate("/news/privateLetter");
        break;
      default:
        break;
    }
  };
  return (
    <div className="newsPage">
      <div className="newsPageLeft">
        <Menu
          onClick={menuOnClick}
          style={{
            width: 256,
          }}
          selectedKeys={[newsStore.getNewsMenuCurrentKey()]}
          defaultOpenKeys={["sub1"]}
          mode={"inline"}
          theme={"light"}
          items={items}
        />
      </div>
      <div className="newsPageRight">
        {/**二级路由出口 */}
        <Outlet />
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

export default observer(NewsPage);
