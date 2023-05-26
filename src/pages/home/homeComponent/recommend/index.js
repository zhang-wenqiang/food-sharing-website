import "./index.scss";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
function Recommend() {
  const navigate = useNavigate();
  //热门内容管理
  const [hotContent, setHotContent] = useState([
    "卤煮火烧",
    "春卷",
    "肠粉",
    "大肠猪血汤",
    "河南烩面",
  ]);
  return (
    <div className="recommendList">
      <div style={{ margin: 10 }}>热点搜索</div>
      <Button
        className="recommendItem-1"
        onClick={() => navigate(`/search?content=${hotContent[0]}`)}
      >
        {hotContent[0]}
      </Button>
      <Button
        className="recommendItem-2"
        onClick={() => navigate(`/search?content=${hotContent[1]}`)}
      >
        {hotContent[1]}
      </Button>
      <Button
        className="recommendItem-3"
        onClick={() => navigate(`/search?content=${hotContent[2]}`)}
      >
        {hotContent[2]}
      </Button>
      <Button
        className="recommendItem-4"
        onClick={() => navigate(`/search?content=${hotContent[3]}`)}
      >
        {hotContent[3]}
      </Button>
      <Button
        className="recommendItem-5"
        onClick={() => navigate(`/search?content=${hotContent[4]}`)}
      >
        {hotContent[4]}
      </Button>
    </div>
  );
}
export default Recommend;
