import "./index.scss";
import {
  Row,
  Col,
  Button,
  Menu,
  Dropdown,
  Input,
  Space,
  message,
  Watermark,
  Modal,
} from "antd";
import { MenuUnfoldOutlined, SettingOutlined } from "@ant-design/icons";
import RichTextEditorAndUpload from "../../commonComponent/richTextEditor";
import { useState } from "react";
import { useStore } from "../../store";
import { useEffect } from "react";
import { observer } from "mobx-react-lite";

//菜单选项
const items = [
  {
    key: "1",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.antgroup.com"
      >
        1st menu item
      </a>
    ),
  },
  {
    key: "2",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.aliyun.com"
      >
        2nd menu item
      </a>
    ),
  },
  {
    key: "3",
    label: (
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://www.luohanacademy.com"
      >
        3rd menu item
      </a>
    ),
  },
];
const itemsArticleMenu = [
  {
    label: "删除文章",
    key: 0,
  },
];
function WriteArticle() {
  //const navigate = useNavigate();
  const { userStore, articleStore } = useStore();

  //控制添加文集显示
  const [addKey, setAddKey] = useState(0);

  //文集名字状态管理
  const [collectedWorksTitle, setCollectedWorksTitle] = useState("");

  //被选中文集状态管理
  const [cwMenuSelected, setcwMenuSelected] = useState("1");
  //被选中文章状态管理
  const [selectedArticleInCW, setSelectedArticleInCW] = useState("1");
  //被选中文章内容显示状态管理
  const [selectedArticleView, setSelectedArticleView] = useState(0);
  //删除文章提示显示状态管理
  const [isModalOpen, setIsModalOpen] = useState(false);

  //获取文章列表及被选中文章信息函数
  const getArticleInfo = async () => {
    //整理参数
    const params = new URLSearchParams();
    params.append(
      "params",
      JSON.stringify({ collectedWorksId: cwMenuSelected })
    );

    await articleStore.getArticleListByCWId(params);
    const length = articleStore.selectedArticleList.length;
    if (length > 0) {
      setSelectedArticleInCW(articleStore.selectedArticleList[0].key);
    } else {
      setSelectedArticleInCW("1");
      setSelectedArticleView(0);
    }
  };

  //传给子组件的函数，刷新文章列表
  const toRefresh = async () => {
    //整理参数
    const params = new URLSearchParams();
    params.append(
      "params",
      JSON.stringify({ collectedWorksId: cwMenuSelected })
    );

    await articleStore.getArticleListByCWId(params).then(res=>{
      setSelectedArticleInCW(selectedArticleInCW)
    });
  };

  //添加文集按钮点击触发函数
  const addCollectedWorksButton = async () => {
    const authorId = JSON.parse(userStore.token).data.id;
    //整理参数
    const params = new URLSearchParams();
    params.append(
      "params",
      JSON.stringify({
        authorId,
        title: collectedWorksTitle,
      })
    );

    //添加文集请求
    await articleStore
      .addCollectedWorks(params)
      .then((res) => {
        if (res) {
          message.success("添加成功", 1);
        } else {
          message.error("添加失败", 1);
        }
      })
      .catch((err) => {
        message.error("出错");
      });
    setCollectedWorksTitle("");

    //添加文集后，重新刷新文集列表
    params.delete("params");
    params.append("params", JSON.stringify({ authorId }));
    await articleStore.getCollectedWorksList(params);
    const length = articleStore.collectedWorksList.length;
    if (length > 0) {
      setcwMenuSelected(articleStore.collectedWorksList[length - 1].key);
    }
  };
  //新增文章触发事件
  const addArticleButtonOnClick = async () => {
    //判断当前有没有选中文集，有才新增
    if (cwMenuSelected === "1") {
      return;
    }
    //有选中文集，调用新增接口，新增接口中将返回的文章详情添加进文章列表，并设置当前文章选中为新增文章
    const authorId = JSON.parse(userStore.token).data.id;
    const params = new URLSearchParams();
    params.append(
      "params",
      JSON.stringify({ authorId, collectedWorksId: cwMenuSelected })
    );

    await articleStore
      .addArticle(params)
      .then((res) => {
        if (res) {
          setSelectedArticleInCW(res);
        }
      })
      .catch((err) => {
        console.log(err);
      });
    //将文章
  };

  //点击删除文章，显示提示信息
  const showModal = () => {
    setIsModalOpen(true);
  };
  //了解提示信息，确定执行
  const handleOk = async () => {
    //整理参数，要删除的文章id
    const params = new URLSearchParams();
    params.append("params", JSON.stringify({ articleId: selectedArticleInCW }));

    //发送http请求删除文章
    await articleStore
      .deleteArticle(params)
      .then((res) => {
        if (res) {
          message.success("删除成功", 1);
        } else {
          message.error("删除失败", 1);
        }
      })
      .catch((err) => {
        message.error("出错" + err, 1);
      });
    //刷新文章列表
    await getArticleInfo();
    setIsModalOpen(false);
  };
  //取消提示信息显示
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  //页面加载先获取一次文集
  useEffect(() => {
    const getCWList = async () => {
      const authorId = JSON.parse(userStore.token).data.id;
      const params = new URLSearchParams();
      params.append("params", JSON.stringify({ authorId }));
      await articleStore.getCollectedWorksList(params);
      const length = articleStore.collectedWorksList.length;
      if (length > 0) {
        setcwMenuSelected(articleStore.collectedWorksList[0].key);
      }
    };
    getCWList();
  }, [articleStore, userStore.token]);

  //被选中文集文章列表显示
  useEffect(() => {
    const getSelectedCWArticleList = async () => {
      //整理参数
      const params = new URLSearchParams();
      params.append(
        "params",
        JSON.stringify({ collectedWorksId: cwMenuSelected })
      );

      await articleStore.getArticleListByCWId(params);
      const length = articleStore.selectedArticleList.length;
      if (length > 0) {
        setSelectedArticleInCW(articleStore.selectedArticleList[0].key);
      } else {
        setSelectedArticleInCW("1");
        setSelectedArticleView(0);
      }
    };
    getSelectedCWArticleList();
  }, [cwMenuSelected,articleStore]);

  //被选中文章变化，对应内容显示
  useEffect(() => {
    setSelectedArticleView(0);
    if (selectedArticleInCW !== "1") {
      setSelectedArticleView(selectedArticleInCW);
    }
  }, [selectedArticleInCW]);

  return (
    <div className="write-article">
      <Row style={{ height: 874 }}>
        {/* 左边 */}
        <Col
          span={4}
          style={{
            height: 874,
            backgroundColor: "#404040",
            overflowY: "scroll",
          }}
        >
          <div className="write-article-collected-works-font">
            <div className="write-article-my-collected-works">我的文集</div>
          </div>
          <div className="write-article-create-collected-works">
            <Button onClick={() => setAddKey(1)} type="link" block>
              +新增文集
            </Button>
          </div>
          {addKey !== 0 ? (
            <div className="write-article-add-collected-works-view">
              <Input
                className="collected-works-view-title"
                placeholder="请输入文集名字。。。"
                value={collectedWorksTitle}
                onChange={(e) => setCollectedWorksTitle(e.target.value)}
              ></Input>
              <Space>
                <Button
                  onClick={addCollectedWorksButton}
                  style={{ marginRight: 40 }}
                  danger
                >
                  添加
                </Button>
                <Button
                  onClick={() => setAddKey(0)}
                  style={{ color: "white" }}
                  type="text"
                >
                  取消
                </Button>
              </Space>
            </div>
          ) : null}
          <div className="write-article-collected-works-list">
            <Menu
              items={articleStore.collectedWorksList}
              selectedKeys={[cwMenuSelected]}
              onSelect={(e) => setcwMenuSelected(e.key)}
            />
          </div>
          <div className="write-article-menu">
            <Dropdown
              menu={{
                items,
              }}
              placement="topLeft"
              trigger={["click"]}
            >
              <Button type="link" icon={<MenuUnfoldOutlined />}>
                菜单
              </Button>
            </Dropdown>
          </div>
        </Col>
        {/* 中间 */}
        <Col span={6} style={{ height: 874, overflowY: "scroll" }}>
          <div className="write-article-collected-works-details">
            <div className="write-article-collected-works-details-title">
              《文集名字》
            </div>
          </div>
          <div className="write-article-article-list">
            <Menu
              items={articleStore.selectedArticleList.map((item) => {
                return {
                  key: item.key,
                  label: (
                    <div>
                      {item.label}
                      <Dropdown
                        className={
                          selectedArticleInCW === item.key
                            ? "article-menu-dropdown2"
                            : "article-menu-dropdown"
                        }
                        menu={{
                          items: itemsArticleMenu.map((item) => {
                            return {
                              key: item.key,
                              label: (
                                <div onClick={showModal}>{item.label}</div>
                              ),
                            };
                          }),
                        }}
                        trigger={["click"]}
                      >
                        <SettingOutlined />
                      </Dropdown>
                    </div>
                  ),
                };
              })}
              selectedKeys={[selectedArticleInCW]}
              onSelect={(e) => setSelectedArticleInCW(e.key)}
            />
            <Modal
              title="确定删除嘛？"
              open={isModalOpen}
              onOk={handleOk}
              onCancel={handleCancel}
              okText={"确定"}
              cancelText={"取消"}
            >
              <p>确定删除后，如果该文章已发布也会随之删除</p>
            </Modal>
          </div>
          <div className="write-article-create-article">
            <Button onClick={addArticleButtonOnClick} type="link" block>
              +新增文章
            </Button>
          </div>
        </Col>
        {/* 右边 */}
        <Col span={14} style={{ height: 874 }}>
          <Watermark
            content="编辑文章"
            style={{
              height: 500,
            }}
          >
            {selectedArticleView !== 0 ? (
              <RichTextEditorAndUpload
                articleId={selectedArticleInCW}
                toRefresh={toRefresh}
                userInfoId={JSON.parse(userStore.token).data.id}
              ></RichTextEditorAndUpload>
            ) : null}
          </Watermark>
        </Col>
      </Row>
    </div>
  );
}

export default observer(WriteArticle);
