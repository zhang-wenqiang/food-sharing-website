import {
  UserOutlined,
  LikeOutlined,
  BookOutlined,
  CheckCircleTwoTone,
} from "@ant-design/icons";
import { Space, Row, Col, Avatar, Button, Tooltip, message } from "antd";
import { useEffect, useState } from "react";
import "./index.scss";
import { useWindowScroll } from "../../hooks/useWindowScroll";
import axios from "axios";
import { getDiffDay } from "../../utils";
import { useStore } from "../../store";
import { useNavigate } from "react-router-dom";

function Details() {
  const { userStore } = useStore();
  const navigate = useNavigate();
  //文章id
  const [articleId, setArticleId] = useState(1);
  //文章信息
  const [articleDetails, setArticleDetails] = useState(1);
  //作者信息
  const [userInfo, setUserInfo] = useState(1);
  //作者三篇文章信息
  const [authorThreeArticles, setAuthorThreeArticles] = useState([]);
  //随机五篇推荐文章
  const [randomFiveArticles, setRandomFiveArticles] = useState([]);
  //点赞状态管理
  const [isLike, setIsLike] = useState(0);
  //点赞数量
  const [likeCount, setLikeCount] = useState(0);
  //收藏状态管理
  const [isCollection, setIsCollection] = useState(0);
  //收藏量
  const [collectionCount, setCollectionCount] = useState(0);
  //评论列表
  const [remarkList, setRemarkList] = useState([]);
  //是否关注
  const [isAttention, setIsAttention] = useState(0);

  //滑动条位置
  const [y] = useWindowScroll();
  //热度排序
  const tabs = [
    {
      id: 1,
      name: "热度",
      type: "hot",
    },
  ];
  //当前排序状态管理
  const [active, setActive] = useState("hot");
  //发表评论临时变量
  const [comment, setComment] = useState("");

  //获取用户评论列表，但需要评论表和用户表连接，额外查询出用户头像、昵称
  const getRL2 = async () => {
    //参数需要文章id
    const params = new URLSearchParams();
    params.append("params", JSON.stringify({ articleId }));
    //发送请求
    await axios
      .get("/api1/remark/getRemarkList", { params })
      .then((res) => {
        if (res.data.status === 1) {
          setRemarkList(res.data.data);
        } else {
          console.log("获取评论列表失败1");
        }
      })
      .catch((err) => {
        console.log("获取评论列表失败2");
      });
  };
  //获取用户点赞量的方法
  const getLC2 = async () => {
    //整理参数
    const params = new URLSearchParams();
    params.append("params", JSON.stringify({ articleId: articleDetails.id }));

    //发送请求
    await axios
      .get("/api2/article/getArticleLikeCount", { params })
      .then((res) => {
        if (res.data.status === 1) {
          setLikeCount(res.data.data);
        } else {
          console.log("获取文章点赞量失败1");
        }
      })
      .catch((err) => {
        console.log("获取文章点赞量失败2+" + err);
      });
  };
  //获取文章的收藏量
  const getCC2 = async () => {
    //整理参数
    const params = new URLSearchParams();
    params.append("params", JSON.stringify({ articleId: articleDetails.id }));
    //发送请求
    await axios
      .get("/api2/article/getArticleCollectionCount", { params })
      .then((res) => {
        if (res.data.status === 1) {
          setCollectionCount(res.data.data);
        } else {
          console.log("获取文章收藏量失败1");
        }
      })
      .catch((err) => {
        console.log("获取文章收藏量失败2+" + err);
      });
  };
  //切换评论列表排序方式
  const liClick = (type) => {
    console.log(type);
    setActive(type);
  };
  //添加评论方法
  const addComment = async () => {
    if (userStore.token === null) {
      navigate("/login", { replace: true });
      message.warning("请先登录", 1);
      return;
    }
    if (comment === "") {
      return;
    }
    if (articleDetails === 1) {
      return;
    }
    if (userInfo===1) {
      return ;
    }
    const params = new URLSearchParams();
    params.append(
      "params",
      JSON.stringify({
        userId: JSON.parse(userStore.token).data.id,
        articleId,
        remarkContent: comment,
        authorId: userInfo.id,
      })
    );
    await axios
      .post("/api1/remark/addRemark", params)
      .then((res) => {
        if (res.data.status === 1) {
          setComment("");
          message.success("添加评论成功");
        } else {
          console.log("添加评论失败1");
        }
      })
      .catch((err) => {
        console.log("添加评论失败2：" + err);
      });
    await getRL2();
  };
  //删除评论方法
  const deleteRemark = async (remarkId) => {
    //整理参数
    const params = new URLSearchParams();
    params.append("params", JSON.stringify({ remarkId }));
    //发送请求
    await axios
      .post("/api1/remark/deleteRemark", params)
      .then((res) => {
        if (res.data.status === 1) {
          message.success("删除成功");
        } else {
          console.log("删除评论失败1");
        }
      })
      .catch((err) => {
        console.log("删除评论失败2+" + err);
      });
    await getRL2();
  };
  //评论输入框内容变化方法
  const commentChange = (e) => {
    setComment(e.target.value);
  };

  //设置点赞状态
  const setLikeState = async (state) => {
    //整理参数,登录用户id，文章id，要设置的值
    const params = new URLSearchParams();
    params.append(
      "params",
      JSON.stringify({
        userId: JSON.parse(userStore.token).data.id,
        articleId,
        isLike: state,
      })
    );

    await axios
      .post("/api2/article/setLikeState", params)
      .then((res) => {
        if (res.data.status === 1) {
          setIsLike(state);
        } else {
          console.log("点赞失败1");
        }
      })
      .catch((err) => {
        console.log("点赞失败2" + err);
      });
    await getLC2();
  };

  //设置文章收藏状态
  const setIsCollectionState = async (state) => {
    //整理参数,用户id，文章id
    const params = new URLSearchParams();
    params.append(
      "params",
      JSON.stringify({ userId: JSON.parse(userStore.token).data.id, articleId })
    );

    //发送请求
    await axios
      .post("/api2/article/setIsCollectionState", params)
      .then((res) => {
        if (res.data.status === 1) {
          setIsCollection(state);
        } else {
          console.log("设置文章收藏状态失败1");
        }
      })
      .catch((err) => {
        console.log("设置文章收藏状态2+" + err);
      });
    getCC2();
  };
  //关注按钮按下
  const detailsAttentionButton = async () => {
    if (userStore.token === null) {
      message.warning("请登录", 1);
      return;
    }
    //先判断是不是自己的文章
    if (userInfo.id === JSON.parse(userStore.token).data.id) {
      message.warning("不能自己关注自己", 1);
      return;
    }
    //整理参数,当前用户id，要关注的用户id
    const params = new URLSearchParams();
    const userId = JSON.parse(userStore.token).data.id;
    const targetId = userInfo.id;
    params.append("params", JSON.stringify({ userId, targetId }));

    //发送请求
    await axios
      .post("/api1/user/focusOrOffUser", params)
      .then((res) => {
        if (res.data.status === 1) {
          setIsAttention(isAttention === 1 ? 0 : 1);
          message.success(res.data.data, 1);
        } else {
          console.log("关注用户失败1");
        }
      })
      .catch((err) => {
        console.log("关注用户失败2" + err);
      });
  };
  //设置文章id
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setArticleId(urlParams.get("articleId"));
  }, []);

  //获取文章信息,获取当前用户是否点赞文章,是否收藏文章
  useEffect(() => {
    if (articleId === 1) {
      return;
    }

    //获取文章信息
    const getAD = async () => {
      //参数：文章id
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ articleId }));
      await axios
        .get("/api2/article/getArticleById", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setArticleDetails(res.data.data);
          } else {
            message.error("获取文章信息失败1", 1);
          }
        })
        .catch((err) => {
          console.log("获取文章信息失败2");
        });
    };
    //获取用户是否点赞文章
    const getAL = async () => {
      const params = new URLSearchParams();
      params.append(
        "params",
        JSON.stringify({
          userId: JSON.parse(userStore.token).data.id,
          articleId,
        })
      );
      await axios
        .get("/api2/article/getArticleIsLike", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setIsLike(res.data.data.islike);
          } else {
            console.log("点赞状态获取失败1");
          }
        })
        .catch((err) => {
          console.log("点赞状态获取失败2" + err);
        });
    };
    //获取用户是否收藏文章
    const getAC = async () => {
      //整理参数，用户id，文章id
      const params = new URLSearchParams();
      params.append(
        "params",
        JSON.stringify({
          userId: JSON.parse(userStore.token).data.id,
          articleId,
        })
      );
      //发送请求
      await axios
        .get("/api2/article/getArticleIsCollection", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setIsCollection(res.data.data);
          } else {
            console.log("获取用户是否收藏文章失败1");
          }
        })
        .catch((err) => {
          console.log("获取用户是否收藏文章失败2+" + err);
        });
    };

    getAD();
    if (userStore.token !== null) {
      getAL();
      getAC();
    }
  }, [articleId, userStore]);

  //获取文章作者信息，
  useEffect(() => {
    if (articleDetails === 1) {
      return;
    }
    //获取文章作者信息
    const getUI = async () => {
      //参数：文章id
      const params = new URLSearchParams();
      params.append(
        "params",
        JSON.stringify({ authorId: articleDetails.authorId })
      );
      axios
        .get("/api1/user/getUserById", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setUserInfo(res.data.data);
          } else {
            console.log("用户信息获取失败1");
          }
        })
        .catch((err) => {
          console.log("用户信息获取失败2:" + err);
        });
    };

    getUI();
  }, [articleDetails]);

  //获取当前登录人是否关注作者
  useEffect(() => {
    //获取用户是否关注该用户
    const getIA = async () => {
      //整理参数,登录者id，作者id,查询关注表中有没有
      const params = new URLSearchParams();
      params.append(
        "params",
        JSON.stringify({
          userId: JSON.parse(userStore.token).data.id,
          authorId: userInfo.id,
        })
      );

      await axios
        .get("/api1/user/getIsAttention", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setIsAttention(1);
          } else {
            console.log("没有关注信息1");
          }
        })
        .catch((err) => {
          console.log("没有关注信息2:" + err);
        });
    };
    if (userStore.token !== null) {
      getIA();
    }
  }, [userInfo, userStore]);

  //获取作者三篇文章信息
  useEffect(() => {
    if (userInfo === 1) {
      return;
    }

    const getATA = async () => {
      //整理参数,用户id
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ userId: userInfo.id }));
      await axios
        .get("/api2/article/getThreeArticlesByUserId", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setAuthorThreeArticles(res.data.data);
          } else {
            console.log("用户文章获取不到1");
          }
        })
        .catch((err) => {
          console.log("用户文章获取错误2");
        });
    };
    getATA();
  }, [userInfo]);
  //获取随机推荐文章
  useEffect(() => {
    const getRFA = async () => {
      //整理参数
      const params = new URLSearchParams();
      params.append("params", JSON.stringify([]));
      await axios
        .get("/api2/article/homeGetArticleList", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setRandomFiveArticles(res.data.data);
          } else {
            console.log("获取不到随机推荐文章");
          }
        })
        .catch((err) => {
          console.log("获取随机推荐文章失败" + err);
        });
    };
    getRFA();
  }, []);

  //获取评论列表
  useEffect(() => {
    if (articleId === 1) {
      return;
    }
    //获取用户评论列表，但需要评论表和用户表连接，额外查询出用户头像、昵称
    const getRL = async () => {
      //参数需要文章id
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ articleId }));
      //发送请求
      await axios
        .get("/api1/remark/getRemarkList", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setRemarkList(res.data.data);
          } else {
            console.log("获取评论列表失败1");
          }
        })
        .catch((err) => {
          console.log("获取评论列表失败2");
        });
    };
    getRL();
  }, [articleId]);

  //获取文章点赞量
  useEffect(() => {
    if (articleDetails === 1) {
      return;
    }
    const getLC = async () => {
      //整理参数
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ articleId: articleDetails.id }));

      //发送请求
      await axios
        .get("/api2/article/getArticleLikeCount", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setLikeCount(res.data.data);
          } else {
            console.log("获取文章点赞量失败1");
          }
        })
        .catch((err) => {
          console.log("获取文章点赞量失败2+" + err);
        });
    };
    getLC();
  }, [articleDetails]);

  //获取文章收藏量
  useEffect(() => {
    if (articleDetails === 1) {
      return;
    }
    //异步请求
    const getCC = async () => {
      //整理参数
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ articleId: articleDetails.id }));
      //发送请求
      await axios
        .get("/api2/article/getArticleCollectionCount", { params })
        .then((res) => {
          if (res.data.status === 1) {
            setCollectionCount(res.data.data);
          } else {
            console.log("获取文章收藏量失败1");
          }
        })
        .catch((err) => {
          console.log("获取文章收藏量失败2+" + err);
        });
    };
    getCC();
  }, [articleDetails]);
  return (
    <div className="details">
      <Row
        justify={"center"}
        align={"top"}
        style={{ backgroundColor: "rgb(240 230 230)" }}
      >
        {/* 左侧 */}
        <Col span={11}>
          {/* 文章 */}
          <div style={{ backgroundColor: "#fff", margin: 10, padding: 30 }}>
            <h1 style={{ fontSize: 35 }}>{articleDetails.title}</h1>
            {/* 作者信息 */}
            <Row align={"middle"}>
              {/* 头像 */}
              <Col span={2}>
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  src={
                    userInfo !== 1
                      ? userInfo.avatar
                      : "https://img2.baidu.com/it/u=3202947311,1179654885&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1679677200&t=6ec8e4c5ef8d2b6d445a5e6eaf436ee3"
                  }
                />
              </Col>
              {/* 头像右侧 */}
              <Col span={10}>
                <Space style={{ height: 30, width: 250 }}>
                  <h3>{userInfo !== 1 ? userInfo.name : null}</h3>
                  <Tooltip placement={"bottomLeft"} title={"普通用户"}>
                    <CheckCircleTwoTone
                      style={{ width: 42 }}
                      twoToneColor="#52c41a"
                    />
                  </Tooltip>
                  {/* 等于2表示是自己的文章,不用显示关注按钮 */}

                  <Button
                    className={
                      isAttention === 1 ? "details-attention-button" : null
                    }
                    onClick={detailsAttentionButton}
                    size={"small"}
                    danger
                  >
                    {isAttention === 1 ? "√已" : null}关注
                  </Button>
                </Space>
                <Space style={{ height: 30, width: 250, color: "#969696" }}>
                  <span>{userInfo !== 1 ? userInfo.registerTime : null}</span>
                  {/* <span>文章数 123</span> */}
                </Space>
              </Col>
            </Row>
            {/* 文章内容 */}
            <div
              className="article-details-article-content"
              style={{ fontSize: 20, marginTop: 27, textIndent: "2em" }}
            >
              {articleDetails !== 1 ? (
                <div
                  dangerouslySetInnerHTML={{ __html: articleDetails.content }}
                ></div>
              ) : null}
            </div>
          </div>
          {/* 评论区 */}
          <div
            style={{ backgroundColor: "#fff", margin: 10, padding: 30 }}
            className="remarkField"
          >
            <div className="comment-container">
              {/* 评论数 */}
              <div className="comment-head">
                <span>{remarkList.length} 评论</span>
              </div>
              {/* 排序 */}
              <div className="tabs-order">
                <ul className="sort-container">
                  {tabs.map((item) => (
                    <li
                      key={item.id}
                      className={active === item.type ? "on" : ""}
                      onClick={() => liClick(item.type)}
                    >
                      按{item.name}排序
                    </li>
                  ))}
                </ul>
              </div>

              {/* 添加评论 */}
              <div className="comment-send">
                <div className="user-face">
                  <img
                    className="user-head"
                    src={
                      userStore.token !== null
                        ? JSON.parse(userStore.token).data.avatar
                        : "https://img2.baidu.com/it/u=2065334685,1861530952&fm=253&fmt=auto&app=138&f=JPEG?w=596&h=500"
                    }
                    alt="头像"
                  />
                </div>
                <div className="textarea-container">
                  <textarea
                    cols="80"
                    rows="5"
                    placeholder="发条友善的评论"
                    className="ipt-txt"
                    value={comment}
                    onChange={commentChange}
                  />
                  <button className="comment-submit" onClick={addComment}>
                    发表评论
                  </button>
                </div>
                <div className="comment-emoji">
                  <i className="face"></i>
                  <span className="text">表情</span>
                </div>
              </div>

              {/* 评论列表 */}
              <div className="comment-list">
                {remarkList.map((item) => (
                  <div className="list-item" key={item.id}>
                    {/* 评论人头像 */}
                    <div className="user-face">
                      <img className="user-head" src={item.avatar} alt="" />
                    </div>

                    <div className="comment">
                      {/* 评论人 */}
                      <div className="user">{item.name}</div>
                      {/* 评论内容 */}
                      <p className="text">{item.remarkContent}</p>
                      <div className="info">
                        {/* 时间 */}
                        <span className="time">{item.remarkTime}</span>
                        {/* 删除 */}
                        {userStore.token != null &&
                        JSON.parse(userStore.token).data.id === userInfo.id ? (
                          <span
                            className="reply btn-hover"
                            onClick={() => deleteRemark(item.id)}
                          >
                            删除
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Col>
        {/* 右侧 */}
        <Col span={4}>
          {/* 右上 */}
          <div style={{ backgroundColor: "#fff", margin: 10, padding: 16 }}>
            {/* 头像 */}
            <Row align={"middle"}>
              {/* 头像 */}
              <Col span={6}>
                <Avatar
                  size={48}
                  icon={<UserOutlined />}
                  src={
                    userInfo !== 1
                      ? userInfo.avatar
                      : "https://img2.baidu.com/it/u=3202947311,1179654885&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1679677200&t=6ec8e4c5ef8d2b6d445a5e6eaf436ee3"
                  }
                />
              </Col>
              {/* 头像右侧 */}
              <Col span={17}>
                <Space style={{ height: 30, width: 100 }}>
                  <h4>{userInfo !== 1 ? userInfo.name : null}</h4>
                  <Tooltip placement={"bottomLeft"} title={"普通用户"}>
                    <CheckCircleTwoTone
                      style={{ width: 21 }}
                      twoToneColor="#52c41a"
                    />
                  </Tooltip>
                  {/* <Button size={"small"} style={{ borderRadius: 20 }} danger>
                    关注
                  </Button> */}
                </Space>
                <Space style={{ height: 30, width: 100 }}>
                  <span style={{ color: "#969696" }}>
                    已入住
                    {userInfo !== 1
                      ? getDiffDay(new Date(), userInfo.registerTime)
                      : null}
                    天
                  </span>
                </Space>
              </Col>
            </Row>
            {/* 横线 */}
            <div
              style={{
                backgroundColor: "#eee",
                width: "100%",
                height: 1,
                margin: "16px 0",
              }}
            ></div>
            {/* 作者文章推荐 */}
            {authorThreeArticles.map((item) => {
              return (
                <div key={item.id} role={"listitem"} style={{ marginTop: 16 }}>
                  <div className="author-article-commend" title={item.title}>
                    <a href={`/details?articleId=${item.id}`}>{item.title}</a>
                  </div>
                  <div className="author-article-like-count">
                    发布时间{item.publishTime}
                  </div>
                </div>
              );
            })}
          </div>
          {/* 右下 */}
          <div
            style={{
              backgroundColor: "#fff",
              margin: 10,
              padding: 16,
            }}
          >
            <h3 className="hot-story">热门文章</h3>
            {randomFiveArticles.map((item) => {
              return (
                <div
                  key={item.id}
                  className="hot-story-list-item"
                  title={`${item.title}`}
                >
                  <a href={`/details?articleId=${item.id}`}>{item.title}</a>
                </div>
              );
            })}
          </div>
        </Col>
      </Row>

      {/* 回到顶部 */}
      {y > 200 ? (
        <Button
          className="backTop"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          回到顶部
        </Button>
      ) : null}
      {/* 左侧点赞 */}
      <Button
        className={
          isLike === 1
            ? "likeArticle likeArticleOnClick"
            : "likeArticle likeArticleNoClick"
        }
        onClick={() => {
          if (isLike === 1) {
            setLikeState(0);
          } else {
            setLikeState(1);
          }
        }}
        type="primary"
        shape="circle"
        icon={<LikeOutlined style={{ color: "black" }} />}
        size={"large"}
      />
      <span
        className={
          isLike === 1
            ? "clickFontColor likeCount"
            : "noclickFontColor likeCount"
        }
      >
        {likeCount}赞
      </span>
      {/* 左侧点踩 */}
      <Button
        className={
          isLike === 2
            ? "noLikeArticle likeArticleOnClick"
            : "noLikeArticle likeArticleNoClick"
        }
        onClick={() => {
          if (isLike === 2) {
            setLikeState(0);
          } else {
            setLikeState(2);
          }
        }}
        type="primary"
        shape="circle"
        icon={<LikeOutlined rotate={180} style={{ color: "black" }} />}
        size={"large"}
      />
      <span
        className={
          isLike === 2
            ? "clickFontColor nolikeCount"
            : "noclickFontColor nolikeCount"
        }
      >
        踩
      </span>
      {/* 左侧收藏栏 */}
      <Button
        className={
          isCollection === 1
            ? "collection likeArticleOnClick"
            : "collection likeArticleNoClick"
        }
        onClick={() => {
          if (isCollection === 1) {
            setIsCollectionState(0);
          } else {
            setIsCollectionState(1);
          }
        }}
        type="primary"
        shape="circle"
        icon={<BookOutlined rotate={180} style={{ color: "black" }} />}
        size={"large"}
      />
      <span
        className={
          isCollection === 1
            ? "clickFontColor collectionCount"
            : "noclickFontColor collectionCount"
        }
      >
        {collectionCount}收藏
      </span>
    </div>
  );
}

export default Details;
