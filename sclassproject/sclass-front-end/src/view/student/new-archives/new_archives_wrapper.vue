<template>
  <div>
    <Row :gutter="14" style="margin-top: 14px;">
      <i-col>
        <Card>
          <p slot="title">
            <Icon type="ios-analytics"></Icon>新建档案步骤
          </p>
          <Row type="flex" justify="center" align="middle" class="progress-bar-wrapper">
            <div class="count-to-con">
              <Steps :current="currentStep" status="process">
                <Step title="第一步" content="选择档案类型"></Step>
                <Step title="第二步" content="填写表单"></Step>
                <Step title="第三步" content="上传图片文件"></Step>
              </Steps>
            </div>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="14" style="margin-top: 14px;" v-if="currentStep == 0">
      <i-col>
        <Card>
          <p slot="title">
            <Icon type="ios-analytics"></Icon>请选择档案类型
          </p>
          <Row type="flex" justify="center" class="new-arch-page-row">
            <div class="step-one-cascader-wrapper">
              <div style="marigin-bottom:20px;">请在下列档案类型中选择您需要填报的奖项、证书</div>
              <Cascader :data="dynamicFormType" v-model="dynamicFormData" class="step-one-cascader"></Cascader>
              <Button type="primary" v-on:click="StepTwo" style="margin-top:14px;">下一步</Button>
            </div>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="14" style="margin-top: 14px;" v-if="currentStep == 1">
      <i-col>
        <Card>
          <p slot="title">
            <Icon type="ios-analytics"></Icon>请填写表单信息
          </p>
          <Row type="flex" justify="center" class="step-two-form-card">
            <div class="count-to-con">
              <VueFormMaker ref="Form" :options="dynamicFormArch" />
              <Button type="primary" v-on:click="StepThree" style="margin-top:14px;">下一步</Button>
            </div>
          </Row>
        </Card>
      </i-col>
    </Row>
    <Row :gutter="14" style="margin-top: 14px;" v-if="currentStep == 2">
      <i-col>
        <Card>
          <p slot="title">
            <Icon type="ios-analytics"></Icon>请上传图片文件
          </p>
          <Row type="flex" justify="center" class="step-two-form-card">
            <div class="count-to-con">
              <div>
                请选择清晰且图片大小不超过500KB的照片，照片数量不超过 5 张，照片格式支持JPG、PNG格式
                <Divider>请选择图片文件上传</Divider>
                <div v-bind:key="item.id" class="demo-upload-list" v-for="item in stepThree.uploadList">
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
                  :headers="stepThree.Header"
                  :show-upload-list="false"
                  :default-file-list="stepThree.defaultList"
                  :on-success="handleSuccess"
                  :with-credentials="true"
                  :format="['jpg','jpeg','png']"
                  :max-size="500"
                  :on-format-error="handleFormatError"
                  :on-exceeded-size="handleMaxSize"
                  :before-upload="handleBeforeUpload"
                  multiple
                  type="drag"
                  :action="stepThree.url"
                  style="display: inline-block;width:120px;"
                >
                  <div style="width: 120px;height:120px;line-height: 120px;">
                    <Icon type="ios-camera" size="40"></Icon>
                  </div>
                </Upload>
                <Modal title="View Image" v-model="stepThree.visible">
                  <img
                    :src="stepThree.detailUrl"

                    v-if="stepThree.visible"
                    style="width: 100%"
                  />
                </Modal>
              </div>
              <Button type="primary" v-on:click="StepFour" style="margin-top:14px;">下一步</Button>
            </div>
          </Row>
        </Card>
      </i-col>
    </Row>
  </div>
</template>

<script>
import CountTo from "_c/count-to";
import {
  delFileById,
  getDynamicArchiveType,
  getDynamicArchiveArch,
  persistArchiveFormData
} from "@/api/student";
export default {
  name: "new_archives_wrapper",
  components: {
    CountTo
  },
  data() {
    return {
      stepThree: {
        defaultList: [
        ],
        detailUrl: "",
        visible: false,
        uploadList: [],
        url:this.$config.baseUrl.pro+"/upload",
        Header:{}
      },
      currentStep: 0,
      dynamicFormData: [],
      dynamicFormType: [],
      dynamicFormArchId: 0,
      dynamicFormArch: {},
      Archive_id: 0,
    };
  },
  methods: {
    init() {
      var that = this;
      getDynamicArchiveType().then((res)=>{
        that.$set(that.$data,"dynamicFormType",res.data.category);
      })

    },
    StepTwo: function(e) {


      if (this.dynamicFormData.length == 0) {
        this.$Message.warning("请选择一个正确的档案类型");
      } else {
        var form_arch_id = this.dynamicFormData.pop();
        this.$set(this.$data, "dynamicFormArchId", form_arch_id);
        var that =this;
        getDynamicArchiveArch(form_arch_id).then((res)=>{

        that.$set(that.$data, "dynamicFormArch",res.data.form_arch);
        that.$set(that.$data, "currentStep", 1);
        });
      }
    },
    StepThree: function(e) {
      var that = this;
      this.$set(this.$data.stepThree,"Header",{
        "Cookie":"token="+this.$store.state.user.token
      })
      this.$refs.Form.$refs.form.validate().then(res => {

        if (res) {
          persistArchiveFormData({
            form_arch_id: that.dynamicFormArchId,
            form_data: that.dynamicFormArch.formData
          }).then(
            res => {
              if (res.data.archiveId != undefined) {
                that.$set(that.$data.stepThree, "url", this.$config.baseUrl.pro+"/upload/"+res.data.archiveId);
                that.$set(that.$data, "Archive_id", res.data.archiveId);
                that.$set(that.$data, "currentStep", 2);
              } else {
                that.$Message.error("网络异常，请重试");
              }
            },
            res => {}
          );
        } else {
          that.$Message.error("验证未通过，请检查表单内容");
        }
      });
    },
    StepFour: function(e) {
      this.$set(this.$data, "currentStep", 0);
      this.$set(this.$data, "dynamicFormData", []);
      this.$set(this.$data, "dynamicFormType", []);
      this.$set(this.$data, "dynamicFormArchId", 0);
      this.$set(this.$data, "dynamicFormArch", {});
      this.$set(this.$data, "Archive_id", 0);
      this.$router.push("/student_archive/prereview_archive");
    },
    handleView(item) {
      this.stepThree.detailUrl = item.url;
      this.stepThree.visible = true;
    },
    handleRemove(file) {

      var that = this;
      const fileList = this.$refs.upload.fileList;
      var param = "";
      if(file.fileId != undefined){param = file.fileId;}
      else{param = file.response.fileId;}
      delFileById(param).then(res => {
        if (res.state == "success") {
          that.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
          that.$set(that.$data.stepThree, "uploadList", that.$refs.upload.fileList);
        }
      });
    },
    handleSuccess(res, file) {


      var archiveid = "001";
      this.$set(this.$data.stepThree,"uploadList",this.$refs.upload.fileList)
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
      const check = this.stepThree.uploadList.length < 5;
      if (!check) {
        this.$Notice.warning({
          title: "Up to five pictures can be uploaded."
        });
      }
      return check;
    }
  },
  mounted()
  {
    this.init();
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
