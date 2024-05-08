
// 导入 MoBx 相关的模块
import { observable, action } from "mobx-miniprogram"

// 创建状态管理器
export const store = observable({
  // 初始数据
  skuLabel: '',
  number: 1,

  // 修改数据的方法
  updateSkuLabel: action(function (skuLabel) {
    this.skuLabel = skuLabel
  }),

  // 修改商品数量
  updateNumber: action(function (number) {
    this.number = number
  })
})