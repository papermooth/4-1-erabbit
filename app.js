
// 服务器地址：http://pcapi-xiaotuxian-front-devtest.itheima.net
// 测试商品ID：1608018

// 导入了 http 模块
import http from './utils/http'

App({
  onLaunch() {
    // 读取系统相关信息
    const { safeArea, platform } = wx.getSystemInfoSync()
    this.safeArea = safeArea
    this.platform = platform

    // 将 http 模块挂载到全局实例中
    this.http = http
  },

  navigateTo(ev) {
    wx.navigateTo(ev.mark)
  },
  
  navigateBack(ev) {
    wx.navigateBack(ev.mark)
  },

  switchTab(ev) {
    wx.switchTab(ev.mark)
  }
})