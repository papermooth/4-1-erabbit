
Component({
  properties: {
    title: String,
    items: Array,
    defaultIndex: Number
  },

  data: {

  },

  methods: {
    onChange(ev) {
      // 切换选中状态
      this.setData({
        defaultIndex: ev.mark.index
      })
    },

    onConfirm() {
      let {defaultIndex} = this.data
      // 回传选中的数据
      this.triggerEvent('change', {
        ...this.data.items[defaultIndex],
        defaultIndex
      })
    }
  },
})
