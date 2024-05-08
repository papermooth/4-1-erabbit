
// 导入全局实例中的属性或方法
const {http} = getApp()

// 导入 MoBx 相关的模块
import {storeBindingsBehavior} from "mobx-miniprogram-bindings";
import {store} from "../../store"

// 导入数组拆分的算法
import powerSet from '../../../../utils/bwPowerSet'

Component({
  behaviors: [storeBindingsBehavior],
  storeBindings: {
    store,
    fields: ['skuLabel', 'number'],
    actions: ['updateSkuLabel', 'updateNumber'],
  },

  properties: {
    buttonType: String,
    source: Object,
    shipment: Object
  },

  data: {
    
  },

  lifetimes: {
    attached() {
      // 提交部分数据，方便引用
      const {
        mainPictures,
        price,
        oldPrice,
        inventory,
        specs
      } = this.data.source

      // 初始化数据，用于记录用户所选择的规格型号
      this._checkedSpecs = {}
      specs.forEach((spec) => {
        this._checkedSpecs[spec.name] = ''
      })

      // 初始未选择规格型号的类别名称
      this._uncheckedSpecs = this.data.skuLabel.split('/')

      // 测试skus数据改造
      this.formatSkus()

      // 设置数据，更新渲染
      this.setData({
        goods: {
          picture: mainPictures[0],
          price,
          oldPrice,
          inventory,
          specs
        }
      })
    }
  },

  methods: {
    // 构造新数据结构
    formatSkus() {
      // 获取 skus 的数据，然后进行遍历
      const {skus} = this.data.source
      this._skus = skus.reduce((_skus, {specs, ...sku}) => {
        const keys = specs.map((spec) => {
          return spec.valueName
        })

        // 通过算法拆分数组
        const subset = powerSet(keys)

        // 遍历拆分后的数组单
        subset.forEach((item) => {
          // 如果数组长度为0时没有必要存储
          if(item.length === 0) return

          // 把数组拼凑字符串充当key
          const key = item.sort().join('|')

          // 将数据保存到 _skus 中
          _skus[key] = _skus[key]
            ? [].concat(_skus[key]).concat(sku)
            : sku
        })

        return _skus
      }, {})
    },

    // 监听用户点击修改商品数量
    changeNumber({mark}) {

      // 排除input组件
      if(!mark.step) return

      // 解构数据，获取商品数量
      let {number} = this.data

      // 获取前的库存量
      let {inventory} = this.data.goods

      // 控制商品数量的修改边界
      if(number === 1 && mark.step === -1) return
      if(number === inventory && mark.step === 1) return

      // 修改商品数量
      number += mark.step

      // 更新数据
      this.updateNumber(number)
    },

    // 监听用户点击规格型号
    toggleState({mark: {row, column}}) {
      // 解构全部的规格型号数据
      let {specs, picture, inventory, price, oldPrice} = this.data.goods
      // 获取具体的规格型号
      const {name, values} = specs[row]
      // 为被点击的规格型号扩展 checked 属性
      values.forEach((value, index) => {
        if(column === index) {
          // 动态获取图片地址并重新赋值
          picture = value.picture || picture
          value.checked = !value.checked

          // 记录用户所选择的规格型号
          if(value.checked) {
            this._checkedSpecs[name] = value.name
          } else {
            this._checkedSpecs[name] = ''
          }
        } else {
          value.checked = false
        }
      })

      // 获取未选择的规格型号类别名称
      this._uncheckedSpecs = []
      for(let key in this._checkedSpecs) {
        if(!this._checkedSpecs[key]) {
          this._uncheckedSpecs.push(key)
        }
      }

      // 提取用户所选择的 sku 相关数据
      const keys = Object.values(this._checkedSpecs).filter(key => key)

      // 获取全部规格型号的名称
      this.checkState(keys)

      // 获取用户选择部分规格型号所展示的结果
      let skuLabel = this._uncheckedSpecs.join('/')
      // 初始数据保存库存信息
      let sku = {}

      // 保存获取到的库存信息
      sku = this._skus[keys.sort().join('|')]

      // 如果值为对象时则直接获取库存及价格数据
      inventory = sku.inventory
      price = sku.price
      oldPrice = sku.oldPrice

      // 获取 sku 对应的 id 数据
      this.skuId = sku.id

      // 如果值为数组时，价格展示最小，库存展示总和
      if(sku instanceof Array) {
        // 排序获取最小价格
        inventory = sku.sort((a, b) => {
          return a.price - b.price
          // 获取库存总和
        }).reduce((total, item) => {
          return total += item.inventory
        }, 0)

        price = sku[0].price
        oldPrice = sku[0].oldPrice
      }

      // 获取用户选择全部规格型号所展示的结果
      if(this._uncheckedSpecs.length === 0) {
        // 展示用户所选择的sku名称
        skuLabel = keys.join('/')
      }

      // 更新状态
      this.updateSkuLabel(skuLabel)

      // 设置数据，更新渲染
      this.setData({
        'goods.specs': specs,
        'goods.picture': picture,
        'goods.price': price,
        'goods.oldPrice': oldPrice,
        'goods.inventory': inventory
      })
    },

    // 检测库存量
    checkState(keys) {
      // 获取 specs 数据
      const {specs} = this.data.source
      // 获取到全部的规格型号的名称
      specs.forEach((spec) => {
        const names = spec.values.map((value) => {
          return value.name
        })

        // 过滤掉重合的规格型号
        const com = keys.filter((key) => {
          return !names.some((name) => {
            return name === key
          })
        })

        // 组合规格型号
        names.forEach((name, index) => {
          const key = [name, ...com].sort().join('|')
          // 查找库存信息
          const sku = this._skus[key]

          // 获取库存量
          let inventory = sku.inventory

          // 如果为数组需要累加库存量
          if(sku instanceof Array) {
            inventory = sku.reduce((total, item) => {
              return total += item.inventory
            }, 0)
          }

          // 如果库存量为0则添加 disabled 属性，用于标明禁用状态
          spec.values[index].disabled = false
          if(inventory === 0) {
            spec.values[index].disabled = true
          }
        })
      })

      // 设置数据，更新渲染
      this.setData({
        'goods.specs': specs
      })

    },

    // 验证规格型号是否全选
    validateSpecs() {
      // 用户未选择全部规格型号
      if(this._uncheckedSpecs.length != 0) {
        wx.showToast({
          title: '请选择' + this._uncheckedSpecs[0],
          icon: 'none'
        })

        return false
      }

      // 选择了全部规格型号
      return true
    },

    // 验证用户是否是登录的状态
    validateLogin() {
      // 读取 token 判断是否登录
      const token = wx.getStorageSync('token')

      // 如果未登录则跳转到登录页
      !token && wx.navigateTo({
        url: '/pages/login/index',
      })

      // 返回验证结果
      return token
    },

    // 添加购物车
    async addCart() {
      // 验证是否选择了完整的规格型号
      if(!this.validateSpecs()) return

      // 验证用户是否登录并获取 token
      const token = this.validateLogin()
      if(!token) return

      // 调用接口，添加商品到购物车
      const res = await http.post('/member/cart', {
        skuId: this.skuId,
        count: this.data.number
      })

      // 添加失败的内容
      let title = '添加失败, 稍后重试!'

      if(res) {
        title = '亲, 我在购物车等你哦~'

        // 关闭弹层
        this.triggerEvent('onConfirm')
      }

      // 提示消息
      wx.showToast({
        title,
        icon: 'none'
      })
    },

    goPay() {
      // 验证是否选择了完整的规格型号
      if(!this.validateSpecs()) return

      // 验证用户是否登录并获取 token
      const token = this.validateLogin()
      if(!token) return

      // 路由跳转
      wx.navigateTo({
        url: '/pages/order/create/index?channel=now',
        success: (res) => {
          // 处罚事件并传递数据
          res.eventChannel.emit('getPageData', {
            skuId: this.skuId,
            count: this.data.number,
            addressId: this.data.shipment.id
          })
        }
      }) 
    }
  }
})
