
Page({
  data: {
    entering: true,
    focused: true,
    // 关键字
    currentKey: '手机',
    hotKeys: ['华为手机', '苹果', '戴森', '变形金刚'],
    historyKeys: ['施华洛世奇', '手机膜', '大米', '直饮水机', '笔记本', '戴维贝拉', '鼠标垫', '饮料', '矿泉水'],
    suggestions: []
  },

  startInput() {
    this.setData({entering: true})
  },

  clearInput() {
    // 重置搜索状态
    this.setData({
      currentKey: '',
      suggestions: [],
      entering: true
    })
    // 光标聚焦
    wx.nextTick(() => this.setData({focused: true}))
  },

  // 获得搜索建议
  getSuggestion(ev) {

    let suggestions = [
      {
        match: '支架',
        related: ['懒人支架', '电动车', '汽车']
      },
      {
        match: '华为',
        related: ['mate30', '5G', 'nova6']
      },
      {
        match: '壳',
        related: ['iPhone11', 'iPhoneX', 'mate30']
      },
      {
        match: '贴膜',
        related: ['小米10', '苹果11', '钢化膜']
      },
      {
        match: '卡',
        related: ['无限流量', '流量卡', '中国移动']
      }
    ]

    if(!ev.detail.value) {
      suggestions = []
    }

    this.setData({suggestions})

    console.log('发送请求...')
  },

  // 执行搜索
  execQuery(ev) {
    // 更新查询关键字
    let {keywords} = ev.target.dataset
    if(keywords) {
      this.setData({
        currentKey: keywords
      })
    }

    // 更改查询状态
    this.setData({
      entering: false
    })

    if(!this.data.currentKey) return

    this.setData({
      goods: [
        {
          id: 1,
          path: '/static/uploads/goods_big_2.jpg',
          name: '荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型',
          wish: 2146,
          present: 899,
          original: 999
        },
        {
          id: 2,
          path: '/static/uploads/goods_big_2.jpg',
          name: '荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型',
          wish: 2146,
          present: 899,
          original: 999
        },
        {
          id: 3,
          path: '/static/uploads/goods_big_3.jpg',
          name: '荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型',
          wish: 2146,
          present: 899,
          original: 999
        },
        {
          id: 4,
          path: '/static/uploads/goods_big_4.jpg',
          name: '荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型',
          wish: 2146,
          present: 899,
          original: 999
        },
      ]
    })

    console.log('发送请求...')
  }
})