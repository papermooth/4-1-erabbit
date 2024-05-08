
// 获取全局实例中封装的方法或属性
const {navigateTo, http} = getApp()

Page({
  data: {},

  async onLoad() {
    // 挂载路由跳转的方法
    this.navigateTo = navigateTo

    // 初始缓存数据
    this._cacheData = {}

    // 调用接口获取广告位数据
    const bannerData = await this.getBanner()

    // 调用接口获取一级类目的数据
    const topCategoryData = await this.getTopCategory()

    // 默认的一级类目的 ID
    const topID = topCategoryData[0].id

    // 调用接口获取默认的二级类目数据
    const subCategoryData = await this.getSubCategory(topID)

    // 缓存请求来的二级类目数据
    this._cacheData[topID] = subCategoryData

    // 设置数据，更新渲染
    this.setData({
      bannerData,
      topCategoryData,
      topID,
      subCategoryData
    })
  },

  async onTap(ev) {
    // 一级类目的 ID
    const topID = ev.mark.id

    // 调用接口获取二级类目的数据
    const subCategoryData = this._cacheData[topID] || await this.getSubCategory(topID)

    // 缓存二级类目的数据
    this._cacheData[topID] = subCategoryData

    // 设置数据，记录用户点击的是哪个一级类目
    this.setData({
      topID: ev.mark.id,
      subCategoryData,
      scrollTop: 0
    })
  },

  // 广告位接口
  getBanner() {
    return http.get('/home/banner', {
      distributionSite: 2
    })
  },

  // 一级类目接口
  getTopCategory() {
    return http.get('/category/top')
  },

  // 二级类目接口
  getSubCategory(id) {
    return http.get('/category', {id})
  }
})