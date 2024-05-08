
// 导入全局实例中的属性或方法
const {http} = getApp()

const computedBehavior = require('miniprogram-computed').behavior

Page({
  behaviors: [computedBehavior],
  data: {
    buyerMessage: '',
    halfDialogVisible: false,
    layerIndex: 0,
    layerData: [
      {
        title: '配送时间',
        currentIndex: 0,
        list: [
          {
            id: 1,
            text: '时间不限 (周一至周日)'
          },
          {
            id: 2,
            text: '工作日送 (周一至周五)'
          },
          {
            id: 3,
            text: '周末配送 (周六至周日)'
          },
        ]
      },
      {
        title: '支付方式',
        currentIndex: 0,
        list: [
          {
            id: 1,
            text: '在线支付'
          },
          {
            id: 2,
            text: '货到付款'
          }
        ]
      }
    ]
  },

  computed: {
    layer({layerData, layerIndex}) {
      return layerData[layerIndex]
    },

    payment({layerData}) {
      let {currentIndex} = layerData[1]
      return layerData[1].list[currentIndex]
    },

    delivery({layerData}) {
      let {currentIndex} = layerData[0]
      return layerData[0].list[currentIndex]
    }
  },

  async onLoad({channel}) {
    // 如果是从购物车去结算跳转过来的
    if(channel === 'cart') {
      // 调用接口，获取订单信息
      const orderInfo = await this.getInfoByCart()
      // 设置数据，更新渲染
      this.setData({orderInfo})
    }

    // 监听自定义事件并获取页面参数
    // 从商品详情立即买跳转过来的
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('getPageData', async (data) => {
      // 调用接口获取订单信息数据
      const orderInfo = await this.getInfoByNow(data)
      // 设置数据，更新渲染
      this.setData({orderInfo})
    })

  },

  onChange(ev) {
    this.setData({
      'layer.currentIndex': ev.detail.defaultIndex,
      halfDialogVisible: false
    })
  },

  showHalfDialog(ev) {
    let {index} = ev.mark
    this.setData({
      layerIndex: index,
      halfDialogVisible: true
    })
  },

  navigateTo(ev) {
    let {url} = ev.mark
    wx.navigateTo({url})
  },

  async goPayment() {
    // 获取生成订单所需要的参数
    const {userAddresses, goods} = this.data.orderInfo
    const {delivery, payment, buyerMessage} = this.data

    // 如果用户没有收货地址时不允许提交订单
    if(userAddresses.length === 0) return wx.showToast({
      title: '请添加一个新地址',
      icon: 'none'
    })

    // 收货地址信息
    const addressId = userAddresses[0].id
    // 商品信息
    const newGoods = goods.reduce((array, item) => {
      array.push({skuId: item.skuId, count: item.count})
      return array
    }, [])
    // 配送时间
    const deliveryTimeType = delivery.id
    // 支付方式
    const payType = payment.id

    // 调用接口
    const {id} = await this.createOrder({
      addressId,
      goods: newGoods,
      deliveryTimeType,
      payType,
      payChannel: payType === 1 ? 2 : '',
      buyerMessage
    })

    if(payType === 1) {
      
    }

    // 跳转到订单详情
    wx.navigateTo({
      url: '/pages/order/detail/index?id=' + id,
    })


    // wx.navigateTo({
    //   url: '/pages/order/payment/index',
    // })
  },
  
  // 获取买家留言
  getMessage(ev) {
    this.setData({buyerMessage: ev.detail.value})
  },

  // 获取订单信息（去结算）
  getInfoByCart() {
    return http.get('/member/order/pre')
  },

  // 获取订单信息（立即购买）
  getInfoByNow(query) {
    return http.get('/member/order/pre/now', query)
  },

  // 创建新订单接口
  createOrder(body) {
    return http.post('/member/order', body)
  }
})