// 从 新数组里 过滤某些原来有的项目 将其某些字段保留
// 用于保留 customers groups中的 界面状态字段
const remain = function (oldItems: any[], newItems: any[], remainFields: string[] = [], resolver = (e) => e.id) {
  const retItems = newItems.map(newItem => {
    const oldItem = oldItems.find(e => resolver(e) === resolver(newItem))
    if (oldItem) {
      const remainFieldsObj = remainFields.reduce((accu, curr) => {
        accu[curr] = oldItem[curr]
        return accu
      }, {})
      return {
        ...newItem,
        ...remainFieldsObj
      }
    } else {
      return newItem
    }
  })

  return retItems
}

const deduplicate = function (arr, resolver = (e) => e) {
  const ret = []
  for (const e of arr) {
    if (!ret.find(remain => resolver(remain) === resolver(e))) {
      ret.push(e)
    }
  }

  return ret
}

const phoneRe = /^1[3|4|5|7|8][0-9]{9}$/ 

export { remain, deduplicate, phoneRe }