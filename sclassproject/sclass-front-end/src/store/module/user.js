import {
  login,
  logout,
  getUserInfo
} from '@/api/user'
import {
  setToken,
  getToken
} from '@/libs/util'

export default {
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath
    },
    setUserId(state, id) {
      state.userId = id
    },
    setUserName(state, name) {
      state.userName = name
    },
    setAccess(state, access) {
      state.access = access
    },
    setToken(state, token) {
      state.token = token
      setToken(token)
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status
    }
  },
  actions: {
    // 登录
    handleLogin({
      commit
    }, {
      userName,
      password
    }) {
      userName = userName.trim()
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        }).then(res => {
          console.log(res);
          console.log(this);
          if (res.data.state == "fail") {
            this._vm.$Notice.error({
              title: '登录错误',
              desc: '账户或密码错误'
            });
          } else {
            const data = res.data;
            commit('setToken', data.token);
          }
          resolve(res);
        }).catch(err => {
          reject(err)
        })
      })
    },
    // 退出登录
    handleLogOut({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        commit('setToken', '')
        commit('setAccess', [])
        // var name = "token";
        // function getCookie(name) {
        //   var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        //   if (arr = document.cookie.match(reg))
        //     return unescape(arr[2]);
        //   else
        //     return null;
        // }
        // var exp = new Date();
        // exp.setTime(exp.getTime() - 1);
        // var cval = getCookie(name);
        // if (cval != null)
        //   document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        resolve()
      })
    },

    getUserInfo({
      state,
      commit
    }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token).then(res => {
            const data = res.data
            commit('setAvator', "https://avatars0.githubusercontent.com/u/20942571?s=460&v=4") //写死
            commit('setUserName', data.name)
            commit('setUserId', data.user_id)
            commit('setAccess', data.access)
            commit('setHasGetInfo', true)
            resolve(data)
          }).catch(err => {
            reject(err)
          })
        } catch (error) {
          reject(error)
        }
      })
    }
  }
}
