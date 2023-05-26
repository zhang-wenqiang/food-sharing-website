//搜索功能工具类

//搜索历史
const searchHistory = "search_history_list";

const getSearchHistory = () => {
  return window.localStorage.getItem(searchHistory);
};
const setSearchHistory = (input) => {
  return window.localStorage.setItem(
    searchHistory,
    getSearchHistory()
      ? JSON.stringify([...JSON.parse(getSearchHistory()), input])
      : JSON.stringify([input])
  );
};
const deleteSearchHistory = () => {
  return window.localStorage.removeItem(searchHistory);
};
const deleteSearchHistoryByContent = (content) => {
  return window.localStorage.setItem(
    searchHistory,
    JSON.stringify(
      JSON.parse(getSearchHistory()).filter((item) => item !== content)
    )
  );
};

export { setSearchHistory, deleteSearchHistory, getSearchHistory,deleteSearchHistoryByContent };
