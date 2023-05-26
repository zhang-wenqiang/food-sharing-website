const { useState } = require("react");
//监听右侧滑标位置
function useWindowScroll() {
  const [y, setY] = useState(0);

  window.addEventListener("scroll", () => {
    const h = document.documentElement.scrollTop;
    setY(h);
  });

  return [y];
}

export { useWindowScroll };
