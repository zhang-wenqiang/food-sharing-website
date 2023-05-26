import { makeAutoObservable } from "mobx";

class FoodSharingTopStore {
  //系统顶部导航当前选中的key
  topCurrentKey = "top_currentKey";
  constructor() {
    makeAutoObservable(this);
  }

  setTopCurrentKey = (current) => {
    return window.localStorage.setItem(this.topCurrentKey, current);
  };
  getTopCurrentKey = () => {
    return window.localStorage.getItem(this.topCurrentKey);
  };
  deleteTopCurrentKey = () => {
    return window.localStorage.removeItem(this.topCurrentKey);
  };
}

export default FoodSharingTopStore;
