//本地token工具类
//token的key
const tokenKey = "user_token";

const setToken = (token) => {
  return window.localStorage.setItem(tokenKey, token);
};
const getToken = () => {
  return window.localStorage.getItem(tokenKey);
};
const deleteToken = () => {
  return window.localStorage.removeItem(tokenKey);
};

export { setToken, getToken, deleteToken };
