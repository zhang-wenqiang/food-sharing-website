import { createContext, useContext } from "react";
import UserStore from "./user.Store";
import FoodSharingTopStore from "./foodSharingTop.Store";
import NewsStore from "./news.Store";
import HomeStore from "./home.Store";
import UtilsStore from "./utils.Store";
import ArticleStore from "./article.Store";

class RootStore {
  constructor() {
    this.userStore = new UserStore();
    this.topStore = new FoodSharingTopStore();
    this.newsStore = new NewsStore();
    this.homeStore = new HomeStore();
    this.utilsStore = new UtilsStore();
    this.articleStore = new ArticleStore();
  }
}

const rootStore = new RootStore();

const context = createContext(rootStore);

const useStore = () => useContext(context);
export { useStore };
