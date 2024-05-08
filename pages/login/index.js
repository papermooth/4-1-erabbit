
// 导入全局定义的方法或属性
const {navigateTo, http} = getApp()

Page({
  
  onLoad() {
    // 路由跳转方法
    this.navigateTo = navigateTo

    // 调用 API 获取登录凭证（code）
    wx.login({
      success: ({code}) => {
        // console.log(code)
        this._code = code
      }
    })
  },

  // 获取用户授权信息
  getUserProfile() {
    // 调用 API 获取用户的信息
    wx.getUserProfile({
      desc: '用于小兔鲜儿用户登录',
      success(ev) {
        console.log(ev)

        // this.wxXXX({
        //   code: this._code,
        //   ev.xxx
        // })
      },
      fail() {
        console.log(222)
      }
    })
  },

  // 获取用户加密信息
  async getPhoneNumber(ev) {
    // 获取加密信息及iv
    const {encryptedData, iv} = ev.detail

    // 调用接口实现登录的操作
    // const {token, ...userInfo} = await this.wxLogin({
    //   encryptedData,
    //   iv,
    //   code: this._code
    // })

    const {token, ...userInfo} = await this.wxSimpleLogin()

    // 保存在本地存储中
    wx.setStorageSync('token', `Bearer ${token}`)
    wx.setStorageSync('userInfo', userInfo)

    // 返回上一步
    wx.navigateBack()
  },

  // 提示消息
  nextVersion() {
    wx.showToast({title: '等下一个版本哦', icon: 'none'})
  },

  // 登录接口
  wxLogin(body) {
    return http.post('/login/wxMin', body)
  },

  // 学习用登录接口
  wxSimpleLogin() {
    return http.post('/login/wxMin/simple', {
      phoneNumber: '12312345678'
    })
  }
})