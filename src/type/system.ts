export interface TreeNode<T = any> {
  id: number | string
  label: string
  children?: TreeNode<T>[] | null
  [key: string]: T | undefined | number | string | TreeNode<T>[] | null
}

export interface GetUserInfoResponse {
  code: number
  msg: string
  permissions: string[]
  roles: string[]  // 如 ['admin']
  user: {
    userId: number
    userName: string
    nickName: string
    email: string
    phonenumber: string
    avatar?: string
  }
}

export interface User {
  userId: number
  userName: string
  nickName: string
  deptName: string
  phonenumber: string
  email: string
  status: string
  createTime: string
  deptId: number
}

export interface commonListResponse<T> {
  rows: T[]
  total: number
}

export interface menu {
  menuId: number
  menuName: string
  parentId: string
  orderNum: number
  path: string
  component: string
  status: string
  routeName: string
  query: string
  createTime: string
  perms: string
  isFrame: string
  isCache: string
  menuType: string
  visible: string
  
}

export interface dept {
  deptId: number
  deptName: string
  orderNum: number
  parentId: number
  createBy: string
  leader: string
  remark: string
  status: string
  createTime: string
}

export interface post {
  postId: number
  postName: string
  postCode: string
  postSort: number
  status: string
  createTime: string
  createBy: string
}

export interface loginLog {
  infoId: number
  userName: string
  ipaddr: string
  loginLocation: number
  browser: string
  os: string
  msg: string
  staloginTimetus: string
}

export interface operLog {
  operId: number
  title: string
  businessType: number
  operName: string
  operIp: string
  operLocation: number
  status: number
  operTime: string
  costTime: string
}


