//本地userInfo工具类
//userInfo的key
const userInfoKey = "user_Info";
const setUserInfo = (userInfo) => {
  return window.localStorage.setItem(userInfoKey, userInfo);
};
const getUserInfo = () => {
  return window.localStorage.getItem(userInfoKey);
};
const deleteUserInfo = () => {
  return window.localStorage.removeItem(userInfoKey);
};

//记住我功能实现
const rememberMeKey = "remember_me_key";
const setRememberMe = (content) => {
  return window.localStorage.setItem(rememberMeKey, content);
};
const getRememberMe = () => {
  return window.localStorage.getItem(rememberMeKey)
    ? window.localStorage.getItem(rememberMeKey)
    : 0;
};
export {
  setUserInfo,
  getUserInfo,
  deleteUserInfo,
  setRememberMe,
  getRememberMe,
};
