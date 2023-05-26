//所有工具函数在这里导入，然后统一导出
import { http } from "./http"; //axios请求封装
import { setToken, getToken, deleteToken } from "./token";
import {
  setUserInfo,
  getUserInfo,
  deleteUserInfo,
  setRememberMe,
  getRememberMe,
} from "./userInfo";
import {
  setMyHomeMenuKey,
  getMyHomeMenuKey,
  deleteMyHomeMenuKey,
} from "./menu.Utils";
import {
  setSearchHistory,
  deleteSearchHistory,
  getSearchHistory,
  deleteSearchHistoryByContent,
} from "./search.Store";
import { getDiffDay } from "./Date.Utils";
export {
  http,
  setToken,
  getToken,
  deleteToken,
  setUserInfo,
  getUserInfo,
  deleteUserInfo,
  setMyHomeMenuKey,
  getMyHomeMenuKey,
  deleteMyHomeMenuKey,
  setSearchHistory,
  deleteSearchHistory,
  getSearchHistory,
  deleteSearchHistoryByContent,
  getDiffDay,
  setRememberMe,
  getRememberMe,
};
