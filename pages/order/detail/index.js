
// 导入全局实例中的属性或方法
const {http, safeArea, platform, navigateBack, navigateTo} = getApp()

Page({
  data: {
    showHalfDialog: false,
    platform,
    safeArea
  },

  async onLoad({id}) {
    this.navigateBack = navigateBack
    this.navigateTo = navigateTo

    // 调用接口，获取订单详情
    const orderData = await this.getDetail(id)

    // 调用接口，获取猜你喜欢的数据
    const guessData = await this.getGuess()

    // 设置数据，更新渲染
    this.setData({
      orderData,
      guessData
    })
  },

  onReady() {
    this.animate('.navbar .title', [
      {opacity: 0},
      {opacity: 1}
    ], 600, {
      scrollSource: "#scrollView",
      timeRange: 600,
      startScrollOffset: 0,
      endScrollOffset: 120
    })
  },

  cancelOrder() {
    this.setData({showHalfDialog: true})
  },

  cancelHalfDialog() {
    this.setData({showHalfDialog: false})
  },

  // 订单详情接口
  getDetail(id) {
    return http.get('/member/order/' + id)
  },

  // 猜你喜欢接口
  getGuess() {
    return http.get('/home/goods/guessLike')
  }
})