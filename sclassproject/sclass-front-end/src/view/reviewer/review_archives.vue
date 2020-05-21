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
              <Table border :columns="columns" :data="reviewArchiveList"></Table>
            </div>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="14" style="margin-top: 14px;" v-if="selectMode != 0">
      <i-col>
        <Card>
          <p slot="title">
            <Icon type="ios-analytics"></Icon>审核该档案
          </p>
          <Row type="flex" justify="center" align="middle">
            <Divider>
              <h3 style="font-size:30px;">审核信息</h3>
              <p>{{ReviewNote}}</p>
            </Divider>
            <Divider>
              <h3 style="font-size:30px;">档案表单信息</h3>
            </Divider>
            <div class="count-to-con">
              <VueFormMaker :options="show.ArchiveShowing" />
              <Divider>
                <h3 style="font-size:30px;">档案文件查看</h3>
              </Divider>
              <div v-bind:key="item.id" class="demo-upload-list" v-for="item in show.fileList">
                <img :src="item.url" />
                <div class="demo-upload-list-cover">
                  <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                </div>
              </div>
              <Divider>
                <h3 style="font-size:30px;">确认审核结果</h3>
              </Divider>
              <Button
                type="primary"
                v-on:click="PassArchive"
                style="margin-top:14px;width:80px;margin-right:20px;"
              >通过</Button>
              <Button
                type="error"
                v-on:click="FailArchive"
                style="margin-top:14px;width:80px;margin-left:20px;"
              >不通过</Button>
            </div>
            <Modal
              title="填写驳回意见"
              :closable="false"
              @on-ok="FinishedReviewNote"
              @on-cancel="CanceledReviewNote"
              :value="failTag"
            >
              <Input v-model="CurReviewNote" type="textarea" placeholder="请输入修改意见" />
            </Modal>
            <Modal title="View Image" v-model="show.visible">
              <img :src="show.detailUrl" v-if="show.visible" style="width: 100%" />
            </Modal>
          </Row>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
import {
  getReviewArchiveList,
  reviewArchive,
  getArchiveByIdDisabled
} from "@/api/student";

export default {
  name: "review_archive",
  data() {
    return {
      ReviewNote: "",
      CurReviewNote: "",
      selectMode: 0,
      selectedArchiveId: 0,
      failTag: false,
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
            return h("div",[
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong","待审核")
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
            return h("div", [
              h(
                "Button",
                {
                  props: {
                    type: "primary",
                    size: "small"
                  },
                  on: {
                    click: () => {
                      this.reviewArchive(params.index);
                    }
                  }
                },
                "审核"
              )
            ]);
          }
        }
      ],
      reviewArchiveList: [],
      show: {
        ArchiveShowing: {},
        detailUrl: "",
        visible: false,
        fileList: []
      }
    };
  },
  methods: {
    UpdateArchive() {},
    reviewArchive(index) {
      var that = this;
      this.$set(
        this.$data,
        "selectedArchiveId",
        this.reviewArchiveList[index].archive_id
      );
      getArchiveByIdDisabled(this.reviewArchiveList[index].archive_id).then(
        res => {

          if (1 == 1) {
            res.data.form_arch.formData = JSON.parse(res.data.form_content);
            that.$set(that.$data, "ReviewNote", "");
            that.$set(that.$data.show, "ArchiveShowing", res.data.form_arch);
            that.$set(that.$data, "selectMode", 1);
            that.$set(that.$data, "ReviewNote", "");
            that.$set(that.$data.show, "fileList", res.data.fileList);

          } else {
            that.$Message.warning("网络异常请重试");
          }
        }
      );
    },
    PassArchive() {
      var that = this;
      reviewArchive(this.selectedArchiveId, "pass", "").then(res => {
        that.$set(that.$data.show, "ArchiveShowing", {});
        that.$set(that.$data, "selectedArchiveId", 0);
        that.$set(that.$data, "failTag", false);
        that.$set(that.$data, "CurReviewNote", "");
        that.$set(that.$data, "selectMode", 0);
        that.$set(that.$data, "ReviewNote", "");
      })
      .then((res)=>{
        that.InitList();
      });
    },
    FailArchive() {
      this.$set(this.$data, "failTag", true);
    },
    FinishedReviewNote() {

      var that = this;
      reviewArchive(this.selectedArchiveId, "fail", this.CurReviewNote).then(
        res => {

          that.$set(that.$data.show, "ArchiveShowing", {});
          that.$set(that.$data, "selectedArchiveId", 0);
          that.$set(that.$data, "failTag", false);
          that.$set(that.$data, "CurReviewNote", "");
          that.$set(that.$data, "selectMode", 0);
          that.$set(that.$data, "ReviewNote", "");
        }
      )
      .then((res)=>{
        that.InitList();
      });;
    },
    handleView(item) {
      this.show.detailUrl = item.url;
      this.show.visible = true;
    },
    CanceledReviewNote() {
      this.$set(this.$data, "failTag", false);
      this.$set(this.$data, "CurReviewNote", "");
    },
    InitList() {
      var that = this;
      getReviewArchiveList().then(res => {
          that.$set(that.$data, "reviewArchiveList", res.data);
          that.$set(that.$data,"selectMode",0);
      });
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
