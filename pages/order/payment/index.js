
const { safeArea, platform, navigateBack, navigateTo, switchTab } = getApp()

Page({
  data: {
    safeArea,
    platform
  },

  onLoad() {
    this.navigateBack = navigateBack
    this.navigateTo = navigateTo
    this.switchTab = switchTab

    // 关键帧动画
    this.animate('.navbar .title', [
      {opacity: 0},
      {opacity: 1}
    ], 600, {
      scrollSource: "#scrollView",
      timeRange: 600,
      startScrollOffset: 0,
      endScrollOffset: 200
    })
  },
})