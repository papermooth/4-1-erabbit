Component({
  properties: {
    source: {
      type: Array,
      value: []
    }
  },

  data: {
    activeIndex: 0
  },

  methods: {
    // 更新指示器状态
    swiperChanged (ev) {
      this.setData({
        activeIndex: ev.detail.current
      })
    }
  },
})