
const {safeArea} = getApp()

Page({
  data: {
    nickname: '未登录',
    avatar: 'http://static.botue.com/erabbit/static/uploads/avatar_3.jpg',
    safeArea,
    tabs: ['我的收藏', '猜你喜欢', '我的足迹'],
    tabIndex: 0
  },

  onShow() {
    // 读取用户的登录信息(token)
    const token = wx.getStorageSync('token')
    // 读取用户信息（已登录）
    const userInfo = wx.getStorageSync('userInfo')

    // 设置数据，在页面中判断用户是否登录
    this.setData({
      isLogin: !!token,
      ...userInfo
    })
  },

  onReady() {
    this.animate('.profile', [
      {opacity: 1},
      {opacity: 0}
    ], 500, {
      scrollSource: "#scrollView",
      timeRange: 500,
      startScrollOffset: 0,
      endScrollOffset: 85
    })

    this.animate('.navbar', [
      {top: '0'},
      {top: '-30px'}
    ], 500, {
      scrollSource: "#scrollView",
      timeRange: 500,
      startScrollOffset: 0,
      endScrollOffset: 85
    })

    this.animate('.navbar .title', [
      {opacity: 0},
      {opacity: 1}
    ], 500, {
      scrollSource: "#scrollView",
      timeRange: 500,
      startScrollOffset: 85,
      endScrollOffset: 100
    })
  },

  navigateTo({mark}) {
    // console.log(mark)
    wx.navigateTo({
      url: mark.url
    })
  },

  changeTab ({mark: {index}}) {
    this.setData({tabIndex: index})
  },

  // 更新用户信息
  updateUserInfo() {
    wx.showToast({
      title: '等下一个版本哦~',
      icon: 'none'
    })
  },
  // 重新登录
  reLogin() {
    wx.navigateTo({
      url: '/pages/login/index',
    })
  }
})