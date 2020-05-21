<style lang="less">
@import "./login.less";
</style>

<template>
  <div class="login">
    <div class="login-con">
      <Card icon="log-in" title="欢迎登录" :bordered="false">
        <div class="form-con">
          <login-form @on-success-valid="handleSubmit"></login-form>
          <p class="login-tip" :class="ErrorClass">{{AlertInfo}}</p>
        </div>
      </Card>
    </div>
  </div>
</template>

<script>
import LoginForm from '_c/login-form'
import { mapActions } from 'vuex'
export default {
  components: {
    LoginForm
  },data() {
    return {
      AlertInfo:"请输入正确的用户名及密码",
      ErrorClass:""
    }
  },
  methods: {
    ...mapActions([
      'handleLogin',
      'getUserInfo'
    ]),
    handleSubmit ({ userName, password }) {
      this.handleLogin({ userName, password }).then(res => {
        console.log(res);
        if(res.data.state == "fail"){
          this.$set(this.$data,"AlertInfo","账户或密码错误");
          this.$set(this.$data,"ErrorClass","red");
        }
        else{
          this.getUserInfo().then(res => {
          this.$router.push({
            name: this.$config.homeName
          })
        })
        }
      })
    }
  }
}
</script>

<style scoped>
.red{
  color: red;
}
</style>
