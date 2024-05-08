
// 获取封装好的 http 模块
const {http} = getApp()

// 导入 licia 工具库
const {debounce, mergeArr} = require('miniprogram-licia')

Page({
  data: {},

  async onLoad({ type }) {
    // 读取地址参数
    this.setData({type})

    // 防抖函数
    this.onScroll = debounce(function(ev) {
      // 解构数据，方便引用
      const {goodsItems, subType} = this.data
      // 保存滚动高度
      goodsItems[subType].scrollTop = ev.detail.scrollTop
    }, 300)

    // 统一管理请求咱径
    const urlMap = {
      1: '/home/preference/mutli',
      2: '/home/inVogue/mutli',
      3: '/home/oneStop/mutli',
      5: '/home/new/mutli'
    }

    // 定义页码相关的数据
    this._page = 1
    this._pageSize = 10

    // 定义数据来拦截无效的请求
    this._loading = false

    // 根据地址参数 type 的值来获得请求的路径
    this._url = urlMap[type]

    // console.log(this._url)

    // 调用接口，获取推荐列表数据
    const recommendData = await this.getRecommend()

    // 检测是否有更多数据
    for(let key in recommendData.goodsItems) {
      let item = recommendData.goodsItems[key]
      item.hasMore = item.page < item.pages
    }

    // 设置数据，更新渲染
    this.setData({
      ...recommendData,
      subType: recommendData.subTypes[0].id
    })

    // 动态更新导航栏标题
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },

  changeTab({mark}) {
    // 取出 subType 的 ID
    const subType = mark.id

    // 读取滚动高度
    const scrollTop = this.data.goodsItems[subType].scrollTop || 0

    // 记录 subType 的值
    this.setData({
      subType,
      scrollTop
    })
  },

  // 监听页面是否滚动到了底部
  async getMore() {
    // 检测是否有请求正在进行中
    if(this._loading) return

    // 解构数据，方便引用
    const {subType, goodsItems} = this.data

    // 如果没有更多数据了，就不应该再发请求了
    if(!goodsItems[subType].hasMore) return

    // 变更请求的状态（表明请求进行中）
    this._loading = true

    // 更新页码
    this._page = goodsItems[subType].page + 1

    // 
    const {
      goodsItems: {
        [subType]: {items, page, pages}
      }
    } = await this.getRecommend({
      subType,
      page: this._page,
      pageSize: this._pageSize
    })

    // console.log(items)

    // 将新请求的数据合并到原来的数据中
    mergeArr(goodsItems[subType].items, items)
    // 更新页码
    goodsItems[subType].page = page

    // 检测是否还有更多数据
    goodsItems[subType].hasMore = page < pages

    // 设置数据，更新渲染
    await this.setData({
      goodsItems
    })

    // 变更请求的状态（请求结束）
    this._loading = false
  },

  // 监听页面滚动
  // onScroll(ev) {
  //   console.log(ev.detail.scrollTop)

  //   // 解构数据，方便引用
  //   const {goodsItems, subType} = this.data

  //   // 保存滚动高度
  //   goodsItems[subType].scrollTop = ev.detail.scrollTop
  // },

  // 推荐列表接口
  getRecommend(query) {
    return http.get(this._url, query)
  }
})