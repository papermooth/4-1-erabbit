// 获取全局对象实例中的属性和方法
const {safeArea, navigateTo, navigateBack, http} = getApp()

// 导入 MoBx 相关模块
import {createStoreBindings} from "mobx-miniprogram-bindings"
import {store} from "./store"

Page({
  data: {
    safeArea,
    tabs: [
      {text: '商品', offset: 0},
      {text: '评价', offset: 0},
      {text: '详情', offset: 0},
      {text: '推荐', offset: 0}
    ],
    anchorIndex: 0,
    scrollTop: 0,
    layer: '',
    halfDialogVisible: false,
    swiperCurrentIndex: 0,
    buttonType: '',
    tabIndex: 0
  },

  onReady() {
    // 创建元素相交状态监听器
    this._observer = wx.createIntersectionObserver(this, {
      observeAll: true
    })

    // 监听元素间相关状态
    this.intersectionObserver()

    // 创建 WXML 节点查询器
    this._query = wx.createSelectorQuery()

    // 动画时间线
    const scrollTimeline = {
      scrollSource: "#scrollView",
      timeRange: 500,
      startScrollOffset: 0,
      endScrollOffset: 85
    }

    // 创建帧动画
    this.animate('.navbar', [
      {backgroundColor: '#fff0'},
      {backgroundColor: '#fff'}
    ], 500, scrollTimeline)

    this.animate('.back', [
      {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        left: '10px',
        color: '#fff',
        offset: 0
      },
      {
        backgroundColor: 'rgba(0, 0, 0, 0.12)',
        left: '7px',
        color: '#fff',
        offset: 0.7
      },
      {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        left: '6px',
        color: '#191919',
        offset: 1
      }
    ], 500, scrollTimeline)

    this.animate('.tabs, .search', [
      {opacity: 0},
      {opacity: 1}
    ], 500, scrollTimeline)
  },

  // 获取 WXML 节点信息
  selectWXML() {
    // 计算节点相对于窗口的位置
    this._query.selectAll('.anchor')
      .boundingClientRect((rects) => {
        let tabs = this.data.tabs
        rects.forEach((rect, index) => {
          tabs[index].offset = rect.top
        })
        this.setData({tabs})
      }).exec()
    
      // 计算自定义导航栏的高度
    this._query.select('.navbar')
      .boundingClientRect((rect) => {
        this.navBarHeight = rect.height
      }).exec()
  },

  async onLoad({id}) {
    // 挂载全局对象公共方法
    this.navigateTo = navigateTo
    this.navigateBack = navigateBack

    // 定义数据记录图片加载的情况
    this._counter = 0

    // 注入状态
    this.storeBindings = createStoreBindings(this, {
      store,
      fields: ["skuLabel"],
      actions: ["updateSkuLabel"]
    })

    // 调用接口，获取商品详情数据
    // const goods = await this.getGoodsDetail(id)

    const [goods, recommendData] = await http.all(
      this.getGoodsDetail(id),
      this.getRecommend({id, limit: 8})
    )
    
    // 获取所有规格型号类别名称
    let skuLabel = goods.specs.map((spec) => {
      return spec.name
    }).join('/')

    // 更新数据状态
    this.updateSkuLabel(skuLabel)

    // 商品详情中图片的数量
    this._imageSize = goods.details.pictures.length

    // 设置数据，更新渲染
    this.setData({goods, recommendData}, this.selectWXML)
  },

  // onShow
  async onShow() {
    // 检测用户登录状态
    if(wx.getStorageSync('token')) {
      // 调用接口获取收货地址
      const shipments = await this.getAddress()

      // 查找 isDefault 值为 1 的地址
      const shipment = shipments.find((item) => {
        return item.isDefault === 1
      })

      // 设置数据，更新渲染
      this.setData({shipments, shipment})
    }
  },

  // 监听图片的加载
  imageLoaded() {
    this._counter++

    // 当全部图片加载完成后再次获取元素相对于窗口的距离
    if(this._counter === this._imageSize) {
      this.selectWXML()
    }
  },
  
  nextVersion() {
    wx.showToast({
      title: '等待下一个版本哦',
      icon: 'none'
    })
  },

  onUnload() {
    this.disconnect()
  },

  showHalfDialog(ev) {
    // 动态获取 halfDialog 展示的内容
    let {layer, buttonType} = ev.mark

    // 如果用户点击收货地址时去检测用户是否登录
    if(layer === 'shipment' && !wx.getStorageSync('token')) {
      return wx.navigateTo({
        url: '/pages/login/index'
      })
    }

    this.setData({
      layer,
      buttonType: buttonType || '',
      halfDialogVisible: true
    })
  },

  hideHalfDialog() {
    this.setData({
      halfDialogVisible: false
    })
  },

  // 监测元素相交状态
  intersectionObserver() {
    this._observer
      .relativeTo('.navbar')
      .observe('.anchor', ({
        dataset: {anchorIndex},
        boundingClientRect: {top}
      }) => {
        if(top < 0) return
        this.setData({anchorIndex})
      })
  },

  disconnect() {
    if(this._observer) this._observer.disconnect()
  },

  scrollTo(ev) {
    // 停止监听元素相关状态
    this.disconnect()
    
    // 获取滚动位置及索引值
    let {
      anchorOffset: scrollTop,
      anchorIndex
    } = ev.target.dataset
    
    // 计算滚动位置
    scrollTop -= this.navBarHeight
    
    // 页面滚动
    this.setData({scrollTop, anchorIndex})
  },

  dragEnd() {
    this.disconnect()
    this.intersectionObserver()
  },

  scrollToUpper() {
    this.setData({anchorIndex: 0})
  },

  // 监听用户点击Tab
  changeTab({mark: {tabIndex}}) {
    // console.log(ev)

    // 设置数据，更新渲染
    this.setData({tabIndex})
  },

  // 自定义事件用来获取组件内的数据
  getSelectedAddress(ev) {
    // 设置数据，更新渲染
    this.setData({
      shipment: ev.detail.shipment,
      halfDialogVisible: false
    })
  },

  // 商品详情接口
  getGoodsDetail(id) {
    return http.get('/goods', {id})
  },

  // 推荐商品接口
  getRecommend(query) {
    return http.get('/goods/relevant', query)
  },

  // 收货地址列表接口
  getAddress() {
    return http.get('/member/address')
  }
})