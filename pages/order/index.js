
// 导入全局实例中的属性或方法
const {http} = getApp()

Page({
  data: {
    swiperIndex: 0,
    adjustIndex: 0,
    states: [
      {
        id: 1,
        query: {page: 1, pageSize: 10, orderState: 0},
        orders: []
      },
      {
        id: 2,
        query: {page: 1, pageSize: 10, orderState: 1},
        orders: []
      },
      {
        id: 3,
        query: {page: 1, pageSize: 10, orderState: 2},
        orders: []
      },
      {
        id: 4,
        query: {page: 1, pageSize: 10, orderState: 3},
        orders: []
      },
      {
        id: 5,
        query: {page: 1, pageSize: 10, orderState: 4},
        orders: []
      },
    ]
  },

  onLoad({state = 0}) {
    // 设置 swiperIndex 的初始值，用来指定默认状态的订单列表
    this.setData({swiperIndex: state})

    // 页面初始时获取订单列表
    if(state == 0) this.render(state)
  },

  changeTab(ev) {
    // 获取当前 swiperItem 的索引值值
    let {swiperIndex} = ev.target.dataset
    swiperIndex = ev.detail.currentItemId || swiperIndex
    // 切换不同的 swiperItem
    this.setData({swiperIndex})
  },

  onFinish(ev) {
    // 获取订单状态所对应的索引值
    const {swiperIndex} = this.data

    // 控制索引值改变的顺序
    this.setData({
      adjustIndex: swiperIndex
    })

    // 当订单列表中存在数据了，就不需要再请求了
    if(this.data.states[swiperIndex].orders.length > 0) return

    // 调用接口，获取订单列表数据
    this.render(swiperIndex)

  },

  async render(swiperIndex) {
    // 获取到不同状态订单请求相关的参数
    const state = this.data.states[swiperIndex]
    
    // 记录请求状态
    this._loading = true

    // 调用接口，获取订单列表数据
    const orderData = await this.getOrder(state.query)
    
    // 记录请求状态
    this._loading = false

    // 获取页码相关数据
    const {page, pages} = orderData
    // 判断有没有更多数据
    state.hasMore = page < pages

    // 待修改数据的路径
    const path = `states[${swiperIndex}].orders`

    // 设置数据，更新渲染
    this.setData({
      [path]: state.orders.concat(orderData.items)
    })
  },

  getMore() {
    // 提取数据
    const {swiperIndex, states} = this.data
    // 查找请求参数
    const state = states[swiperIndex]

    // 如果没有更多数据了就不再发起请求了
    if(this._loading || !state.hasMore) return

    // 更新页码
    state.query.page++

    // 调用接口，获取更多数据
    this.render(swiperIndex)

  },

  navigateTo(ev) {
    let {url} = ev.mark
    wx.navigateTo({url})
  },

  // 订单列表接口
  getOrder(query) {
    return http.get('/member/order', query)
  }

})