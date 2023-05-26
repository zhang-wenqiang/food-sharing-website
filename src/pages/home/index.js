import { useWindowScroll } from "../../hooks/useWindowScroll";
import { Button } from "antd";
import { useStore } from "../../store";
import HomeList from "./homeComponent/homeList";
import Recommend from "./homeComponent/recommend";
import WriterList from "./homeComponent/writerList";
import "./index.scss";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";
function Home() {
  const { topStore } = useStore();
  useEffect(() => {
    topStore.setTopCurrentKey("homePage");
  });
  const [y] = useWindowScroll();
  return (
    <div className="home">
      <div className="homeLeft">
        <HomeList />
      </div>
      <div className="homeRight">
        <Recommend />
        <WriterList />
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
export default observer(Home);
