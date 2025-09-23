

function handleTree(data: any[], id: string, parentId: string, children: string) {
  let config = {
    id: id || 'id',
    parentId: parentId || 'parentId',
    childrenList: children || 'children'
  }

  let childrenListMap: any = {}
  let tree: any = []
  for (let d of data) {
    let id = d[config.id]
    childrenListMap[id] = d
    if (!d[config.childrenList]) {
      d[config.childrenList] = []
    }
  }

  for (let d of data) {
    let parentId: string = d[config.parentId]
    let parentObj: any = childrenListMap[parentId]
    if (!parentObj) {
      tree.push(d)
    } else {
      parentObj[config.childrenList].push(d)
    }
  }
  return tree
}

export default handleTree