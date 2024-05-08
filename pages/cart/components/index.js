
// 获取全局实例中的属性或方法
const {navigateTo, http} = getApp()

// 导放小程序计算属性扩展
const computedBehavior = require("miniprogram-computed").behavior

Component({
  behaviors: [computedBehavior],
  options: {
    // virtualHost: true
  },

  properties: {

  },

  computed: {
    isAll({cartData = []}) {
      return cartData.every((item) => {
        return item.selected
      })
    },

    amount({cartData = []}) {
      return cartData.reduce((total, item) => {
        if(!item.selected) return total
        return total += item.price * item.count
      }, 0)
    }
  },

  lifetimes: {
    async attached() {
      // 挂载跳由跳转的方法
      this.navigateTo = navigateTo

      // 调用猜你喜欢接口
      const {items: guessData} = await this.getGuess()

      // 设置数据，更新渲染
      this.setData({guessData})
    }
  },

  pageLifetimes: {
    async show() {
      // 更新登录状态
      this.setData({isLogin: !!wx.getStorageSync('token')})

      // 用户未登录时不需要请求数据
      if(!this.data.isLogin) return

      // 调用接口获取购物车商品列表
      const cartData = await this.getCart()

      // 设置数数据，更新渲染
      this.setData({cartData})
    }
  },

  data: {
    slideButtons: [
      {
        text: '移入收藏',
        extClass: 'slideview-collect-button'
      },
      {
        text: '删除',
        extClass: 'slideview-delete-button'
      }
    ],

    // 获取用户的登录状态
    isLogin: !!wx.getStorageSync('token')
  },

  /**
   * 组件的方法列表
   */
  methods: {

    async buttonTap({mark, detail: {index}}) {
      // console.log(mark)
      if(index === 0) return

      // 调用接口，删除商品
      await this.deleteCart({
        ids: [mark.skuId],
        clearAll: false,
        clearInvalid: false
      })

      // 删除本地的商品数据
      this.data.cartData.splice(mark.key, 1)
      // 设置数据，更新渲染
      this.setData({
        cartData: this.data.cartData
      })
    },

    // 删除购物车商品接口
    deleteCart(body) {
      return http.delete('/member/cart', body)
    },

    // 获取购物车商品列表接口
    getCart() {
      return http.get('/member/cart')
    },

    async checkAll() {
      // 解构数据，方便引用
      const {cartData} = this.data

      // 遍历数据修改 selected 属性
      cartData.forEach((item) => {
        item.selected = true
      })

      // 调用接口，更新选中的状态
      await this.updateAllCart()

      // 设置数据，重新渲染
      this.setData({cartData})
    },

    // 修改购物车商品接口
    updateCart(id, body) {
      return http.put('/member/cart/' + id, body)
    },

    // 全选购物车接口
    updateAllCart() {
      return http.put('/member/cart/selected', {
        selected: true,
        ids: []
      })
    },

    // 获取猜你喜欢接口
    getGuess() {
      return http.get('/home/goods/guessLike', {
        page: 1,
        pageSize: 10
      })
    },

    goPay() {

      // 验证数据（保证购物车中有商品被选中）
      if(this.data.amount === 0) return

      // 路由跳转
      wx.navigateTo({
        url: '/pages/order/create/index?channel=cart'
      })
    },

    async checkToggle({mark: {key, skuId}}) {
      // 解构数据，获取请求参数
      const {count, selected} = this.data.cartData[key]

      // 调用接口，修改商品数据
      await this.updateCart(skuId, {
        selected: !selected,
        count
      })

      // 拼凑路径
      const path = ['cartData', '[', key, ']', '.selected'].join('')

      // 变更数据，重新渲染
      this.setData({
        [path]: !selected
      })
    },

    async changeNumber({mark: {key, step, skuId}}) {
      if(!step) return

      // 获取待修改的商品数量
      let {count, stock} = this.data.cartData[key]

      // 最小边界
      if(count === 1 && step === -1) return
      // 最大边界
      if(count === stock && step === 1) return

      // 修改购买数量
      count += step

      // 调用接口，列新商品数
      await this.updateCart(skuId, { count })

      // 拼凑数据路径
      let path = ['cartData', '[', key, ']', '.count'].join('')

      // 设置数据，更新渲染
      this.setData({
        [path]: count
      })
    }
  }
})


