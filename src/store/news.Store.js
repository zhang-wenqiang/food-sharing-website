import { makeAutoObservable } from "mobx";

class NewsStore {
  //系统顶部导航当前选中的key
  newsMenuCurrentKey = "newsMenu_currentKey";
  constructor() {
    makeAutoObservable(this);
  }

  setNewsMenuCurrentKey = (current) => {
    return window.localStorage.setItem(this.newsMenuCurrentKey, current);
  };
  getNewsMenuCurrentKey = () => {
    return window.localStorage.getItem(this.newsMenuCurrentKey);
  };
  deleteNewsMenuCurrentKey = () => {
    return window.localStorage.removeItem(this.newsMenuCurrentKey);
  };
}

export default NewsStore;