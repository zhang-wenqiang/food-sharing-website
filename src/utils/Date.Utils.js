//日期工具类

// 日期相减函数获取天数
//使用：getDiffDay("2021-1-1", "2021-2-2"); // 32
function getDiffDay(date_1, date_2) {
  // 计算两个日期之间的差值
  let totalDays, diffDate;
  let myDate_1 = Date.parse(date_1);
  let myDate_2 = Date.parse(date_2);
  // 将两个日期都转换为毫秒格式，然后做差
  diffDate = Math.abs(myDate_1 - myDate_2); // 取相差毫秒数的绝对值

  totalDays = Math.floor(diffDate / (1000 * 3600 * 24)); // 向下取整
  // console.log(totalDays)

  return totalDays; // 相差的天数
}

export { getDiffDay };
