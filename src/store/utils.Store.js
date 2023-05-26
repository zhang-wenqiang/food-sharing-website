import { makeAutoObservable } from "mobx";

class UtilsStore {
  //图片上传地址
  uploadImgUrl = "http://localhost:8002/upload/img";
  constructor() {
    makeAutoObservable(this);
  }
}

export default UtilsStore;
