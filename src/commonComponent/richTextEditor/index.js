//RichTextEditorAndUpload
import "../../../node_modules/braft-editor/dist/index.css";
import "./index.scss";
import React from "react";
import BraftEditor from "braft-editor";
import { ContentUtils } from "../../../node_modules/braft-utils/dist";
//import { ImageUtils } from '../../../node_modules/braft-finder/dist'
import { Upload, Input, Button, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axios from "axios";
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export default class RichTextEditorAndUpload extends React.Component {
  //组件状态管理
  state = {
    editorState: BraftEditor.createEditorState(`<p>Hello <b>World!</b></p>`),
    fileList: [],
    //文章封面
    imageFileList: [],
    previewImage: "",
    previewOpen: false,
    //文章标题
    articleTitle: "无标题文章",
    //文章是否发布
    isPublish: 0,
  };
  //文章标题变化触发方法
  articleTitleOnChange = (e) => {
    //设置文章标题
    this.setState({
      articleTitle: e.target.value,
    });
  };

  //富文本编辑器内容变化触发函数
  handleChange = (editorState) => {
    this.setState({ editorState });
  };

  //上传组件内容变化触发函数
  onChange = ({ file }) => {
    if (file.status === "done") {
      this.setState({
        editorState: ContentUtils.insertMedias(this.state.editorState, [
          {
            type: "IMAGE",
            url: file.response,
          },
        ]),
        fileList: [{ url: file.response }],
      });
    }
    this.setState({
      fileList: [{ url: file.response }],
    });
  };

  //图片上传前控制大小，小于1MB
  beforeUploadImage = (file) => {
    const size = file.size < 1048576;
    if (!size) {
      message.error("图片大小应小于1MB", 2);
    }
    return size;
  };

  //发布按钮
  toPublish = async () => {
    const params = new URLSearchParams();
    const tmp = JSON.stringify({
      articleId: this.props.articleId,
      title: this.state.articleTitle,
      imageSave:
        this.state.imageFileList.length > 0
          ? this.state.imageFileList[0].url
          : "1",
      contentSave: this.state.editorState.toHTML(),
      authorId: this.props.userInfoId,
    });
    params.append("params", tmp);
    await axios
      .post("/api2/article/publishArticle", params)
      .then((res) => {
        if (res.data.status === 1) {
          this.setState({
            isPublish: 1,
          });
          message.success("发布成功", 1);
          //子给父传信
          this.props.toRefresh();
        } else {
          message.error("发布失败", 1);
        }
      })
      .catch((err) => {
        console.log("发布失败：", err);
      });
  };
  //取消发布
  cancelPublish = async () => {
    //整理参数
    const params = new URLSearchParams();
    params.append(
      "params",
      JSON.stringify({
        articleId: this.props.articleId,
        authorId: this.props.userInfoId,
      })
    );
    //发送请求
    await axios
      .post("/api2/article/cancelPublish", params)
      .then((res) => {
        if (res.data.status === 1) {
          message.success("取消发布成功！", 1);
          this.setState({
            isPublish: 0,
          });
        } else {
          message.error("取消发布失败", 1);
        }
      })
      .catch((err) => {
        message.error("取消发布失败" + err, 1);
      });
  };

  //组件首次渲染时钩子函数，先获取一次文章信息
  componentDidMount() {
    if (this.props.articleId) {
      const getArticleById = async () => {
        //整理参数
        const params = new URLSearchParams();
        params.append(
          "params",
          JSON.stringify({ articleId: this.props.articleId })
        );
        //请求文章内容
        await axios
          .get("/api2/article/getArticleById", { params })
          .then((res) => {
            const data = res.data.data;
            //设置富文本编辑器显示内容
            this.setState({
              editorState: BraftEditor.createEditorState(data.contentSave),
              articleTitle: data.title,
              imageFileList:
                data.imageSave !== "1" ? [{ url: data.imageSave }] : [],
              isPublish: data.isPublish,
            });
          })
          .catch((err) => {
            console.log(err);
          });
        //显示文章内容
      };
      getArticleById();
    }
  }
  //组件应不应该更新,render更新前的钩子函数
  shouldComponentUpdate(nextProps) {
    if (this.props.articleId !== nextProps.articleId) {
      //文章id变了，那就更新
      const getArticleById = async () => {
        //整理参数
        const params = new URLSearchParams();
        params.append(
          "params",
          JSON.stringify({ articleId: nextProps.articleId })
        );
        //请求文章内容
        await axios
          .get("/api2/article/getArticleById", { params })
          .then((res) => {
            const data = res.data.data;
            //设置富文本编辑器显示内容
            this.setState({
              editorState: BraftEditor.createEditorState(data.contentSave),
              articleTitle: data.title,
              imageFileList:
                data.imageSave !== "1" ? [{ url: data.imageSave }] : [],
              isPublish: data.isPublish,
            });
          })
          .catch((err) => {
            console.log(err);
          });
        //显示文章内容
      };
      getArticleById();
    }
    return true;
  }

  //点击封面预览触发的函数
  handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    this.setState({
      previewImage: file.url || file.preview,
      previewOpen: true,
    });
  };

  //预览显示取消函数
  handleCancel = () =>
    this.setState({
      previewOpen: false,
    });
  //封面列表变化触发函数
  handleImageChange = ({ fileList: newFileList }) => {
    this.setState({
      imageFileList: newFileList.map((item) => {
        if (item.response) {
          return {
            url: item.response,
          };
        }
        return item;
      }),
    });
  };

  render() {
    //定义富文本编辑器工具栏
    const controls = [
      "bold",
      "italic",
      "underline",
      "text-color",
      "separator",
      "link",
      "separator",
      {
        key: "my-button",
        type: "button",
        title: "保存",
        html: "<div> 保存</div>",
        onClick: () => {
          //判断标题不为空
          if (this.state.articleTitle.replace(/([\t\r\f\n\s]+)$/g, "") === "") {
            message.error("标题不能为空", 1);
            return;
          }
          const saveArticle = async () => {
            //需要四个参数，文章id、标题、保存内容、保存封面
            const params = new URLSearchParams();
            const tmp = {
              articleId: this.props.articleId,
              contentSave: this.state.editorState.toHTML(),
              title: this.state.articleTitle,
              imageSave:
                this.state.imageFileList.length > 0
                  ? this.state.imageFileList[0].url
                  : "1",
            };
            params.append("params", JSON.stringify(tmp));
            //发送请求
            await axios
              .post("/api2/article/saveArticle", params)
              .then((res) => {
                if (res.data.status === 1) {
                  message.success("保存成功", 1);
                  //子给父传信
                  this.props.toRefresh();
                } else {
                  message.error(res.data.data, 1);
                }
              })
              .catch((err) => {
                message.error("失败:" + err, 1);
              });
          };
          saveArticle();
        },
      },
      {
        key: "my-button-publish",
        type: "component",
        component: (
          <Button
            onClick={
              this.state.isPublish === 0 ? this.toPublish : this.cancelPublish
            }
            type="button"
            className="control-item button upload-button"
          >
            {this.state.isPublish === 1 ? "取消" : null}发布
          </Button>
        ),
      },
    ];
    //富文本编辑器额外工具
    const extendControls = [
      {
        key: "antd-uploader",
        type: "component",
        component: (
          <Upload
            name="image"
            accept="image/*"
            showUploadList={false}
            fileList={this.fileList}
            action="http://localhost:8002/upload/img"
            onChange={this.onChange}
            beforeUpload={this.beforeUploadImage}
          >
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button type="button" className="control-item button upload-button">
              插入图片
            </button>
          </Upload>
        ),
      },
    ];
    return (
      <div>
        <div className="write-article-title-and-image">
          <Input
            className="write-article-title"
            placeholder="无标题文章"
            bordered={false}
            value={this.state.articleTitle}
            onChange={this.articleTitleOnChange}
          />
          <Upload
            name="image"
            accept="image/*"
            className="write-article-image"
            action="/api2/upload/img"
            listType="picture-card"
            fileList={this.state.imageFileList}
            onPreview={this.handlePreview}
            onChange={this.handleImageChange}
            beforeUpload={this.beforeUploadImage}
            maxCount={1}
          >
            {this.state.imageFileList.length >= 1 ? null : (
              <div>
                <PlusOutlined />
                <div>封面</div>
              </div>
            )}
          </Upload>
        </div>

        <div className="editor-wrapper">
          <BraftEditor
            className="my-braft-editor"
            value={this.state.editorState}
            onChange={this.handleChange}
            controls={controls}
            extendControls={extendControls}
          />
        </div>
        <Modal
          open={this.state.previewOpen}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img
            alt="example"
            style={{
              width: "100%",
            }}
            src={this.state.previewImage}
          />
        </Modal>
      </div>
    );
  }
}
