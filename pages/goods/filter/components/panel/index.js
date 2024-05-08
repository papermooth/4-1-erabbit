
Component({
  options: {
    addGlobalClass: true,
    virtualHost: true
  },
  externalClasses: ['class'],
  properties: {
    source: Array,
    collapsed: {
      type: Boolean,
      value: false
    },
    title: String
  },
  data: {

  },
  methods: {
    toggleMore() {
      this.setData({collapsed: !this.data.collapsed})
    }
  }
})