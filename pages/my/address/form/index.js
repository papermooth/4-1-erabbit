// 导入全局实例中封装的方法
const {http} = getApp()

// 导入封装好的验证表单数据的工具方法
import validate from '../../../../utils/validate'

Page({
  data: {
    receiver: '',
    contact: '',
    fullLocation: '',
    address: '',
    isDefault: 0,
    rules: {
      receiver: [
        {required: true, message: '收货人姓名不能为空~'}
      ],
      contact: [
        {required: true, message: '收货人电话不能为空~'},
        {pattern: '^1[3-9]\\d{9}$', message: '收货人电话格式不正确~'}
      ],
      fullLoaction: [
        {required: true, message: '收货人省市县不能为空~'}
      ],
      address: [
        {required: true, message: '收货人地址不能为空~'}
      ]
    }
  },

  async onLoad(params) {
    let {id} = params

    // 缓存获取到的 id
    this.id = id
    
    // 根据地址中的 id 参数，动态设置页面标题
    !id && wx.setNavigationBarTitle({
      title: '新建地址'
    })

    // 如果 id 不存在则为新建地址，无需查找地址原有数据
    if(!id) return

    // 调用接口，获取地址数据
    const address = await this.getAddress(id)

    // 设置数据，更新渲染
    this.setData({...address})
  },

  // 提交表单
  async sendForm(ev) {

    // 记录用户在表单填写的数据
    this.setData({...ev.detail.value})

    // 解构数据，方便引用
    const {rules, isDefault, provinceCode, cityCode, countyCode, ...data} = this.data

    // 验证表单数据是否合法
    if(!validate(rules, data)) return

    if(this.id) {
      // 调用接口修改地址
      await this.updateAddress(this.id, {
        ...data,
        isDefault,
        provinceCode,
        cityCode,
        countyCode
      })
    } else {
      // 调用接口新建地址
      await this.createAddress({
        ...data,
        isDefault,
        provinceCode,
        cityCode,
        countyCode
      })
    }

    // 返回上一页
    wx.navigateBack()
  },

  // 获取 picker 组件的数据
  getPickerValue(ev) {
    // 解构分别获得省市县对应的编码
    const [provinceCode, cityCode, countyCode] = ev.detail.code

    // 记录用户选择的省市县对应的编码
    this.setData({
      provinceCode,
      cityCode,
      countyCode,
      fullLocation: ev.detail.value.join(' ')
    })
  },

  // 获取 switch 组件的数据
  getSwitchValue(ev) {
    // 记录用户选择的 Switch 组件的数据
    this.setData({
      isDefault: ev.detail.value - 0
    })
  },

  // 新建地址接口
  createAddress(body) {
    return http.post('/member/address', body)
  },

  // 获取地址（旧）数据
  getAddress(id) {
    return http.get('/member/address/' + id)
  },

  // 更新收货地址接口
  updateAddress(id, body) {
    return http.put('/member/address/' + id, body)
  }
})