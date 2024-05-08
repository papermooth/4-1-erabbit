// 导入全局实例中的属性或方法
const {http} = getApp()

Page({
  data: {
    loaded: false,
    slideButtons: [
      {
        text: '删除',
        extClass: 'slideview-delete-button'
      }
    ],
  },

  async onShow() {
    // 记录请求的状态
    this.setData({loaded: false})

    // 调用接口，获取地址列表
    const addressData = await this.getAddress()

    // 设置数据，更新渲染
    this.setData({addressData, loaded: true})
  },

  onLoad({flag}) {
    // 获取地址参数
    this._flag = flag
  },

  // 监听用户是否点击了 slideview 的按钮
  async buttonTap({mark: {id, index}}) {
    console.log(id, index)

    // 调用接口，删除地址
    await this.deleteAddress(id)

    // 更新数据
    this.data.addressData.splice(index, 1)

    // 设置数据，更新渲染
    this.setData({addressData: this.data.addressData})

  },

  createAddress() {
    wx.navigateTo({
      url: '/pages/my/address/edit/index'
    })
  },

  // 地址列表接口
  getAddress() {
    return http.get('/member/address')
  },

  // 删除地址接口
  deleteAddress(id) {
    return http.delete('/member/address/' + id)
  },

  getAddressInfo({mark: {address}}) {
    // 如果不是通过订单信息跳转的，则不执行任何逻辑
    if(!this._flag) return

    // 获取全部页面实例
    const pages = getCurrentPages()
    // 访问到上一页页面实例
    const prevPage = pages[pages.length - 2]
    // 调用上一页页面实例的方法，重新渲染页面
    prevPage.setData({
      'orderInfo.userAddresses': [address]
    })

    // 返回上一页
    wx.navigateBack()
  }
})