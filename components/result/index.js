
const { navigateTo } = getApp()

Component({
  options: {
    addGlobalClass: true
  },
  data: {
    goods: [
      {
        id: 1,
        path: 'http://static.botue.com/erabbit/static/uploads/goods_big_2.jpg',
        name: '荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型',
        wish: 2146,
        present: 899,
        original: 999
      },
      {
        id: 2,
        path: 'http://static.botue.com/erabbit/static/uploads/goods_big_2.jpg',
        name: '荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型',
        wish: 2146,
        present: 899,
        original: 999
      },
      {
        id: 3,
        path: 'http://static.botue.com/erabbit/static/uploads/goods_big_3.jpg',
        name: '荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型',
        wish: 2146,
        present: 899,
        original: 999
      },
      {
        id: 4,
        path: 'http://static.botue.com/erabbit/static/uploads/goods_big_4.jpg',
        name: '荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型',
        wish: 2146,
        present: 899,
        original: 999
      },
      {
        id: 5,
        path: 'http://static.botue.com/erabbit/static/uploads/goods_big_2.jpg',
        name: '荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型',
        wish: 2146,
        present: 899,
        original: 999
      },
      {
        id: 6,
        path: 'http://static.botue.com/erabbit/static/uploads/goods_big_2.jpg',
        name: '荣耀Play3 6.39英寸魅眼全视屏 4000mAh大电池 全新机型',
        wish: 2146,
        present: 899,
        original: 999
      },
    ],
    selecting: false,
    optionIndex: 0,
    optionValue: '综合',
    tabIndex: 0,
    sortIcon: 'icon-sort'
  },

  lifetimes: {
    attached() {
      // 挂载路由跳转方法
      this.navigateTo = navigateTo
    }
  },

  methods: {
    // 综合筛选
    changeOption(ev) {
      let {index, option} = ev.mark

      let data = {selecting: false}

      if(index && option) {
        data.optionIndex = index,
        data.optionValue = option
      }

      this.setData(data)
    },

    // 综合下拉选择
    doSelect(ev) {
      let {index} = ev.mark

      this.setData({
        selecting: !this.data.selecting,
        tabIndex: index,
        sortIcon: 'icon-sort'
      })
    },

    // 按价格
    byPrice(ev) {
      let {index} = ev.mark
      // 字体图标
      let sortIcon = this.data.sortIcon !== 'icon-down' 
        ? 'icon-down'
        : 'icon-up'

      this.setData({
        tabIndex: index,
        selecting: false,
        sortIcon
      })
    },

    // 按销量
    bySales(ev) {
      let {index} = ev.mark

      this.setData({
        tabIndex: index,
        selecting: false,
        sortIcon: 'icon-sort'
      })
    }
  }
})