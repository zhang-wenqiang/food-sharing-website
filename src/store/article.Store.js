import { makeAutoObservable, runInAction } from "mobx";
import axios from "axios";

class ArticleStore {
  //文集列表
  collectedWorksList = [];

  //被选中文集包含的文章列表
  selectedArticleList = [];


  //访问路径
  constructor() {
    makeAutoObservable(this);
  }

  //添加文集
  addCollectedWorks = async (params) => {
    let result = false;
    await axios
      .post("/api2/article/addCollectedWorks", params)
      .then((res) => {
        console.log(res);
        result = true;
      })
      .catch((err) => {
        console.log("添加文集出错+", err);
      });

    return result;
  };

  //获取文集列表
  getCollectedWorksList = async (params) => {
    await axios
      .get("/api2/article/getCollectedWorksList", {
        params,
      })
      .then((res) => {
        if (res.data.status === 1) {
          runInAction(() => {
            this.collectedWorksList = res.data.data.map((item) => {
              return { key: item.id, label: item.title };
            });
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //根据文集id获取包含的文章列表
  getArticleListByCWId = async (params) => {
    await axios
      .get("/api2/article/getArticleListByCWId", {
        params,
      })
      .then((res) => {
        if (res.data.status === 1) {
          runInAction(() => {
            this.selectedArticleList = res.data.data.map((item) => {
              return {
                key: item.id,
                isPublish: item.isPublish,
                label: item.title,
              };
            });
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //添加文章
  addArticle = async (params) => {
    let resultkey = false;

    await axios
      .post("/api2/article/addArticle", params)
      .then((res) => {
        console.log(res);
        if (res.data.status === 1) {
          const tmp = res.data.data;
          runInAction(() => {
            this.selectedArticleList = [
              ...this.selectedArticleList,
              { key: tmp.id, label: tmp.title },
            ];
          });
          resultkey = tmp.id;
        }
      })
      .catch((err) => {
        console.log("store", err);
      });

    return resultkey;
  };

  //删除文章
  deleteArticle = async (params) => {
    let result = false;
    await axios
      .post("/api2/article/deleteArticleById", params)
      .then((res) => {
        if (res.data.status === 1) {
          result = true;
        }
      })
      .catch((err) => {
        console.log("删除文章失败", err);
      });

    return result;
  };

}

export default ArticleStore;
