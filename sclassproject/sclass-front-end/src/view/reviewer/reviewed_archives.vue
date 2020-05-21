<template>
  <div>
    <Row :gutter="14" style="margin-top: 14px;margin-bottom:20px">
      <i-col>
        <Card>
          <p slot="title">
            <Icon type="ios-analytics"></Icon>已审核档案信息
          </p>
          <Row type="flex" justify="center" align="middle" class="table-wrapper">
            <div class="count-to-con">
              <Table border :columns="columns" :data="reviewededArchiveList"></Table>
            </div>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Modal title="View Image" v-model="show.visible">
      <img :src="show.detailUrl" v-if="show.visible" style="width: 100%" />
    </Modal>
    <Row :gutter="14" style="margin-top: 14px;" v-if="seletRow != 0">
      <i-col>
        <Card>
          <p slot="title">
            <Icon type="ios-analytics"></Icon>查看档案
          </p>
          <Row type="flex" justify="center" align="middle">
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
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
import {
  getArchiveById,
  getReviewedArchiveList,
  getArchiveByIdDisabled
} from "@/api/student";

export default {
  name: "reviewed_archive",
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
          title: "审核完成时间",
          key: "lastest_mod_date"
        },
        {
          title:"档案状态",
          key:"archive_state",
          render: (h, params) => {
            return h("div",[
              h("Icon", {
                props: {
                  type: "person"
                }
              }),
              h("strong","审核通过")
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
          width: 220,
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
              )
            ]);
          }
        }
      ],
      reviewededArchiveList: [],
      show: {
        ArchiveShowing: {},
        detailUrl: "",
        visible: false
      },
      fileList: [],
      ArchiveId: 0
    };
  },
  methods: {
    showArchive(index) {
      var that = this;
      getArchiveByIdDisabled(this.reviewededArchiveList[index].archive_id).then(
        res => {
          if (1 == 1) {
            res.data.form_arch.formData = JSON.parse(res.data.form_content);
            that.$set(that.$data, "ReviewNote", "");
            that.$set(that.$data.show, "ArchiveShowing", res.data.form_arch);
            that.$set(that.$data, "fileList", res.data.fileList);
            that.$set(that.$data, "seletRow", 1);
          } else {
            that.$Message.warning("网络异常请重试");
          }
        }
      );
    },
    CloseArchiveShowCard() {
      this.$set(this.$data, "ReviewNote", "");
      this.$set(this.$data.show, "ArchiveShowing", {});
      this.$set(this.$data, "seletRow", 0);
    },
    InitList() {
      var that = this;
      getReviewedArchiveList().then(res => {
        if (res.data[0] != undefined) {
          that.$set(that.$data, "reviewededArchiveList", res.data);
        }
      });
    },
    handleView(item) {
      this.show.detailUrl = item.url;
      this.show.visible = true;
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
</style>
