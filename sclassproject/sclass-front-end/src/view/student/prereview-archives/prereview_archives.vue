<template>
  <div>
    <Row :gutter="14" style="margin-top: 14px;margin-bottom:20px">
      <i-col>
        <Card>
          <p slot="title">
            <Icon type="ios-analytics"></Icon>待审核档案列表
          </p>
          <Row type="flex" justify="center" align="middle" class="table-wrapper">
            <div class="count-to-con">
              <Table border :columns="columns" :data="prereviewArchiveList"></Table>
            </div>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="14" style="margin-top: 14px;" v-if="seletRow != 0">
      <i-col>
        <Card>
          <template v-if="seletRow == 1">
            <p slot="title">
              <Icon type="ios-analytics"></Icon>修改档案
            </p>
            <Row type="flex" justify="center" align="middle">
              <div class="count-to-con">
                <Divider>
                  <h3 style="font-size:30px;">审核信息</h3>
                  <p>{{ReviewNote}}</p>
                </Divider>
                <Divider>
                  <h3 style="font-size:30px;">档案信息修改</h3>
                </Divider>
                <VueFormMaker ref="editForm" :options="edit.ArchiveEditing" />
                <Divider>
                  <h3 style="font-size:30px;">档案文件查看</h3>
                </Divider>
                <div>
                  请选择清晰且图片大小不超过500KB的照片，照片数量不超过 5 张，照片格式支持JPG、PNG格式
                  <Divider>请选择图片文件上传</Divider>
                  <div
                    v-bind:key="item.id"
                    class="demo-upload-list"
                    v-for="item in edit.uploadList"
                  >
                    <template v-if="item.status === 'finished'">
                      <img :src="item.url" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                      </div>
                    </template>
                    <template v-else>
                      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                  </div>
                  <Upload
                    ref="upload"
                    :headers="edit.Header"
                    :show-upload-list="false"
                    :default-file-list="edit.defaultList"
                    :on-success="handleSuccess"
                    :with-credentials="true"
                    :format="['jpg','jpeg','png']"
                    :max-size="500"
                    :on-format-error="handleFormatError"
                    :on-exceeded-size="handleMaxSize"
                    :before-upload="handleBeforeUpload"
                    multiple
                    type="drag"
                    :action="edit.url"
                    style="display: inline-block;width:120px;"
                  >
                    <div style="width: 120px;height:120px;line-height: 120px;">
                      <Icon type="ios-camera" size="40"></Icon>
                    </div>
                  </Upload>
                </div>
                <Divider>
              </Divider>
                <Button type="primary" v-on:click="UpdateArchive" style="margin-top:14px;">提交修改</Button>
              </div>
            </Row>
          </template>
          <Modal title="View Image" v-model="edit.visible">
            <img :src="edit.detailUrl" v-if="edit.visible" style="width: 100%" />
          </Modal>
          <template v-if="seletRow == 2">
            <p slot="title">
              <Icon type="ios-analytics"></Icon>查看档案
            </p>
            <Row type="flex" justify="center" align="middle">
              <Divider>
                <h3 style="font-size:30px;">审核信息</h3>
                <p>{{ReviewNote}}</p>
              </Divider>
              <Divider>
                <h3 style="font-size:30px;">档案信息修改</h3>
              </Divider>
              <div class="count-to-con">
                <VueFormMaker :options="show.ArchiveShowing" />
                <Divider>
                  <h3 style="font-size:30px;">档案文件查看</h3>
                </Divider>
                <div v-bind:key="item.id" class="demo-upload-list" v-for="item in fileList">
                  <img :src="item.url" />
                  <div class="demo-upload-list-cover">
                    <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                  </div>
                </div>
                <Divider>
              </Divider>
                <Button type="primary" v-on:click="CloseArchiveShowCard" style="margin-top:14px;">关闭</Button>
              </div>
            </Row>
          </template>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
import {
  getArchiveById,
  getArchiveList,
  editArchiveById,
  delArchiveById,
  submitArchiveStateToWait,
  delFileById,
  getArchiveByIdDisabled
} from "@/api/student";

export default {
  name: "prereview_archives_list",
  data() {
    return {
      seletRow: 0,
      ReviewNote: "",
      columns: [
        {
          title: "档案分类",
          key: "archive_cate",
          render: (h, params) => {
            return h("div", [
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong", params.row.archive_cate)
            ]);
          }
        },
        {
          title: "创建时间",
          key: "archive_create_date"
        },
        {
          title: "最后修改时间",
          key: "lastest_mod_date"
        },
        {
          title: "档案状态",
          key: "archive_state",
          render: (h, params) => {
                var a =  params.row.archive_state;
                var str = "";
                if(a == "MODIFIABLE")str = "待编辑";
                if(a == "WAIT")str = "待审核";
                if(a == "REJECT")str = "被驳回";
            return h("div",[
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong",str)
            ]);
          }
        },
        {
          title: "档案文件数量",
          key: "fileAmt"
        },
        {
          title: "操作",
          key: "action",
          width: 250,
          align: "center",
          render: (h, params) => {
            if(params.row.archive_state == "MODIFIABLE" || params.row.archive_state == "REJECT"){
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.showArchive(params.index);
                    }
                  }
                },
                "查看"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.editArchive(params.index);
                    }
                  }
                },
                "修改"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "error",
                    size: "small"
                  },
                  style: {
                    marginLeft: "5px"
                  },
                  on: {
                    click: () => {
                      this.removeArchive(params.index);
                    }
                  }
                },
                "删除"
              ),
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginLeft: "5px"
                  },
                  on: {
                    click: () => {
                      this.submitArchive(params.index);
                    }
                  }
                },
                "申请审核"
              )
            ]);}
            else if(params.row.archive_state == "WAIT"){
              return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  style: {
                    marginRight: "5px"
                  },
                  on: {
                    click: () => {
                      this.showArchive(params.index);
                    }
                  }
                },
                "查看"
              )]);
            }
          }
        }
      ],
      prereviewArchiveList: [],
      edit: {
        ArchiveEditing: {},
        FormArchId: 0,
        defaultList: [
        ],
        detailUrl: "",
        visible: false,
        uploadList: [],
        url: this.$config.baseUrl.pro+"/upload",
        Header: {}
      },
      fileList: [],
      ArchiveId: 0,
      show: {
        ArchiveShowing: {}
      }
    };
  },
  methods: {
    UpdateArchive() {
      var formData = this.edit.ArchiveEditing.formData;
      var content = {};
      var that = this;
      editArchiveById(this.ArchiveId, {
        form_data: this.edit.ArchiveEditing.formData,
        form_arch_id: this.edit.FormArchId
      }).then(res => {
        that.$set(that.$data.edit, "FormArchId", 0);
        that.$set(that.$data.edit, "ArchiveEditing", {});
        that.$set(that.$data, "ArchiveId", 0);
        that.$set(that.$data.show, "ArchiveShowing", {});
        that.$set(that.$data, "seletRow", 0);
        that.$set(that.$data, "ReviewNote", "");
        that.InitList();
      });
    },
    submitArchive(index){
      var that = this;
      submitArchiveStateToWait(this.prereviewArchiveList[index].archive_id).then(res => {
        if (res.data.state == "success") that.InitList();
      }).then(res=>{
        that.InitList();
      });
    },
    showArchive(index) {
      var that = this;
      var archiveId = this.prereviewArchiveList[index].archive_id;
      this.ArchiveId = archiveId;
      getArchiveByIdDisabled(this.prereviewArchiveList[index].archive_id).then(
        res => {
          if (1 == 1) {
            res.data.form_arch.formData = JSON.parse(res.data.form_content);
            that.$set(that.$data, "ReviewNote", res.data.review_note);
            that.$set(
              that.$data.show,
              "url",
              "//127.0.0.1:8808/apis/upload/" + archiveId
            );
            that.$set(that.$data.edit, "FormArchId", res.data.form_arch_id);
            that.$set(that.$data.edit, "ArchiveEditing", {});
            that.$set(that.$data.show, "ArchiveShowing", res.data.form_arch);
            that.$set(that.$data, "seletRow", 2);
            that.$set(that.$data, "fileList", res.data.fileList);
          } else {
            that.$Message.warning("网络异常请重试");
          }
        }
      );
    },
    removeArchive(index) {
      var that = this;
      delArchiveById(this.prereviewArchiveList[index].archive_id).then(res => {
        if (res.data.state == "success") that.InitList();
      });
    },
    CloseArchiveShowCard() {
      this.$set(this.$data, "ReviewNote", "");
      this.$set(this.$data.show, "ArchiveShowing", {});
      this.$set(this.$data, "seletRow", 0);
    },
    editArchive(index) {
      var that = this;

      this.ArchiveId = this.prereviewArchiveList[index].archive_id;
      this.$set(
        this.$data.edit,
        "url",
        this.$config.baseUrl.pro + "/upload/" + this.ArchiveId
      );
      getArchiveById(this.prereviewArchiveList[index].archive_id).then(res => {
        if (1 == 1) {
          res.data.form_arch.formData = res.data.form_content;
          that.$set(that.$data, "ReviewNote", res.data.review_note);
          that.$set(that.$data.show, "ArchiveShowing", {});
          that.$set(that.$data.edit, "ArchiveEditing", res.data.form_arch);
          that.$set(that.$data, "seletRow", 1);
          that.$set(that.$data.edit, "defaultList", res.data.fileList);
          that.$set(that.$data.edit, "uploadList", res.data.fileList);
        } else {
          that.$Message.warning("网络异常请重试");
        }
      }).then(res=>{
        that.InitList();
      });;
    },
    InitList() {
      var that = this;
      getArchiveList().then(res => {
        if (res.data[0] != undefined) {
          that.$set(that.$data, "prereviewArchiveList", res.data);
        }
      });
    },
    handleView(item) {
      this.edit.detailUrl = item.url;
      this.edit.visible = true;
    },
    handleRemove(file) {
      var that = this;
      const fileList = this.$refs.upload.fileList;
      var param = "";
      if(file.fileId != undefined){param = file.fileId;}
      else{param = file.response.fileId;}
      delFileById(param).then(res => {
        if (res.data.state == "success") {
          that.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
          that.$set(that.$data.edit, "uploadList", that.$refs.upload.fileList);
        }
      });
    },
    handleSuccess(res, file) {
      var archiveid = "001";
      this.$set(this.$data.edit, "uploadList", this.$refs.upload.fileList);
      file.url = res.url;
    },
    handleFormatError(file) {
      this.$Notice.warning({
        title: "文件格式错误",
        desc:
          "文件 " +
          file.name +
          " 格式不正确"
      });
    },
    handleMaxSize(file) {
      this.$Notice.warning({
        title: "超过最大上传文件大小限制",
        desc: "文件  " + file.name + " 太大了"
      });
    },
    handleBeforeUpload(e) {
      const check = this.edit.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "一份档案最多上传五张图片"
        });
      }
      return check;
    }
  },
  mounted() {
    this.InitList();
  }
};
</script>

<style lang="less" scoped>
@baseColor: ~"#dc9387";
.new-arch-page-row {
  height: 200px;
}
.step-one-cascader {
  width: 400px;
}
.step-one-cascader-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.progress-bar-wrapper {
  height: 120px;
}
.count-to-con {
  display: block;
  width: 100%;
  text-align: center;
}
.count-text {
  font-size: 50px;
  color: @baseColor;
}
.slot-text {
  font-size: 22px;
}
.unit-class {
  font-size: 30px;
  color: @baseColor;
}
.step-two-form-card {
  height: auto;
}
.uploader-example {
  width: 880px;
  padding: 15px;
  margin: 40px auto 0;
  font-size: 12px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
}
.uploader-example .uploader-btn {
  margin-right: 4px;
}
.uploader-example .uploader-list {
  max-height: 440px;
  overflow: auto;
  overflow-x: hidden;
  overflow-y: auto;
}
.ivu-input[disabled],
fieldset[disabled] .ivu-input {
  border: 1px solid #ddd;
  background-color: #0000;
  color: #aca899;
  opacity: 1;
}
.ivu-select-disabled .ivu-select-selection {
  background-color: #0000;
}
.demo-upload-list {
  display: inline-block;
  width: 120px;
  height: 120px;
  text-align: center;
  line-height: 120px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
}
.demo-upload-list img {
  width: 100%;
  height: 100%;
}
.demo-upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
}
.demo-upload-list:hover .demo-upload-list-cover {
  display: block;
}
.demo-upload-list-cover i {
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  margin: 0 2px;
}
</style>
