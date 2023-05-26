import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

class HomeStore {
  //首页推荐文章列表
  homeArticleList = [];
  constructor() {
    makeAutoObservable(this);
  }

  //首页获取文章列表
  getHomeArticleList = async () => {
    //整理参数，已有的文章id列表
    const params = new URLSearchParams();
    const idList = this.homeArticleList.map((item) => {
      return item.key;
    });
    params.append("params", JSON.stringify(idList));
    //获取首页显示的文章列表，每次随机获取5篇已发布文章
    await axios
      .get("/api2/article/homeGetArticleList", { params })
      .then((res) => {
        if (res.data.status === 1) {
          runInAction(() => {
            //函数或变量前面有下划线，则代表为私有类型
            //参数中有下划线，这是前端人员的普遍约定，意思是：忽略这个参数（下划线也可以做参数名，比如下边这个下划线代表列表每一项，而i是index）
            this.homeArticleList = [
              ...this.homeArticleList,
              ...res.data.data.map((item) => ({
                href: `/details?articleId=${item.id}`, //点击文章跳转
                key: item.id,
                title: item.title, //文章标题
                content: item.content.substring(0, 49) + "...", //文章内容（想想怎么显示html）
                image: item.image, //文章封面
                publishTime: item.publishTime,
              })),
            ];
          });
        } else {
          console.log("首页获取文章出错：" + res.data.status);
        }
      })
      .catch((err) => {
        console.log("首页获取文章出错：" + err);
      });
  };
}
export default HomeStore;
