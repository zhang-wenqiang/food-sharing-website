import "./App.scss";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import FoodSharingTop from "./commonComponent/foodSharingTop";
import Login from "./pages/login";
import Home from "./pages/home";
import Register from "./pages/register";
import Topic from "./pages/topicPage";
import Attention from "./pages/attention";
import NewsPage from "./pages/newsPage";
import MyHome from "./pages/myHome";
import MyCollection from "./pages/myCollection";
import SystemSetting from "./pages/systemSetting";
import Remark from "./pages/newsPage/newsComponent/remark";
import PrivateLetter from "./pages/newsPage/newsComponent/privateLetter";
import MyHomeMyArticle from "./pages/myHome/myHomeComponent/myArticle";
import MyHomeMyTrends from "./pages/myHome/myHomeComponent/myTrends";
import MyHomeLatestRemark from "./pages/myHome/myHomeComponent/latestRemark";
import Details from "./pages/details";
import SearchPage from "./pages/searchPage";
import WriteArticle from "./pages/writeArticle";

function App() {
  return (
    <BrowserRouter className="App">
      <div className="root-app">
        <FoodSharingTop />
        <Routes>
          {/* 主页 */}
          <Route path="/" element={<Home />}></Route>
          {/* 登录页 */}
          <Route path="/login" element={<Login />}></Route>
          {/* 注册页 */}
          <Route path="/register" element={<Register />}></Route>
          {/* 话题 */}
          <Route path="/topic" element={<Topic />}></Route>
          {/* 关注 */}
          <Route path="/attention" element={<Attention />}></Route>
          {/* 消息 */}
          <Route path="/news" element={<NewsPage />}>
            {/* 消息列表两个二级路由 */}
            <Route index element={<Remark />}></Route>
            <Route
              path="/news/privateLetter"
              element={<PrivateLetter />}
            ></Route>
          </Route>
          {/* 我的主页 */}
          <Route path="/myHome" element={<MyHome />}>
            {/* 我的主页二级路由 */}
            <Route index element={<MyHomeMyArticle />}></Route>
            <Route path="/myHome/myTrends" element={<MyHomeMyTrends />}></Route>
            <Route
              path="/myHome/latestRemark"
              element={<MyHomeLatestRemark />}
            ></Route>
          </Route>

          {/* 我的收藏 */}
          <Route path="/myCollection" element={<MyCollection />}></Route>
          {/* 设置 */}
          <Route path="/systemSetting" element={<SystemSetting />}></Route>
          {/* 文章详情页 */}
          <Route path="/details" element={<Details />}></Route>
          {/* 搜索显示页 */}
          <Route path="/search" element={<SearchPage />}></Route>
          {/* 写文章页面 */}
          <Route path="/writeArticle" element={<WriteArticle />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
