//菜单当前选中工具类

//我的主页中菜单
const myHomeMenuKey = "myHome_menuKey";

const setMyHomeMenuKey = (myHome_menuKey) => {
  return window.localStorage.setItem(myHomeMenuKey, myHome_menuKey);
};
const getMyHomeMenuKey = () => {
  return window.localStorage.getItem(myHomeMenuKey);
};
const deleteMyHomeMenuKey = () => {
  return window.localStorage.removeItem(myHomeMenuKey);
};

export { setMyHomeMenuKey, getMyHomeMenuKey, deleteMyHomeMenuKey };
