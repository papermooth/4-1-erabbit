
Page({
  data: {
    filters: [
      {
        title: "品类",
        source: ['男下装', '男上装', '手表', '运动服', '服饰配件', '中大童装'],
        collapsed: true
      },
      {
        title: "款式",
        source: ['假两件', '开衫', '连帽', '日常便服', '双面穿', '套头'],
        collapsed: true
      },
      {
        title: '颜色',
        source: ['黑色', '白色', '灰色', '米色', '杏色', '卡其色',
        '棕色', '驼色'],
        collapsed: true
      },
      {
        title: '版型',
        source: ['紧身', '修身', '常规', '直筒', '宽松', '收腰'],
        collapsed: true
      }
    ]
  },

  byPriceRange() {
    this.animate('.door', [
      {width: '50%', height: '100%', ease: 'ease-out', offset: 0},
      {width: '50%', height: '99%', ease: 'ease-out', offset: .3},
      {width: '0%', height: '100%', ease: 'ease-in', offset: 1}
    ], 800)
  }
})