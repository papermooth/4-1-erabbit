// 导入全局实例中封装的属性或方法
const {navigateTo} = getApp()

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    source: Array
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  lifetimes: {
    attached() {
      this.navigateTo = navigateTo
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 切换地址交互
    selectAddress({mark: {id}}) {

      // 在地址列表中查找与用户点击的地址相同的id的地址
      this.data.source.forEach((item) => {
        // 如果找到了则将 isDefault 设置为 0
        if(item.id === id) {
          // 记录用户选择的地址数据
          this._shipment = item
          // 变更地址的选中状态
          return item.isDefault = 1
        }

        // 没有找到的则改成 0
        item.isDefault = 0
      })

      // 设置数据，更新渲染
      this.setData({
        source: this.data.source
      })
    },

    // 用户点击确定时触发自定义事件并传递数据
    confirm() {
      this.triggerEvent('onConfirm', {
        shipment: this._shipment
      })
    }
  }
})
