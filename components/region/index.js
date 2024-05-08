
// 中国行政区划数据
import region from "./region";

// 小程序扩展计算属性
const computedBehavior = require('miniprogram-computed').behavior

Component({
  behaviors: [computedBehavior],

  properties: {
    codes: {
      type: Array,
      value: []
    },
    placeholder: String
  },

  computed: {
    
    province () {
      return region[0]
    },

    city (data) {
      const { code } = data.province[data.values[0]]
      return region[1].filter((city) => {
        return city.belong === code
      })
    },

    county (data) {
      const { code } = data.city[data.values[1]]
      return region[2].filter((county) => {
        return county.belong === code
      })
    }
  },

  data: {
    values: [0, 0, 0]
  },

  lifetimes: {
    attached () {
      this._map = ['province', 'city', 'county']

      this.codeToValues()
      this.getNameByValue()
    }
  },

  methods: {
    codeToValues () {    
      if (!this.data.codes.length) return
      // 获取 code 对应省市县的索引值
      this.setData({
        values: region.map((item, index) => {
          let array = item

          if (index > 0) {
            array = item.filter((t) => {
              return t.belong == this.data.codes[index - 1]
            })
          }
  
          return array.findIndex((j) => {
            return j.code == this.data.codes[index]
          })
        })
      })
    },

    getNameByValue () {
      const { values } = this.data
      const length = this.data.codes.length

      // 根据索引值获取省市县名称
      let selectedNames = values.map((value, key) => {
        const array = this.data[this._map[key]]
        this.data.codes[key] = array[value].code
        return array[value].name
      }).join(' ')

      if (length === 0) selectedNames = ''

      // 将 code 传递到组件外部
      this.triggerEvent('change', {
        codes: length > 0 ? this.data.codes : ''
      })

      // 设置数据，更新渲染
      this.setData({
        selectedNames
      })
    },

    onChange () {
      this.getNameByValue()
    },

    onColumnChange ({ detail: { column, value } }) {
      // 获取选中数据的索引值
      this.data.values[column] = value
      for (let i = 0; i < this.data.values.length; i++) {
        if (i > column) this.data.values[i] = 0
      }
      
      // 设置数据，更新渲染
      this.setData({
        values: this.data.values
      })
    },

    
  }
})
