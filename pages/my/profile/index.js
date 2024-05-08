// 导入全局实例中的属性或方法
const {safeArea, navigateBack, http} = getApp()

// 导入封装好的验证表单数据的方法
import validate from '../../../utils/validate'

Page({
  data: {
    safeArea,
    rules: {
      nickname: [
        {required: true, message: '昵称不能为空!'},
        {pattern: '^[\\s\\S]{1,16}$', message: '昵称长度不能超过16位!'}
      ],
      profession: [
        {required: true, message: '职业不能为空!'},
        {pattern: '^[\\s\\S]{1,8}$', message: '职业长度不能超过8位!'}
      ]
    }
  },

  async onLoad() {
    // 公共跳由跳转方法
    this.navigateBack = navigateBack

    // 调用接口获取个人信息
    const profile = await this.getProfile()

    // 设置数据，列新渲染
    this.setData({...profile})
  },
  // 拍照/打开机册
  chooseImage() {
    // 调用API打开相册或拍照
    wx.chooseImage({
      count: 1,
      success: async (res) => {
        // console.log(res.tempFilePaths[0])

        // 将用户选择的图片上传到服务端
        // 调用小程序的 API 
        // wx.uploadFile()

        // 调用封装好的文件上传的方法
        await http.upload('/member/profile/avatar', {
          name: 'file',
          filePath: res.tempFilePaths[0]
        })

        // 设置数据，更新渲染
        this.setData({
          avatar: res.tempFilePaths[0]
        })
      }
    })
  },

  // 提交表单
  async sendForm({detail: {value: {nickname, profession}}}) {
    // 在此获取表单的数据
    // console.log(ev)

    // 解构数据，方便引用
    const {gender, birthday, rules} = this.data

    // 如果数据不合法，则无需发起请求
    if(!validate(rules, {nickname, profession})) return

    // 调用数据接口将获得到的数据发送到服务端
    const userInfo = await this.updateProfile({
      nickname,
      profession,
      gender,
      birthday
    })

    // 更新本地存储
    wx.setStorageSync('userInfo', userInfo)
  },

  // 获取单选框的数据
  getRadioValue(ev) {
    // 更新数据
    this.setData({gender: ev.detail.value})
  },

  // 获取下拉框的数据
  getPickerValue(ev) {
    // 更新数据
    this.setData({
      birthday: ev.detail.value
    })
  },

  // 获取个人信息接口
  getProfile() {
    return http.get('/member/profile')
  },

  // 更新个人信息接口
  updateProfile(body) {
    return http.put('/member/profile', body)
  }
})