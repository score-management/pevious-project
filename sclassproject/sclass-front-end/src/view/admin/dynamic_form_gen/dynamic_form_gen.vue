<template>
  <div>
    <Row :gutter="14" style="margin-top: 14px;">
      <i-col>
        <Card style="height:700px">
          <p slot="title">
            <Icon type="ios-analytics"></Icon>动态表单创建
          </p>
          <Button @click="value3 = true" type="primary">选择修改或创建档案档案</Button>
          <Row type="flex" justify="center" align="middle">
            <div style="height:400px;width:100%;position:relative;">
              <Drawer
                title="Create"
                v-model="value3"
                width="720"
                :mask-closable="false"
                :styles="styles"
                :inner="true"
                :transfer="false"
              >
                <Form :model="formData">
                  <Row :gutter="32">
                    <Col span="12">
                      <FormItem label="Name" label-position="top">
                        <Input v-model="formData.name" placeholder="please enter user name" />
                      </FormItem>
                    </Col>
                    <Col span="12">
                      <FormItem label="Url" label-position="top">
                        <Input v-model="formData.url" placeholder="please enter url">
                          <span slot="prepend">http://</span>
                          <span slot="append">.com</span>
                        </Input>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row :gutter="32">
                    <Col span="12">
                      <FormItem label="Owner" label-position="top">
                        <Select v-model="formData.owner" placeholder="please select an owner">
                          <Option value="jobs">Steven Paul Jobs</Option>
                          <Option value="ive">Sir Jonathan Paul Ive</Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span="12">
                      <FormItem label="Type" label-position="top">
                        <Select v-model="formData.type" placeholder="please choose the type">
                          <Option value="private">Private</Option>
                          <Option value="public">Public</Option>
                        </Select>
                      </FormItem>
                    </Col>
                  </Row>
                  <Row :gutter="32">
                    <Col span="12">
                      <FormItem label="Approver" label-position="top">
                        <Select
                          v-model="formData.approver"
                          placeholder="please choose the approver"
                        >
                          <Option value="jobs">Steven Paul Jobs</Option>
                          <Option value="ive">Sir Jonathan Paul Ive</Option>
                        </Select>
                      </FormItem>
                    </Col>
                    <Col span="12">
                      <FormItem label="DateTime" label-position="top">
                        <DatePicker
                          v-model="formData.date"
                          type="daterange"
                          placeholder="please select the date"
                          style="display: block"
                          placement="bottom-end"
                        ></DatePicker>
                      </FormItem>
                    </Col>
                  </Row>
                  <FormItem label="Description" label-position="top">
                    <Input
                      type="textarea"
                      v-model="formData.desc"
                      :rows="4"
                      placeholder="please enter the description"
                    />
                  </FormItem>
                </Form>
                <div class="demo-drawer-footer">
                  <Button style="margin-right: 8px" @click="value3 = false">Cancel</Button>
                  <Button type="primary" @click="value3 = false">Submit</Button>
                </div>
              </Drawer>
              <Row type="flex" justify="center" align="middle">
                <Col span="8">
                  <Select v-model="model1" style="width:200px">
                    <Option
                      v-for="item in formItemList"
                      :value="item.value"
                      :key="item.value"
                    >{{ item.label }}</Option>
                  </Select>
                </Col>
                <Col span="2"></Col>
                <Col span="12"></Col>
              </Row>
            </div>
          </Row>
        </Card>
      </i-col>
    </Row>
  </div>
</template>
<script>
export default {
  name: "dynamic_form_gen",
  data() {
    return {
      value3: false,
      styles: {
        height: "calc(100% - 55px)",
        overflow: "auto",
        paddingBottom: "53px",
        position: "static"
      },
      formData: {
        name: "",
        url: "",
        owner: "",
        type: "",
        approver: "",
        date: "",
        desc: ""
      },
      formItemList: [
        {
          value: "input",
          label: "输入框"
        },
        {
          value: "select",
          label: "下拉框组件"
        },
        {
          value: "date",
          label: "日期选择组件"
        },
      ],
      model1: ""
    };
  }
};
</script>

<style scoped>
.demo-drawer-footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  background: #fff;
}
</style>
