
Component({
  options: {
    virtualHost: true
  },
  properties: {
    item: String
  },
  data: {
    checked: false
  },
  methods: {
    toggleChecked() {
      this.setData({checked: !this.data.checked})
    }
  }
})