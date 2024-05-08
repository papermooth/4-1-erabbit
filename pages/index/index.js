
// 获取全局实例中的方法或属性
const { safeArea, navigateTo, http } = getApp()

Page({
  data: {
    safeArea,
    bannerData: [
      {
        bannerPath: "http://static.botue.com/erabbit/static/uploads/slider_1.jpg"
      },
      {
        bannerPath: "http://static.botue.com/erabbit/static/uploads/slider_2.jpg"
      },
      {
        bannerPath: "http://static.botue.com/erabbit/static/uploads/slider_3.jpg"
      },
      {
        bannerPath: "http://static.botue.com/erabbit/static/uploads/slider_4.jpg"
      },
      {
        bannerPath: "http://static.botue.com/erabbit/static/uploads/slider_5.jpg"
      },
    ],
    hasMore: true,
    triggered: false
  },

  nextVersion() {
    wx.showToast({title: '等下一个版本哦', icon: 'none'})
  },

  scanCode() {
    wx.scanCode()
  },

  async onLoad() {
    // 挂载路由跳转方法
    this.navigateTo = navigateTo

    // 调用接口获取全部首页数
    this.getAll()
  },

  async getAll() {
    // 分页相关的数据
    this._page = 1
    this._pageSize = 10

    // 请求状态相关的数据
    this._loading = false

    // 调用接口（并发处理）
    const [
      bannerData,
      entryData,
      recommendData,
      freshData,
      guessData
    ] = await http.all(
      this.getBanner(),
      this.getEntry(),
      this.getRecommend(),
      this.getFresh(),
      this.getGuess()
    )

    // console.log(freshData)
    // console.log(guessData)

    // 设置数据，更新渲染
    this.setData({
      bannerData,
      entryData,
      recommendData,
      freshData,
      guessData,
      hasMore: guessData.page < guessData.pages
    })
  },

  // 调用首页广告接口
  getBanner() {
    return http.get('/home/banner')
  },

  // 前台类目接口
  getEntry() {
    return http.get('/home/category/head/mutli')
  },

  // 人气推荐接口
  getRecommend() {
    return http.get('/home/hot/mutli')
  },

  // 新鲜好物接口
  getFresh() {
    return http.get('/home/new')
  },

  // 猜你喜欢接口
  getGuess() {
    return http.get('/home/goods/guessLike', {
      page: this._page,
      pageSize: this._pageSize
    })
  },

  // 监听页面是否滚动到了底部
  async getMore() {

    // 如果没有更多数据了就不要发起请求
    // 如果请求正在进行时也不要发请求新求
    if(this._loading || !this.data.hasMore) return

    // 记录请求开始的状态
    this._loading = true

    // 更新页码
    this._page++

    // 调用接口获取更多的数
    const {items, page, pages} = await this.getGuess()

    // console.log(items)

    // 追加数据，更新渲染
    const {guessData} = this.data
    guessData.items = guessData.items.concat(items)

    this.setData({
      guessData,
      hasMore: page < pages
    })

    // 记录请求结束的状态
    this._loading = false
  },

  // 监听用户是否执行了下拉操作
  refresh() {
    // console.log(111)
    this.getAll()

    // 设置下拉交互状态
    this.setData({
      triggered: false
    })
  }
  
})