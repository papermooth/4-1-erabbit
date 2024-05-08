
// 使用验证规则 rules 验证表单数据 data
export default function (rules, data) {
  // 验证结果
  let valid = true
  // 1. 遍历验证规则
  for(let key in rules) {
    // 进一步遍历得到具体的验证规则
    for(let i = 0; i < rules[key].length; i++) {
      const rule = rules[key][i]
      // console.log(data[key], rule)
      if(rule.required) rule.pattern = /\S+/
      // 实例化正则对象
      const reg = new RegExp(rule.pattern)

      // 使用正则验证对应的数据
      if(!reg.test(data[key])) {
        wx.showToast({
          title: rule.message,
          icon: 'none'
        })
        // 标记数据是否合法
        valid = false

        break
      }
    }

    // 按顺序执行，上一个数据不合法时就不去验证下一下数据了
    if(!valid) break

  }

  // 返回验证结果
  return valid
}